import React, { useState, useEffect } from "react";
import axios from "axios";
import { Popconfirm } from "antd";
import "../Dashboard/Dashboard.css";
import styles from "./Orders.module.css"; // Import custom styles
import {
  X,
  MapPin,
  User,
  Trash2,
  Eye,
  CheckCircle,
  Truck,
  Package,
  Calendar,
  Clock,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders`
      );
      if (response.data.success) {
        const mappedOrders = response.data.orders.map((order) => ({
          id: order.orderId,
          mongoId: order._id,
          customer: order.deliveryDetails?.fullName || "Unknown",
          cake: order.cartItems.map((item) => item.cakeName).join(", "),
          amount: order.totalAmount,
          status: order.status,
          date: new Date(order.createdAt).toLocaleDateString(),
          rawDate: new Date(order.createdAt),
          fullDetails: {
            ...order,
            formattedOrderDate: new Date(order.createdAt).toLocaleString(),
            formattedDeliveryDate: new Date(
              order.deliveryDate
            ).toLocaleDateString(),
          },
        }));
        mappedOrders.sort((a, b) => b.rawDate - a.rawDate);
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (mongoId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${mongoId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (mongoId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/orders/${mongoId}`
      );

      if (response.data.success) {
        setOrders(orders.filter((order) => order.mongoId !== mongoId));
        toast.success("Order deleted successfully");
        window.dispatchEvent(new Event("refreshNotifications"));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      ready: "#06b6d4",
      delivered: "#10b981",
    };
    return colors[status?.toLowerCase()] || "#6b7280";
  };

  const getStatusIcon = (status) => {
    if (status === "pending") return <CheckCircle size={18} />;
    if (status === "ready") return <Truck size={18} />;
    if (status === "delivered") return <Package size={18} />;
    return null;
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "pending") return "ready";
    if (currentStatus === "ready") return "delivered";
    return null;
  };

  const getStatusChangeText = (currentStatus) => {
    if (currentStatus === "pending") return "Mark this order as Ready?";
    if (currentStatus === "ready") return "Mark this order as Delivered?";
    return "";
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order.fullDetails);
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    document.body.classList.remove("modal-open");
  };

  const pendingOrders = orders.filter((order) =>
    ["pending", "ready"].includes(order.status.toLowerCase())
  );

  const deliveredOrders = orders.filter(
    (order) => order.status.toLowerCase() === "delivered"
  );

  const renderOrdersTable = (ordersList, isDelivered = false) => (
    <table className="products-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Cake</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {ordersList.length > 0 ? (
          ordersList.map((order) => {
            const currentStatus = order.status.toLowerCase();
            const nextStatus = getNextStatus(currentStatus);
            const isClickable = currentStatus !== "delivered";

            return (
              <tr key={order.id}>
                <td style={{ fontWeight: 600, color: "#667eea" }}>
                  {order.id}
                </td>
                <td>{order.customer}</td>
                <td style={{ maxWidth: "200px" }}>{order.cake}</td>
                <td style={{ fontWeight: 600, color: "#059669" }}>
                  ₹{order.amount}
                </td>
                <td>
                  {isClickable ? (
                    <Popconfirm
                      description={getStatusChangeText(currentStatus)}
                      onConfirm={() =>
                        handleStatusChange(order.mongoId, nextStatus)
                      }
                      okText="Yes"
                      cancelText="No"
                      icon={null}
                      placement="top"
                      okButtonProps={{
                        style: {
                          backgroundColor: getStatusColor(nextStatus),
                          color: "white",
                          borderRadius: "6px",
                          padding: "4px 15px",
                          border: "none",
                        },
                      }}
                      cancelButtonProps={{
                        style: {
                          backgroundColor: "#e0e0e0",
                          color: "#444",
                          borderRadius: "6px",
                          padding: "4px 15px",
                          border: "none",
                        },
                      }}
                    >
                      <span
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          background: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        {order.status}
                        {getStatusIcon(currentStatus)}
                      </span>
                    </Popconfirm>
                  ) : (
                    <span
                      style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        background: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {order.status}
                      {getStatusIcon(currentStatus)}
                    </span>
                  )}
                </td>
                <td>{order.date}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => handleViewDetails(order)}
                      style={{
                        padding: "0.4rem",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {isDelivered && (
                      <Popconfirm
                        description="Are you sure you want to delete this order?"
                        onConfirm={() => handleDelete(order.mongoId)}
                        okText="Yes"
                        cancelText="No"
                        icon={null}
                        placement="top"
                        okButtonProps={{
                          style: {
                            backgroundColor: "#ef4444",
                            color: "white",
                            borderRadius: "6px",
                            padding: "4px 15px",
                            border: "none",
                          },
                        }}
                        cancelButtonProps={{
                          style: {
                            backgroundColor: "#e0e0e0",
                            color: "#444",
                            borderRadius: "6px",
                            padding: "4px 15px",
                            border: "none",
                          },
                        }}
                      >
                        <button
                          style={{
                            padding: "0.4rem",
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </Popconfirm>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
              No {isDelivered ? "delivered" : "pending"} orders found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <>
      <Toaster position="top-right" />

      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Orders Management</h1>
          <p className="dashboard-subtitle">
            Manage all your cake orders (3 Status Flow: Pending → Ready →
            Delivered)
          </p>
        </div>

        {/* Custom Tabs Container - Similar to Notification Drawer */}
        <div className={styles.tabContainer}>
          <button
            onClick={() => setActiveTab("pending")}
            className={`${styles.tab} ${
              activeTab === "pending" ? styles.activeTab : ""
            }`}
          >
            Active Orders ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("delivered")}
            className={`${styles.tab} ${
              activeTab === "delivered" ? styles.activeTab : ""
            }`}
          >
            Delivered Orders ({deliveredOrders.length})
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              Loading...
            </div>
          ) : (
            <>
              {activeTab === "pending" &&
                renderOrdersTable(pendingOrders, false)}
              {activeTab === "delivered" &&
                renderOrdersTable(deliveredOrders, true)}
            </>
          )}
        </div>

        {/* Modal remains the same */}
        {isModalOpen && selectedOrder && (
          <div
            className="modal-overlay"
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10000,
              backdropFilter: "blur(8px)",
              overflow: "hidden",
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "0",
                width: "90%",
                maxWidth: "500px",
                height: "85vh",
                maxHeight: "600px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                animation: "modalSlideIn 0.3s ease-out",
              }}
            >
              <div
                style={{
                  background: "#667eea",
                  padding: "16px 20px",
                  borderRadius: "12px 12px 0 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "white",
                  flexShrink: 0,
                }}
              >
                <div>
                  <h2
                    style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}
                  >
                    Order #{selectedOrder.orderId}
                  </h2>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: "0.75rem",
                      opacity: 0.9,
                    }}
                  >
                    {selectedOrder.formattedOrderDate}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.25)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.15)")
                  }
                >
                  <X size={18} />
                </button>
              </div>

              <div
                style={{
                  padding: "20px",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                    background: `${getStatusColor(selectedOrder.status)}`,
                    color: "white",
                    marginBottom: "16px",
                  }}
                >
                  {getStatusIcon(selectedOrder.status.toLowerCase())}
                  {selectedOrder.status}
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                  <div
                    style={{
                      background: "#fafafa",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "10px",
                      }}
                    >
                      <User size={16} color="#667eea" />
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#1f2937",
                        }}
                      >
                        Customer Details
                      </h3>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gap: "6px",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div style={{ display: "flex", gap: "6px" }}>
                        <strong
                          style={{ color: "#6b7280", minWidth: "45px" }}
                        >
                          Name:
                        </strong>
                        <span style={{ color: "#1f2937" }}>
                          {selectedOrder.deliveryDetails.fullName}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <strong
                          style={{ color: "#6b7280", minWidth: "45px" }}
                        >
                          Phone:
                        </strong>
                        <span style={{ color: "#1f2937" }}>
                          {selectedOrder.deliveryDetails.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#fafafa",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "10px",
                      }}
                    >
                      <MapPin size={16} color="#10b981" />
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#1f2937",
                        }}
                      >
                        Delivery Information
                      </h3>
                    </div>
                    <div>
                      <p
                        style={{
                          margin: "0 0 10px 0",
                          lineHeight: "1.5",
                          color: "#4b5563",
                          fontSize: "0.85rem",
                        }}
                      >
                        {selectedOrder.deliveryDetails.address.flatNo},{" "}
                        {selectedOrder.deliveryDetails.address.street},{" "}
                        {selectedOrder.deliveryDetails.address.city} -{" "}
                        {selectedOrder.deliveryDetails.address.pincode}
                      </p>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Calendar size={14} color="#6b7280" />
                          <span
                            style={{ fontSize: "0.8rem", color: "#4b5563" }}
                          >
                            {selectedOrder.formattedDeliveryDate}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Clock size={14} color="#6b7280" />
                          <span
                            style={{ fontSize: "0.8rem", color: "#4b5563" }}
                          >
                            {selectedOrder.deliveryTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#fafafa",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "10px",
                      }}
                    >
                      <ShoppingBag size={16} color="#f59e0b" />
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#1f2937",
                        }}
                      >
                        Order Items
                      </h3>
                    </div>
                    <div
                      style={{
                        background: "white",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {selectedOrder.cartItems.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            borderBottom:
                              idx < selectedOrder.cartItems.length - 1
                                ? "1px solid #f3f4f6"
                                : "none",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                marginBottom: "2px",
                                color: "#1f2937",
                              }}
                            >
                              {item.cakeName}
                            </div>
                            <div
                              style={{ fontSize: "0.75rem", color: "#6b7280" }}
                            >
                              {item.weight} × {item.quantity}
                            </div>
                          </div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              color: "#059669",
                            }}
                          >
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f9fafb",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "10px",
                      }}
                    >
                      <CreditCard size={16} color="#6b7280" />
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#1f2937",
                        }}
                      >
                        Payment Summary
                      </h3>
                    </div>
                    <div style={{ display: "grid", gap: "8px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.85rem",
                          color: "#4b5563",
                        }}
                      >
                        <span>Subtotal</span>
                        <span>
                          ₹
                          {selectedOrder.totalAmount -
                            (selectedOrder.deliveryCharge || 0)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.85rem",
                          color: "#4b5563",
                        }}
                      >
                        <span>Delivery Charge</span>
                        <span>₹{selectedOrder.deliveryCharge || 0}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingTop: "8px",
                          borderTop: "2px solid #d1d5db",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                        }}
                      >
                        <span style={{ color: "#1f2937" }}>Total</span>
                        <span style={{ color: "#059669" }}>
                          ₹{selectedOrder.totalAmount}
                        </span>
                      </div>
                      <div
                        style={{
                          marginTop: "4px",
                          padding: "6px 10px",
                          background: "white",
                          borderRadius: "6px",
                          textAlign: "center",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#6b7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        {selectedOrder.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        body.modal-open {
          overflow: hidden;
        }

        .modal-content > div:last-child::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content > div:last-child::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .modal-content > div:last-child::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .modal-content > div:last-child::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default Orders;