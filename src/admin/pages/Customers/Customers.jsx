import React from 'react';
import '../Dashboard/Dashboard.css';

const Customers = () => {
    const customers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', orders: 12, spent: 15000 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', orders: 8, spent: 12000 },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+91 9876543212', orders: 15, spent: 18500 },
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Customers</h1>
                <p className="dashboard-subtitle">Manage your customer base</p>
            </div>

            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Total Orders</th>
                            <th>Total Spent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td style={{ fontWeight: 600 }}>{customer.name}</td>
                                <td style={{ color: '#6b7280' }}>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td style={{ fontWeight: 600, color: '#667eea' }}>{customer.orders}</td>
                                <td style={{ fontWeight: 600, color: '#059669' }}>₹{customer.spent.toLocaleString()}</td>
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
                                        View Profile
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

export default Customers;
