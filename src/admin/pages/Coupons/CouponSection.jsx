import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// import  showToast  from "../../utils/"
const CouponSection = ({ subtotal, onCouponApplied }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [discountDetails, setDiscountDetails] = useState(null);
  // Replace with your actual backend URL
//   const API_URL = 'http://localhost:5000/api/coupons'; 
  const handleApplyCoupon = async () => {

    
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/apply`, {
        code: couponCode,
        orderAmount: subtotal
      });
      if (response.data.success) {
        setDiscountDetails(response.data);
        onCouponApplied(response.data); // Callback to parent component
        toast.success(response.data.message);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to apply coupon";
      toast.error(msg);
      setDiscountDetails(null);
      onCouponApplied(null); // Reset in parent
    } finally {
      setLoading(false);
    }
  };
  const handleRemove = () => {
    setCouponCode('');
    setDiscountDetails(null);
    onCouponApplied(null);
    toast("Coupon removed");
  };
  return (
    
    
    <div className="coupon-section" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}
    >
      <h3>Have a Coupon?</h3>
      
      {!discountDetails ? (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter Coupon Code"
            style={{ padding: '8px', textTransform: 'uppercase' }}
          />
          <button 
            onClick={handleApplyCoupon} 
            disabled={loading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#0b4b62', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer' 
            }}
          >
            {loading ? 'Checking' : 'Apply'}
          </button>
        </div>
      ) : (
        <div className="applied-coupon-info" style={{ backgroundColor: '#f0fff4', padding: '10px', borderRadius: '4px', border: '1px solid #48bb78' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#2f855a', fontWeight: 'bold' }}>
              ✓ {discountDetails.code} Applied
            </span>
            <button 
              onClick={handleRemove}
              style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Remove
            </button>
          </div>
          <p style={{ margin: '5px 0 0', color: '#276749' }}>
            You saved ₹{discountDetails.discountAmount}!
          </p>
        </div>
      )}
    </div>
  );
};
export default CouponSection;