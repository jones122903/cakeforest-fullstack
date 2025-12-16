import React, { useEffect, useState, useRef } from "react";
import { Drawer, Tabs, Badge, Button, Space, Empty } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./notification.module.css";

const NotificationDrawer = ({ open, setOpen }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const api_url = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const notificationSound = "/notification.mp3";
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    const hasPending = orders.some((order) => order.status === "pending");

    if (hasPending) {
      console.log("🔊 Playing sound");
      audioRef.current.play().catch((err) => {
        console.log("Play blocked", err);
      });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [orders]);

  const getNotification = async () => {
    try {
      const response = await axios.get(`${api_url}/notifications`);
      const notifications = response.data.notifications;

      const mappedOrders = notifications
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
            status: status,
          };
        });

      setOrders(mappedOrders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (open) {
      getNotification();
    }
  }, [open]);

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const acceptedOrders = orders.filter((o) => o.status === "accepted");

  const handleAccept = async (notificationId) => {
    await axios.post(`${api_url}/notifications/accept/${notificationId}`);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    getNotification();
  };

  const handleReject = async (notificationId) => {
    try {
      await axios.put(`${api_url}/notifications/${notificationId}/reject`);
      getNotification();
    } catch (err) {
      console.log(err);
    }
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
          <div className={styles.cakeName}>🎂 {cake.name}</div>
          <div className={styles.cakeDetails}>
            {cake.weight} × {cake.quantity}
          </div>
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
        <Badge status="success" text="Accepted" style={{ marginTop: 16 }} />
      )}

      {order.status === "rejected" && (
        <Badge status="error" text="Rejected" style={{ marginTop: 16 }} />
      )}
    </div>
  );

  const tabItems = [
    {
      key: "pending",
      label: `Pending (${pendingOrders.length})`,
      children:
        pendingOrders.length > 0 ? (
          pendingOrders.map(renderOrder)
        ) : (
          <Empty description="No pending orders" />
        ),
    },
    {
      key: "accepted",
      label: `Accepted (${acceptedOrders.length})`,
      children:
        acceptedOrders.length > 0 ? (
          acceptedOrders.map(renderOrder)
        ) : (
          <Empty description="No accepted orders" />
        ),
    },
  ];

  return (
    <Drawer
      title="Notifications"
      placement="right"
      onClose={() => setOpen(false)}
      open={open}
      width={400}
      closeIcon={<CloseOutlined />}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </Drawer>
  );
};

export default NotificationDrawer;