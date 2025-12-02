import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import '../Dashboard/Dashboard.css';
import '../Products/AddProduct.css';

const Expenses = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    const categories = ['Rent', 'Salary', 'Ingredients', 'Electricity', 'Miscellaneous'];

    const expenses = [
        { id: 1, category: 'Rent', amount: 25000, date: '2025-11-01', description: 'Monthly shop rent' },
        { id: 2, category: 'Salary', amount: 45000, date: '2025-11-05', description: 'Staff salaries' },
        { id: 3, category: 'Ingredients', amount: 15000, date: '2025-11-10', description: 'Baking supplies' },
    ];

    const monthlyExpenses = [
        { month: 'Jan', amount: 85000 },
        { month: 'Feb', amount: 92000 },
        { month: 'Mar', amount: 88000 },
        { month: 'Apr', amount: 95000 },
        { month: 'May', amount: 87000 },
        { month: 'Jun', amount: 90000 },
    ];

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Expense:', formData);
        setShowAddForm(false);
        setFormData({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    };

    return (
        <div className="dashboard">
            <div className="page-header">
                <div>
                    <h1>Expenses Management</h1>
                    <p className="dashboard-subtitle">Track and manage business expenses</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus size={18} />
                    Add Expense
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="chart-card">
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Total Expenses This Month</h4>
                    <h2 style={{ margin: 0, fontSize: '2rem', color: '#111827' }}>{formatCurrency(totalExpenses)}</h2>
                </div>
                <div className="chart-card">
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Number of Expenses</h4>
                    <h2 style={{ margin: 0, fontSize: '2rem', color: '#111827' }}>{expenses.length}</h2>
                </div>
            </div>

            {/* Add Expense Form */}
            {showAddForm && (
                <div className="form-section" style={{ marginBottom: '2rem' }}>
                    <h3 className="section-title">Add New Expense</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Amount *</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="₹"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Date *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description"
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary">Save Expense</button>
                            <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Chart */}
            <div className="chart-card" style={{ marginBottom: '2rem' }}>
                <h3 className="chart-title">Monthly Expenses Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyExpenses}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="amount" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Expenses Table */}
            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>
                                    <span style={{
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        background: '#fee2e2',
                                        color: '#991b1b',
                                    }}>
                                        {expense.category}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 600, color: '#ef4444' }}>₹{expense.amount.toLocaleString()}</td>
                                <td>{expense.date}</td>
                                <td style={{ color: '#6b7280' }}>{expense.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Expenses;
