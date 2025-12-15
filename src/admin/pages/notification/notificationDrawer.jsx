import React, { useEffect, useState } from "react";
import styles from "./notification.module.css";
import axios from "axios";

const NotificationDrawer = ({ open, setOpen }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const api_url = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]);



 const getNotification = async () => {
  try {
    const response = await axios.get(`${api_url}/notifications`);

    const notifications = response.data.notifications;

    // 🔁 Convert backend response → UI order format
    const mappedOrders = notifications.map((n) => {
      const order = n.orderId;

      return {
        mongoId: order._id,
        id: order.orderId, // ORDxxxx
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
        orderTime: new Date(n.createdAt).toLocaleString(), // or "10 mins ago"
        status: order.status === "pending" ? "pending" : "completed",
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


const pendingOrders = orders.filter(o => o.status === "pending");
const completedOrders = orders.filter(o => o.status !== "pending");




  const handleAccept = async (orderMongoId) => {
  try {
    await axios.patch(
      `${api_url}/orders/${orderMongoId}/status`,
      { status: "completed" }
    );

    // 🔁 Refresh notifications from DB
    getNotification();
  } catch (err) {
    console.log(err);
  }
};


  const handleReject = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "rejected" } : o))
    );
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

      {order.status === "pending" ? (
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.acceptButton}`}
            onClick={() => handleAccept(order.mongoId)}
          >
            ✓ Accept
          </button>
          <button
            className={`${styles.button} ${styles.rejectButton}`}
            onClick={() => handleReject(order.id)}
          >
            ✕ Reject
          </button>
        </div>
      ) : (
        <span
          className={`${styles.statusBadge} ${
            order.status === "completed"
              ? styles.completedBadge
              : styles.rejectedBadge
          }`}
        >
          {order.status === "completed" ? "✓ Completed" : "✕ Rejected"}
        </span>
      )}
    </div>
  );

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayVisible : ""}`}
        onClick={() => setOpen(false)}
      />

      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Notifications</h2>
          <button className={styles.closeButton} onClick={() => setOpen(false)}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tab} ${
                activeTab === "pending" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending ({pendingOrders.length})
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "completed" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Completed ({completedOrders.length})
            </button>
          </div>

          {(activeTab === "pending"
            ? pendingOrders
            : completedOrders
          ).length > 0 ? (
            (activeTab === "pending"
              ? pendingOrders
              : completedOrders
            ).map(renderOrder)
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📭</div>
              No orders
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
