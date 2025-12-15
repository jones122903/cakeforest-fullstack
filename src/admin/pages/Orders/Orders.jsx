import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Dashboard/Dashboard.css';
import { X, MapPin, Phone, User, Clock, Calendar, Trash2, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
            if (response.data.success) {
                const mappedOrders = response.data.orders.map(order => ({
                    id: order.orderId,
                    mongoId: order._id,
                    customer: order.deliveryDetails?.fullName || 'Unknown',
                    cake: order.cartItems.map(item => item.cakeName).join(', '),
                    amount: order.totalAmount,
                    status: order.status,
                    date: new Date(order.createdAt).toLocaleDateString(),
                    rawDate: new Date(order.createdAt),
                    fullDetails: {
                        ...order,
                        formattedOrderDate: new Date(order.createdAt).toLocaleString(),
                        formattedDeliveryDate: new Date(order.deliveryDate).toLocaleDateString()
                    }
                }));
                // Sort by newest first
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

    const handleDelete = async (mongoId) => {
        if (!mongoId) return;

        Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the order and its notification permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(
                        `${import.meta.env.VITE_API_URL}/orders/${mongoId}`
                    );

                    if (response.data.success) {
                        setOrders(orders.filter(order => order.mongoId !== mongoId));
                        toast.success("Order deleted successfully");

                        // Notify other components like Navbar to refresh badges
                        window.dispatchEvent(new Event('refreshNotifications'));
                    }
                } catch (error) {
                    console.error("Error deleting order:", error);
                    toast.error("Failed to delete order");
                }
            }
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#f59e0b',
            accepted: '#3b82f6',
            preparing: '#8b5cf6',
            'out for delivery': '#06b6d4',
            delivered: '#10b981',
            cancelled: '#ef4444',
            rejected: '#ef4444',
            completed: '#10b981'
        };
        return colors[status?.toLowerCase()] || '#6b7280';
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order.fullDetails);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <>
            <Toaster position="top-right" />

            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Orders Management</h1>
                    <p className="dashboard-subtitle">Manage all your cake orders</p>
                </div>

                <div className="table-container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
                    ) : (
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
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order.id}>
                                            <td style={{ fontWeight: 600, color: '#667eea' }}>{order.id}</td>
                                            <td>{order.customer}</td>
                                            <td style={{ maxWidth: '200px' }}>{order.cake}</td>
                                            <td style={{ fontWeight: 600, color: '#059669' }}>₹{order.amount}</td>
                                            <td>
                                                <span
                                                    style={{
                                                        padding: '0.35rem 0.75rem',
                                                        borderRadius: '6px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 600,
                                                        textTransform: 'capitalize',
                                                        background: `${getStatusColor(order.status)}20`,
                                                        color: getStatusColor(order.status),
                                                    }}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{order.date}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <button
                                                        onClick={() => handleViewDetails(order)}
                                                        style={{
                                                            padding: '0.4rem',
                                                            background: '#667eea',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order.mongoId)}
                                                        style={{
                                                            padding: '0.4rem',
                                                            background: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Order Details Modal */}
                {isModalOpen && selectedOrder && (
                    <div className="modal-overlay"
                        onClick={closeModal}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}>
                        <div className="modal-content"
                            onClick={e => e.stopPropagation()}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '24px',
                                width: '90%',
                                maxWidth: '600px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1a1a1a' }}>Order {selectedOrder.orderId}</h2>
                                <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div style={{ display: 'grid', gap: '20px' }}>
                                {/* Status & Time */}
                                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#64748b' }}>Status</span>
                                        <span style={{
                                            color: getStatusColor(selectedOrder.status),
                                            fontWeight: 'bold',
                                            textTransform: 'capitalize'
                                        }}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 'bold', color: '#64748b' }}>Ordered On</span>
                                        <span>{selectedOrder.formattedOrderDate}</span>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={18} /> Customer Details
                                    </h3>
                                    <div style={{ padding: '0 10px' }}>
                                        <p style={{ margin: '5px 0' }}><strong>Name:</strong> {selectedOrder.deliveryDetails.fullName}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {selectedOrder.deliveryDetails.phone}</p>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MapPin size={18} /> Delivery Address
                                    </h3>
                                    <div style={{ padding: '0 10px', background: '#f1f5f9', borderRadius: '6px', padding: '10px' }}>
                                        <p style={{ margin: 0, lineHeight: '1.5' }}>
                                            {selectedOrder.deliveryDetails.address.flatNo}, {selectedOrder.deliveryDetails.address.street},<br />
                                            {selectedOrder.deliveryDetails.address.city} - {selectedOrder.deliveryDetails.address.pincode}
                                        </p>
                                        <div style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '0.9rem' }}>
                                            <p style={{ margin: '5px 0' }}><strong>Date:</strong> {selectedOrder.formattedDeliveryDate}</p>
                                            <p style={{ margin: '5px 0' }}><strong>Time:</strong> {selectedOrder.deliveryTime}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Items</h3>
                                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                        {selectedOrder.cartItems.map((item, idx) => (
                                            <div key={idx} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '12px',
                                                borderBottom: idx < selectedOrder.cartItems.length - 1 ? '1px solid #e2e8f0' : 'none'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{item.cakeName}</div>
                                                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{item.weight} x {item.quantity}</div>
                                                </div>
                                                <div style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment */}
                                <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span>Subtotal</span>
                                        <span>₹{selectedOrder.totalAmount - (selectedOrder.deliveryCharge || 0)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span>Delivery Charge</span>
                                        <span>₹{selectedOrder.deliveryCharge || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>
                                        <span>Total</span>
                                        <span>₹{selectedOrder.totalAmount}</span>
                                    </div>
                                    <div style={{ marginTop: '5px', textAlign: 'right', fontSize: '0.9rem', color: '#64748b' }}>
                                        {selectedOrder.paymentMethod}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Orders;
