import React from 'react';
import '../Dashboard/Dashboard.css';

const Orders = () => {
    const orders = [
        { id: '#ORD001', customer: 'John Doe', cake: 'Red Velvet', amount: 1200, status: 'pending', date: '2025-11-30' },
        { id: '#ORD002', customer: 'Jane Smith', cake: 'Chocolate Truffle', amount: 1500, status: 'preparing', date: '2025-11-29' },
        { id: '#ORD003', customer: 'Mike Johnson', cake: 'Black Forest', amount: 950, status: 'delivered', date: '2025-11-28' },
    ];

    const getStatusColor = (status) => {
        const colors = {
            pending: '#f59e0b',
            accepted: '#3b82f6',
            preparing: '#8b5cf6',
            'out for delivery': '#06b6d4',
            delivered: '#10b981',
            cancelled: '#ef4444',
        };
        return colors[status] || '#6b7280';
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Orders Management</h1>
                <p className="dashboard-subtitle">Manage all your cake orders</p>
            </div>

            <div className="table-container">
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
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td style={{ fontWeight: 600, color: '#667eea' }}>{order.id}</td>
                                <td>{order.customer}</td>
                                <td>{order.cake}</td>
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
                                    <button
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: '#667eea',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
