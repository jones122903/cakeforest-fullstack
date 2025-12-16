import React, { useEffect, useState } from "react";
import { Drawer, Tabs, Badge, Empty, Spin } from "antd";
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
            // Fallback for user id property
            const userId = user.id || user._id;

            const response = await axios.get(`${api_url}/orders/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchOrders();
        }
    }, [open, user, token]);

    const renderOrder = (order) => (
        <div key={order._id} className={styles.notificationCard}>
            <div className={styles.orderHeader}>
                <span className={styles.orderId}>{order.orderId}</span>
                <span className={styles.orderTime}>{new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <div className={styles.orderDetails}>
                <div className={styles.detailRow}>
                    <span className={styles.label}>Amount</span>
                    <span className={styles.value}>₹{order.totalAmount}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>Status</span>
                    <Badge
                        status={order.status === 'accepted' ? 'success' : order.status === 'rejected' ? 'error' : 'processing'}
                        text={order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Unknown'}
                    />
                </div>
            </div>

            {order.cartItems && order.cartItems.map((item, i) => (
                <div key={i} className={styles.cakeItem}>
                    <div className={styles.cakeName}>🎂 {item.cakeName || item.name}</div>
                    <div className={styles.cakeDetails}>
                        {item.weight} × {item.quantity}
                    </div>
                </div>
            ))}
        </div>
    );

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const acceptedOrders = orders.filter(o => o.status === 'accepted');
    const rejectedOrders = orders.filter(o => o.status === 'rejected');

    const items = [
        {
            key: 'all',
            label: `All (${orders.length})`,
            children: orders.length ? orders.map(renderOrder) : <Empty description="No orders found" />
        },
        {
            key: 'pending',
            label: `Pending (${pendingOrders.length})`,
            children: pendingOrders.length ? pendingOrders.map(renderOrder) : <Empty description="No pending orders" />
        },
        {
            key: 'accepted',
            label: `Accepted (${acceptedOrders.length})`,
            children: acceptedOrders.length ? acceptedOrders.map(renderOrder) : <Empty description="No accepted orders" />
        }
    ];

    return (
        <Drawer
            title="My Orders"
            placement="right"
            onClose={() => setOpen(false)}
            open={open}
            width={400}
            closeIcon={<CloseOutlined />}
        >
            {loading ? <div style={{ textAlign: 'center', marginTop: '20px' }}><Spin size="large" /></div> :
                <Tabs defaultActiveKey="all" items={items} />
            }
        </Drawer>
    );
};

export default OrderDrawer;
