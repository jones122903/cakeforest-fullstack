import React, { useState, useEffect } from "react";
import axios from "axios";
import { Popconfirm } from "antd";
import "../Dashboard/Dashboard.css";
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
  fetchOrders(); // first load

  const handleRefreshOrders = () => {
    fetchOrders();
  };

  // 👂 listen for notification accept
  window.addEventListener("refreshOrders", handleRefreshOrders);

  return () => {
    window.removeEventListener("refreshOrders", handleRefreshOrders);
  };
}, []);

  const fetchOrders = async () => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/orders`
    );

    if (response.data.success) {
      const mappedOrders = response.data.orders
        // ✅ ONLY accepted notifications
        .filter(order => order.notificationstatus === true)
        .map((order) => ({
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
    if (status === "pending")
      return <CheckCircle size={18} />;
    if (status === "ready") 
      return <Truck size={18} />;
    if (status === "delivered")
      return <Package size={18} />;
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
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
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

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            borderBottom: "2px solid #e5e7eb",
          }}
        >
          <button
            onClick={() => setActiveTab("pending")}
            style={{
              padding: "12px 24px",
              background: activeTab === "pending" ? "#667eea" : "transparent",
              color: activeTab === "pending" ? "white" : "#64748b",
              border: "none",
              borderBottom:
                activeTab === "pending"
                  ? "3px solid #667eea"
                  : "3px solid transparent",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1rem",
              transition: "all 0.3s",
              borderRadius: "8px 8px 0 0",
            }}
          >
            Active Orders ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("delivered")}
            style={{
              padding: "12px 24px",
              background: activeTab === "delivered" ? "#10b981" : "transparent",
              color: activeTab === "delivered" ? "white" : "#64748b",
              border: "none",
              borderBottom:
                activeTab === "delivered"
                  ? "3px solid #10b981"
                  : "3px solid transparent",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1rem",
              transition: "all 0.3s",
              borderRadius: "8px 8px 0 0",
            }}
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

        {/* Enhanced Order Details Modal */}
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
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10000,
              padding: "20px",
              backdropFilter: "blur(4px)",
              overflowY: "auto", // ✅ PAGE SCROLL
              
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "0",
                width: "95%",
                maxWidth: "700px",
                maxHeight: "92vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                animation: "modalSlideIn 0.3s ease-out",
              }}
            >
              {/* Modal Header with gradient */}
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "24px 28px",
                  borderRadius: "20px 20px 0 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
                    Order #{selectedOrder.orderId}
                  </h2>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", opacity: 0.9 }}>
                    Placed on {selectedOrder.formattedOrderDate}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: "28px" }}>
                {/* Status Badge - Large and prominent */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    textTransform: "capitalize",
                    background: `${getStatusColor(selectedOrder.status)}15`,
                    color: getStatusColor(selectedOrder.status),
                    border: `2px solid ${getStatusColor(selectedOrder.status)}30`,
                    marginBottom: "24px",
                  }}
                >
                  {getStatusIcon(selectedOrder.status.toLowerCase())}
                  {selectedOrder.status}
                </div>

                <div style={{ display: "grid", gap: "20px" }}>
                  {/* Customer Info Card */}
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "20px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ background: "#667eea", padding: "8px", borderRadius: "8px" }}>
                        <User size={20} color="white" />
                      </div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                        Customer Details
                      </h3>
                    </div>
                    <div style={{ display: "grid", gap: "10px", paddingLeft: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <strong style={{ minWidth: "60px" }}>Name:</strong>
                        <span>{selectedOrder.deliveryDetails.fullName}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <strong style={{ minWidth: "60px" }}>Phone:</strong>
                        <span>{selectedOrder.deliveryDetails.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info Card */}
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "20px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ background: "#10b981", padding: "8px", borderRadius: "8px" }}>
                        <MapPin size={20} color="white" />
                      </div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                        Delivery Information
                      </h3>
                    </div>
                    <div style={{ paddingLeft: "12px" }}>
                      <p style={{ margin: "0 0 16px 0", lineHeight: "1.6", color: "#475569" }}>
                        {selectedOrder.deliveryDetails.address.flatNo}, {selectedOrder.deliveryDetails.address.street},
                        <br />
                        {selectedOrder.deliveryDetails.address.city} - {selectedOrder.deliveryDetails.address.pincode}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Calendar size={16} color="#64748b" />
                          <span style={{ fontSize: "0.9rem" }}>{selectedOrder.formattedDeliveryDate}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Clock size={16} color="#64748b" />
                          <span style={{ fontSize: "0.9rem" }}>{selectedOrder.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Card */}
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "20px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ background: "#f59e0b", padding: "8px", borderRadius: "8px" }}>
                        <ShoppingBag size={20} color="white" />
                      </div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                        Order Items
                      </h3>
                    </div>
                    <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                      {selectedOrder.cartItems.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px",
                            borderBottom: idx < selectedOrder.cartItems.length - 1 ? "1px solid #e2e8f0" : "none",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "4px" }}>
                              {item.cakeName}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                              {item.weight} × {item.quantity}
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#059669" }}>
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Summary Card */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      padding: "24px",
                      borderRadius: "12px",
                      border: "2px solid #cbd5e1",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <CreditCard size={20} color="#475569" />
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                        Payment Summary
                      </h3>
                    </div>
                    <div style={{ display: "grid", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.totalAmount - (selectedOrder.deliveryCharge || 0)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                        <span>Delivery Charge</span>
                        <span>₹{selectedOrder.deliveryCharge || 0}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingTop: "12px",
                          borderTop: "2px solid #94a3b8",
                          fontSize: "1.4rem",
                          fontWeight: 700,
                        }}
                      >
                        <span>Total</span>
                        <span style={{ color: "#059669" }}>₹{selectedOrder.totalAmount}</span>
                      </div>
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "8px 12px",
                          background: "white",
                          borderRadius: "6px",
                          textAlign: "center",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
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

        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default Orders;