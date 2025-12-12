import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import '../Dashboard/Dashboard.css';
import '../Products/AddProduct.css';

const Coupons = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expiryDate: '',
        status: 'active',
    });

    const coupons = [
        { id: 1, code: 'CAKE50', type: 'percentage', value: 50, expiry: '2025-12-31', status: 'active', uses: 45 },
        { id: 2, code: 'BIRTHDAY100', type: 'fixed', value: 100, expiry: '2025-12-25', status: 'active', uses: 23 },
        { id: 3, code: 'FESTIVAL20', type: 'percentage', value: 20, expiry: '2025-11-30', status: 'expired', uses: 78 },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Coupon:', formData);
        setShowAddForm(false);
        setFormData({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '', status: 'active' });
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
  
  <div style={{ position: "relative", width: "100%" }}>
    {/* Coupon Icon */}
    <svg
      style={{
        position: "absolute",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "20px",
        height: "20px",
        pointerEvents: "none",
      }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#031008ff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7v2a3 3 0 1 1 0 6v2c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path>
      <path d="M13 5v2"></path>
      <path d="M13 17v2"></path>
      <path d="M13 11v2"></path>
    </svg>
    
    <input
      type="text"
      value={formData.code}
      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
      placeholder="e.g., SAVE20"
      required
      style={{
        width: "100%",
        paddingLeft: "40px",
      }}
      onFocus={(e) => {
        e.target.style.boxShadow = "0 0 8px rgba(105, 108, 136, 0.6)";
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = "none";
      }}
    />
  </div>
</div>

<div className="form-group">
  <label>Discount Type *</label>
  
  <div style={{ position: "relative", width: "100%" }}>
    {/* Discount Icon */}
    <svg
      style={{
        position: "absolute",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "20px",
        height: "20px",
        pointerEvents: "none",
        zIndex: 1
      }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#3b82f6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="5" x2="5" y2="19"></line>
      <circle cx="6.5" cy="6.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
    
    <select
      value={formData.discountType}
      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
      required
      style={{
        width: "100%",
        paddingLeft: "40px",
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: "40px"
      }}
      onFocus={(e) => {
        e.target.style.boxShadow = "0 0 8px rgba(59,130,246,0.6)";
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = "none";
      }}
    >
      <option value="percentage">Percentage</option>
      <option value="fixed"></option>
    </select>
  </div>
</div>
                            <div className="form-group" style={{ position: 'relative' }}>
    <label>Discount Value *</label>
    <div style={{ position: 'relative' }}>
        <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            opacity: 0.7,
            pointerEvents: 'none'
        }}>
            🔖
        </span>
        <input
            type="number"
            value={formData.discountValue}
            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
            placeholder={formData.discountType === 'percentage' ? '50' : '100'}
            style={{ paddingLeft: '38px' }}
            required
        />
    </div>
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
                            <th>Expiry Date</th>
                            <th>Uses</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon.id}>
                                <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#667eea', fontSize: '1rem' }}>
                                    {coupon.code}
                                </td>
                                <td style={{ fontWeight: 600 }}>
                                    {coupon.type === 'percentage'
                                        ? `${coupon.value}%`
                                        : `₹${coupon.value}`}
                                </td>
                                <td>{coupon.expiry}</td>
                                <td style={{ fontWeight: 600, color: '#667eea' }}>{coupon.uses} times</td>
                                <td>
                                    <span className={`status-badge ${coupon.status}`}>
                                        {coupon.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#fef3c7',
                                                color: '#92400e',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#fee2e2',
                                                color: '#991b1b',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Coupons;
