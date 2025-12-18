import React, { useEffect, useState, useRef } from "react";
import { Drawer, Tabs, Badge, Button, Space, Empty } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./notification.module.css";

const NotificationDrawer = ({ open, setOpen }) => {
  const api_url = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]);

  const audioRef = useRef(null);
  const prevPendingCount = useRef(0); // 🔑 IMPORTANT

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const acceptedOrders = orders.filter((o) => o.status === "accepted");

  // 🔊 Init audio ONE TIME
  useEffect(() => {
    audioRef.current = new Audio(`http://localhost:5000/public/sounds/notification.mp3`);
    audioRef.current.loop = true;
  }, [api_url]);

  // 🔔 PLAY SOUND ONLY WHEN NEW ORDER ARRIVES
  useEffect(() => {
    if (pendingOrders.length > prevPendingCount.current) {
      audioRef.current
        .play()
        .catch(() => console.log("🔇 Autoplay blocked"));
    }

    if (pendingOrders.length === 0) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    prevPendingCount.current = pendingOrders.length;
  }, [pendingOrders.length]);

  // 📥 Fetch notifications
  const getNotification = async () => {
    try {
      const res = await axios.get(`${api_url}/notifications`);
      const notifications = res.data.notifications;

      const mapped = notifications
        .filter((n) => n.orderId)
        .map((n) => {
          const order = n.orderId;

          let status = "pending";
          if (n.isRejected) status = "rejected";
          else if (n.isAccepted) status = "accepted";

          return {
            mongoId: order._id,
            notificationId: n._id,
            id: order.orderId,
            customerName: order.deliveryDetails.fullName,
            phone: order.deliveryDetails.phone,
            cakes: order.cartItems.map((item) => ({
              name: item.cakeName,
              weight: item.weight,
              quantity: item.quantity,
            })),
            totalAmount: `₹${order.totalAmount}`,
            deliveryAddress: `${order.deliveryDetails.address.flatNo}, ${order.deliveryDetails.address.street}, ${order.deliveryDetails.address.city} - ${order.deliveryDetails.address.pincode}`,
            deliveryTime: order.deliveryTime,
            orderTime: new Date(n.createdAt).toLocaleString(),
            status,
          };
        });

      setOrders(mapped);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔄 Continuous polling - check for new orders every 5 seconds
  useEffect(() => {
    // Initial fetch
    getNotification();

    // Set up polling interval
    const interval = setInterval(() => {
      getNotification();
    }, 50000); // Check every 5 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // 🔄 Refresh when drawer opens
  useEffect(() => {
    if (open) {
      getNotification();
    }
  }, [open]);

  // ✅ Accept
const handleAccept = async (id) => {
  try {
    const res = await axios.put(
      `${api_url}/notifications/${id}/accept`
    );

    if (res.data.success) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      getNotification();

      // refresh orders table
      window.dispatchEvent(new Event("refreshOrders"));
    }
  } catch (error) {
    toast.error("Accept failed");
  }
};



  // ❌ Reject
  const handleReject = async (id) => {
    await axios.put(`${api_url}/notifications/${id}/reject`);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    getNotification();
  };

  const renderOrder = (order) => (
    <div key={order.id} className={styles.notificationCard}>
      <div className={styles.orderHeader}>
        <span className={styles.orderId}>{order.id}</span>
        <span className={styles.orderTime}>{order.orderTime}</span>
      </div>

      <div className={styles.orderDetails}>
        <div className={styles.detailRow}>
          <span className={styles.label}>Customer</span>
          <span className={styles.value}>{order.customerName}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Phone</span>
          <span className={styles.value}>{order.phone}</span>
        </div>
      </div>

      {order.cakes.map((cake, i) => (
        <div key={i} className={styles.cakeItem}>
          🎂 {cake.name} ({cake.weight} × {cake.quantity})
        </div>
      ))}

      {order.status === "pending" && (
        <Space style={{ marginTop: 16 }}>
          <Button
            type="primary"
            style={{ backgroundColor: "#52c41a" }}
            onClick={() => handleAccept(order.notificationId)}
          >
            Accept
          </Button>
          <Button danger onClick={() => handleReject(order.notificationId)}>
            Reject
          </Button>
        </Space>
      )}

      {order.status === "accepted" && (
        <Badge status="success" text="Accepted" />
      )}

      {order.status === "rejected" && (
        <Badge status="error" text="Rejected" />
      )}
    </div>
  );

  const tabItems = [
    {
      key: "pending",
      label: `Pending (${pendingOrders.length})`,
      children: pendingOrders.length ? pendingOrders.map(renderOrder) : <Empty />,
    },
    {
      key: "accepted",
      label: `Accepted (${acceptedOrders.length})`,
      children: acceptedOrders.length
        ? acceptedOrders.map(renderOrder)
        : <Empty />,
    },
  ];

  return (
    <Drawer
      title="Notifications"
      placement="right"
      open={open}
      onClose={() => setOpen(false)}
      width={400}
      closeIcon={<CloseOutlined />}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </Drawer>
  );
};

export default NotificationDrawer;
