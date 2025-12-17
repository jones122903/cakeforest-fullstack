import React, { useEffect, useState } from "react";
import { Drawer, Empty, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "./orderDrawer.module.css";

const OrderDrawer = ({ open, setOpen }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const api_url = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    if (!user || !token) return;
    setLoading(true);
    try {
      const userId = user.id || user._id;
      const res = await axios.get(`${api_url}/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchOrders();
  }, [open]);

  const getStatusBadge = (status) => {
    const map = {
      pending: "#f59e0b",
      ready: "#06b6d4",
      delivered: "#10b981",
    };
    const color = map[status?.toLowerCase()] || "#6b7280";

    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          background: `${color}20`,
          color,
          border: `1px solid ${color}40`,
          textTransform: "capitalize",
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <Drawer
      placement="right"
      open={open}
      onClose={() => setOpen(false)}
      width={400}
      height="100vh"
      zIndex={10000}
      closable={false}
      bodyStyle={{
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* ===== FIXED HEADER ===== */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10001,
          background: "#fff",
          padding: "14px 16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* TITLE */}
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: 600,
            color: "#111827",
          }}
        >
          My Orders
        </h3>

        {/* CLOSE ICON (RIGHT SIDE) */}
        <button
          onClick={() => setOpen(false)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          <CloseOutlined />
        </button>
      </div>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div
        className={`${styles.drawerContent} ${
          orders.length === 0 ? styles.noScroll : ""
        }`}
        style={{
          padding: "16px",
          height: "calc(100vh - 56px)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Spin size="large" />
          </div>
        ) : orders.length ? (
          orders.map((order) => (
            <div key={order._id} className={styles.notificationCard}>
              <div className={styles.orderHeader}>
                <span className={styles.orderId}>{order.orderId}</span>
                <span className={styles.orderTime}>
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <div className={styles.orderDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Amount</span>
                  <span className={styles.value}>₹{order.totalAmount}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Status</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {order.cartItems?.map((item, i) => (
                <div key={i} className={styles.cakeItem}>
                  🎂 {item.cakeName} ({item.weight} × {item.quantity})
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className={styles.emptyWrapper}>
            <Empty description="No orders found" />
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default OrderDrawer;
