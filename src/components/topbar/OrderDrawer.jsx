import React, { useEffect, useState } from "react";
import { Drawer, Empty, Spin } from "antd";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "./orderDrawer.module.css";

const OrderDrawer = ({ open, setOpen }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
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

  const handleDeleteOrder = (orderId) => {
    toast(
      (t) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <strong>Delete Order</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#666" }}>
              Are you sure you want to delete this order?
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: "6px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                background: "white",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete(orderId);
              }}
              style={{
                padding: "6px 16px",
                border: "none",
                borderRadius: "6px",
                background: "#ef4444",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        position: "top-center",
      }
    );
  };

  const confirmDelete = async (orderId) => {
    setDeleting(orderId);
    try {
      const res = await axios.delete(`${api_url}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setOrders(orders.filter((order) => order._id !== orderId));
        toast.success("Order deleted successfully", {
          duration: 3000,
          position: "top-center",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setDeleting(null);
    }
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
        className={`${styles.drawerContent} ${orders.length === 0 ? styles.noScroll : ""
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
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className={styles.orderTime}>
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
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
                <div key={i} className={styles.cakeItem} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>🎂 {item.cakeName} ({item.weight} × {item.quantity})</span>

                  {/* Show delete icon only on the first item of a delivered order to represent deleting the whole order */}
                  {i === 0 && order.status?.toLowerCase() === "delivered" && (
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      disabled={deleting === order._id}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: deleting === order._id ? "not-allowed" : "pointer",
                        color: deleting === order._id ? "#9ca3af" : "#ef4444",
                        fontSize: "16px",
                        padding: "0 4px",
                        opacity: deleting === order._id ? 0.5 : 1,
                        marginLeft: "8px"
                      }}
                    >
                      <DeleteOutlined />
                    </button>
                  )}
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