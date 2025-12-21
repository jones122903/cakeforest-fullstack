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
    fetchOrders();
  }, []);

  // 🔄 Listen for order refresh events from notification drawer
  useEffect(() => {
    const handleRefresh = () => {
      fetchOrders();
    };

    window.addEventListener("refreshOrders", handleRefresh);

    return () => {
      window.removeEventListener("refreshOrders", handleRefresh);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders`
      );
      if (response.data.success) {
        const mappedOrders = response.data.orders .filter(order => order.notificationstatus === true).map((order) => {
          // Robust mapping for delivery fields
          let rawDDate = order.deliveryDate || order.deliveryDetails?.deliveryDate || "N/A";
          let formattedDDate = rawDDate;

          if (rawDDate && rawDDate !== "N/A" && rawDDate.includes("-")) {
            const parts = rawDDate.split("-");
            if (parts.length === 3) formattedDDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
          }

          const dTime = order.deliveryTime || order.deliveryDetails?.deliveryTime || "N/A";
          const wishes = order.wishesOnCake || order.deliveryDetails?.cakeWishes || order.deliveryDetails?.wishesOnCake || "";

          return {
            id: order.orderId,
            mongoId: order._id,
            customer: order.deliveryDetails?.fullName || "Unknown",
            cake: order.cartItems.map((item) => item.cakeName).join(", "),
            amount: order.totalAmount,
            status: order.status,
            orderDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
            deliveryDate: formattedDDate,
            deliveryTime: dTime,
            rawDate: new Date(order.createdAt),
            fullDetails: {
              ...order,
              deliveryDate: formattedDDate,
              deliveryTime: dTime,
              wishesOnCake: wishes,
              formattedOrderDate: new Date(order.createdAt).toLocaleString("en-GB"),
              formattedDeliveryDate: formattedDDate,
            },
          };
        });
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
          <th>Order Date</th>
          <th>Delivery Date</th>
          <th>Delivery Time</th>
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
                <td>{order.orderDate}</td>
                <td style={{ fontWeight: 600 }}>{order.deliveryDate}</td>
                <td style={{ color: "#4b5563" }}>{order.deliveryTime}</td>
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
            <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
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
              // background: activeTab === "pending" ? "#667eea" : "transparent",
              color: activeTab === "pending" ? "#667eea" : "",
              backgroundColor: "transparent",
              border: "none",
              borderColor: "transparent",
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
              background: "transparent",
              color: activeTab === "delivered" ? "#667eea" : "",
              border: "none",
              borderBottom:
                activeTab === "delivered"
                  ? "3px solid #667eea"
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
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10000,
              padding: "20px",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
                    Order #{selectedOrder.orderId}
                  </h2>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}>
                    {selectedOrder.formattedOrderDate}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "6px",
                  }}
                >
                  <X size={20} color="#6b7280" />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: "24px" }}>
                {/* Status */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "24px",
                    background: `${getStatusColor(selectedOrder.status)}15`,
                    color: getStatusColor(selectedOrder.status),
                  }}
                >
                  {getStatusIcon(selectedOrder.status.toLowerCase())}
                  {selectedOrder.status}
                </div>

                {/* Customer */}
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                    CUSTOMER
                  </h3>
                  <p style={{ margin: "4px 0", fontSize: "15px", fontWeight: "600", color: "#111827" }}>
                    {selectedOrder.deliveryDetails.fullName}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "14px", color: "#6b7280" }}>
                    {selectedOrder.deliveryDetails.phone}
                  </p>
                </div>

                {/* Delivery */}
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                    DELIVERY
                  </h3>
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#111827", fontWeight: "500" }}>
                    {selectedOrder.deliveryDetails.address.flatNo}, {selectedOrder.deliveryDetails.address.street},<br />
                    {selectedOrder.deliveryDetails.address.city} - {selectedOrder.deliveryDetails.address.pincode}
                  </p>
                  <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#111827", fontWeight: "500" }}>
                    📅 {selectedOrder.deliveryDate} • 🕐 {selectedOrder.deliveryTime}
                  </p>
                  {selectedOrder.wishesOnCake && (
                    <div style={{
                      marginTop: "12px",
                      padding: "10px",
                      background: "#fef3f2",
                      borderRadius: "6px",
                      border: "1px dashed #f87171",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#991b1b", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                        Wishes on Cake:
                      </span>
                      <span style={{ fontSize: "15px", fontWeight: "600", color: "#b91c1c", fontStyle: "italic" }}>
                        "{selectedOrder.wishesOnCake}"
                      </span>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280", marginBottom: "12px" }}>
                    ITEMS
                  </h3>
                  {selectedOrder.cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: idx !== selectedOrder.cartItems.length - 1 ? "1px solid #f3f4f6" : "none",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#111827" }}>
                          {item.cakeName}
                        </p>
                        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
                          {item.weight} × {item.quantity}
                        </p>
                      </div>
                      <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#059669" }}>
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Payment */}
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "14px", color: "#6b7280" }}>Subtotal</span>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      ₹{selectedOrder.totalAmount - (selectedOrder.deliveryCharge || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "14px", color: "#6b7280" }}>Delivery</span>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>₹{selectedOrder.deliveryCharge || 0}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: "2px solid #d1d5db",
                    }}
                  >
                    <span style={{ fontSize: "17px", fontWeight: "700", color: "#111827" }}>Total</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: "#059669" }}>
                      ₹{selectedOrder.totalAmount}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .dashboard {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          padding: 1.5rem;
          overflow-x: hidden;
        }

        .table-container {
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-top: 1rem;
          border: 1px solid #e2e8f0;
          display: block;
          position: relative;
          /* Ensure scrollbar works for non-webkit */
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f3f4f6;
        }

        /* Custom Scrollbar for Table */
        .table-container::-webkit-scrollbar {
          height: 8px;
        }

        .table-container::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }

        .table-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .products-table {
          width: 100%;
          min-width: 1100px;
          border-collapse: collapse;
          text-align: left;
        }

        .products-table thead {
          background: #a6afb8;
        }

        .products-table th {
          padding: 16px;
          font-weight: 600;
          color: #374151;
          font-size: 0.8rem;
          text-transform: uppercase;
          border-bottom: 1px solid #e2e8f0;
          white-space: nowrap;
        }

        .products-table td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.9rem;
          color: #1e293b;
          vertical-align: middle;
        }

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