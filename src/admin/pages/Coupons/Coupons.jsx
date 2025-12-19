import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import '../Dashboard/Dashboard.css';
import '../Products/AddProduct.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Coupons = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expiryDate: '',
        minOrderValue: '',
        status: 'active',
        isRewardOnly: false,
    });

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = `${import.meta.env.VITE_API_URL}`;

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            // Use the dedicated admin endpoint to see ALL coupons (including rewards)
            const response = await axios.get(`${API_URL}/scratchcards/admin/all`);
            setCoupons(response.data);
        } catch (error) {
            console.error("Error fetching coupons", error);
            // toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                discountType: formData.discountType.toUpperCase(),
                discountValue: Number(formData.discountValue),
                minOrderValue: Number(formData.minOrderValue || 0),
                isActive: formData.status === 'active',
                isRewardOnly: formData.isRewardOnly
            };

            const response = await axios.post(`${API_URL}/create`, payload);
            
            toast.success("Coupon Created Successfully!");
            setShowAddForm(false);
            setFormData({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '', minOrderValue: '', status: 'active' });
            fetchCoupons(); // Refresh list
        } catch (error) {
            console.error("Error creating coupon", error);
            toast.error(error.response?.data?.message || "Failed to create coupon");
        }
    };

    return (
        <div className="dashboard">
            
            <div className="page-header">
                <div>
                    <h1>Coupons & Discounts</h1>
                    <p className="dashboard-subtitle">Manage promotional coupons</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus size={18} />
                    Add Coupon
                </button>
            </div>

            {/* Add Coupon Form */}
            {showAddForm && (
                <div className="form-section" style={{ marginBottom: '2rem' }}>
                    <div className="section-header">
                        <h3 className="section-title">Create New Coupon</h3>
                        <button className="btn-secondary" onClick={() => setShowAddForm(false)}>
                            <X size={18} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Coupon Code *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g., SAVE20"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Discount Type *</label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    required
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="flat">Flat Amount</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Discount Value *</label>
                                <input
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                    placeholder={formData.discountType === 'percentage' ? '50' : '100'}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Min Order Value</label>
                                <input
                                    type="number"
                                    value={formData.minOrderValue}
                                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                                    placeholder="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Expiry Date *</label>
                                <input
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="isRewardOnly"
                                    checked={formData.isRewardOnly}
                                    onChange={(e) => setFormData({ ...formData, isRewardOnly: e.target.checked })}
                                    style={{ width: 'auto', cursor: 'pointer' }}
                                />
                                <label htmlFor="isRewardOnly" style={{ margin: 0, fontWeight: '600', color: '#0e4d65', cursor: 'pointer' }}>
                                    Exclusive for Scratch Cards? (Reward Only)
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="active"
                                        checked={formData.status === 'active'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    />
                                    <span className="status-badge active">Active</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="inactive"
                                        checked={formData.status === 'inactive'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    />
                                    <span className="status-badge inactive">Inactive</span>
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary">Create Coupon</button>
                    </form>
                </div>
            )}

            {/* Coupons Table */}
            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Coupon Code</th>
                            <th>Discount</th>
                            <th>Min Order</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Target</th>
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#667eea', fontSize: '1rem' }}>
                                    {coupon.code}
                                </td>
                                <td style={{ fontWeight: 600 }}>
                                    {coupon.discountType === 'PERCENTAGE'
                                        ? `${coupon.discountValue}%`
                                        : `₹${coupon.discountValue}`}
                                </td>
                                <td>₹{coupon.minOrderValue || 0}</td>
                                <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                <td>
                                    <span className={`status-badge ${coupon.isActive ? 'active' : 'inactive'}`}>
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '6px', 
                                        fontSize: '11px', 
                                        fontWeight: '700',
                                        background: coupon.isRewardOnly ? '#ebf8ff' : '#fef3c7',
                                        color: coupon.isRewardOnly ? '#3182ce' : '#d97706'
                                    }}>
                                        {coupon.isRewardOnly ? '🏆 REWARD' : '🌐 PUBLIC'}
                                    </span>
                                </td>
                                {/* <td>
                                    <button style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No active coupons found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Coupons;
