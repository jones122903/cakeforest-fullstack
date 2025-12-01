import React, { useState } from 'react';
import { Save } from 'lucide-react';
import '../Dashboard/Dashboard.css';
import '../Products/AddProduct.css';

const Settings = () => {
    const [shopInfo, setShopInfo] = useState({
        name: 'Cake Forest',
        mobile: '+91 9876543210',
        address: '123 Bakery Street, Chennai, Tamil Nadu 600001',
        email: 'info@cakeforest.com',
    });

    const [deliverySettings, setDeliverySettings] = useState({
        standardTime: '2-3 hours',
        expressTime: '1 hour',
        minOrder: '500',
    });

    const [taxSettings, setTaxSettings] = useState({
        cgst: '9',
        sgst: '9',
    });

    const [adminProfile, setAdminProfile] = useState({
        name: 'Admin User',
        email: 'admin@cakeforest.com',
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleShopInfoSave = (e) => {
        e.preventDefault();
        alert('Shop information updated successfully!');
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        alert('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Settings</h1>
                <p className="dashboard-subtitle">Manage your shop and account settings</p>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Shop Information */}
                <div className="form-section">
                    <h3 className="section-title">Shop Information</h3>
                    <form onSubmit={handleShopInfoSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Shop Name *</label>
                                <input
                                    type="text"
                                    value={shopInfo.name}
                                    onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number *</label>
                                <input
                                    type="tel"
                                    value={shopInfo.mobile}
                                    onChange={(e) => setShopInfo({ ...shopInfo, mobile: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={shopInfo.email}
                                    onChange={(e) => setShopInfo({ ...shopInfo, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Address *</label>
                                <textarea
                                    value={shopInfo.address}
                                    onChange={(e) => setShopInfo({ ...shopInfo, address: e.target.value })}
                                    rows="3"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary">
                            <Save size={18} />
                            Save Shop Info
                        </button>
                    </form>
                </div>

                {/* Delivery Settings */}
                <div className="form-section">
                    <h3 className="section-title">Delivery Time Settings</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Standard Delivery</label>
                            <input
                                type="text"
                                value={deliverySettings.standardTime}
                                onChange={(e) => setDeliverySettings({ ...deliverySettings, standardTime: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Express Delivery</label>
                            <input
                                type="text"
                                value={deliverySettings.expressTime}
                                onChange={(e) => setDeliverySettings({ ...deliverySettings, expressTime: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Minimum Order (₹)</label>
                            <input
                                type="number"
                                value={deliverySettings.minOrder}
                                onChange={(e) => setDeliverySettings({ ...deliverySettings, minOrder: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="button" className="btn-primary">
                        <Save size={18} />
                        Save Delivery Settings
                    </button>
                </div>

                {/* Tax Settings */}
                <div className="form-section">
                    <h3 className="section-title">Tax Settings</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div className="form-group">
                            <label>CGST (%)</label>
                            <input
                                type="number"
                                value={taxSettings.cgst}
                                onChange={(e) => setTaxSettings({ ...taxSettings, cgst: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>SGST (%)</label>
                            <input
                                type="number"
                                value={taxSettings.sgst}
                                onChange={(e) => setTaxSettings({ ...taxSettings, sgst: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="button" className="btn-primary">
                        <Save size={18} />
                        Save Tax Settings
                    </button>
                </div>

                {/* Admin Profile */}
                <div className="form-section">
                    <h3 className="section-title">Admin Profile</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={adminProfile.name}
                                onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={adminProfile.email}
                                onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="button" className="btn-primary">
                        <Save size={18} />
                        Update Profile
                    </button>
                </div>

                {/* Change Password */}
                <div className="form-section">
                    <h3 className="section-title">Change Password</h3>
                    <form onSubmit={handlePasswordChange}>
                        <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary">
                            <Save size={18} />
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
