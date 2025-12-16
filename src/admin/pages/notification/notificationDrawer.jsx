import React, { useEffect, useState,useRef } from "react";
import styles from "./notification.module.css";
import axios from "axios";
 



const NotificationDrawer = ({ open, setOpen }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const api_url = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]);
  const notificationSound = "/notification.mp3";
  const audioRef = useRef(null);

useEffect(() => {
  audioRef.current = new Audio(notificationSound);
  audioRef.current.loop = true; // 🔁 accept varaikum repeat
}, []);

useEffect(() => {
  const hasPending = orders.some(
    (order) => order.status === "pending"
  );

  if (hasPending) {
    console.log("🔊 Playing sound");
    audioRef.current.play().catch(err => {
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



      // 🔁 Convert backend response → UI order format
      const mappedOrders = notifications
  .filter((n) => n.orderId)
  .map((n) => {
    const order = n.orderId;

     let status = "pending";

if (n.isRejected) status = "rejected";
else if (n.isAccepted) status = "accepted";

    return {
      mongoId: order._id,
      notificationId: n._id,   // ⭐ VERY IMPORTANT
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

      // 🔥 KEY CHANGE
      status:status
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
  const acceptedOrders = orders.filter(o => o.status === "accepted");



  const handleAccept = async (notificationId) => {
  await axios.post(`${api_url}/notifications/accept/${notificationId}`);

  audioRef.current.pause();
  audioRef.current.currentTime = 0;

  getNotification(); // refresh
};




  const handleReject = async (notificationId) => {
  try {
    await axios.put(
      `${api_url}/notifications/${notificationId}/reject`
    );

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
  <>
    <button
      className={styles.acceptButton}
      onClick={() => handleAccept(order.notificationId)}
    >
      Accept
    </button>

    <button
      className={styles.rejectButton}
      onClick={() => handleReject(order.notificationId)}
    >
      Reject
    </button>
  </>
)}


{order.status === "accepted" && (
  <span className="badge accepted">Accepted</span>
)}

{order.status === "rejected" && (
  <span className="badge rejected">Rejected</span>
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
    activeTab === "accepted" ? styles.activeTab : ""
  }`}
  onClick={() => setActiveTab("accepted")}
>
  Accepted ({acceptedOrders.length})
</button>

          </div>

          {(activeTab === "pending" ? pendingOrders : acceptedOrders).length >
            0 ? (
            (activeTab === "pending" ? pendingOrders : acceptedOrders).map(
              renderOrder
            )
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
