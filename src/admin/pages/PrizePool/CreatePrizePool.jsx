import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { createPrizePool } from '../../../services/prizePoolService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const CreatePrizePool = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prizeName: '',
    description: '',
    couponId: '',
    totalQuantity: '',
    expiryDate: ''
  });
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const { token} = useSelector((state) => state.auth);

  React.useEffect(() => {
    fetchRewardCoupons();
  }, []);

  const fetchRewardCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/scratchcards/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter only reward-only coupons
      const rewardCoupons = response.data.filter(c => c.isRewardOnly === true);
      setCoupons(rewardCoupons);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoadingCoupons(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        prizeName: formData.prizeName,
        description: formData.description,
        couponId: formData.couponId,
        totalQuantity: parseInt(formData.totalQuantity),
        expiryDate: formData.expiryDate
      };

      const result = await createPrizePool(payload, token);
      
      if (result.success) {
        toast.success('Prize pool created successfully!');
        navigate('/admin/prize-pools');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create prize pool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={() => navigate('/admin/prize-pools')}
          style={{
            background: 'white',
            border: '1px solid #ddd',
            cursor: 'pointer',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#667eea'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#333' }}>
          Create New Prize Pool
        </h1>
      </div>

      {/* Form Container */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '700px',
        margin: '0 auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Prize Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>
              Prize Name <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              type="text"
              name="prizeName"
              value={formData.prizeName}
              onChange={handleChange}
              placeholder="e.g., Grand Opening Rewards"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of this prize pool"
              rows="3"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Coupon Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>
              Reward Coupon <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            {loadingCoupons ? (
              <div style={{ padding: '12px', color: '#666' }}>Loading coupons...</div>
            ) : (
              <select
                name="couponId"
                value={formData.couponId}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select a reward coupon</option>
                {coupons.map(coupon => (
                  <option key={coupon._id} value={coupon._id}>
                    {coupon.code} - {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </option>
                ))}
              </select>
            )}
            <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
              Only reward-only coupons are shown
            </p>
          </div>

          {/* Total Quantity */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>
              Total Quantity <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              type="number"
              name="totalQuantity"
              value={formData.totalQuantity}
              onChange={handleChange}
              placeholder="e.g., 100"
              min="1"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
              Number of scratch cards to generate with this reward
            </p>
          </div>

          {/* Expiry Date */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>
              Expiry Date <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/admin/prize-pools')}
              style={{
                padding: '12px 24px',
                border: '1px solid #ddd',
                background: 'white',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating...' : 'Create Prize Pool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrizePool;
