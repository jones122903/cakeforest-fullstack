import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// import  showToast  from "../../utils/"
const CouponSection = ({ subtotal, onCouponApplied }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [discountDetails, setDiscountDetails] = useState(null);
  const [userCoupons, setUserCoupons] = useState([]);
  
  useEffect(() => {
    if (user && token) {
      fetchUserCoupons();
    }
  }, [user, token]);

  const fetchUserCoupons = async () => {
    try {
      const userId = user?._id || user?.id;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/scratchcards/user-coupons/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUserCoupons(response.data.userCoupons);
      }
    } catch (error) {
      console.error("Error fetching user coupons:", error);
    }
  };

  const applyClaimedCoupon = (userCoupon) => {
    const coupon = userCoupon.couponId;
    setCouponCode(coupon.code);
    // Directly apply if possible or just set the code
    handleApplyCoupon(coupon.code);
  };

  const handleApplyCoupon = async (manualCode) => {
    const codeToApply = typeof manualCode === 'string' ? manualCode : couponCode;

    
    if (!codeToApply) {
      toast.error("Please enter a coupon code");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/apply`, {
        code: codeToApply,
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
        <>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: userCoupons.length > 0 ? '15px' : '0' }}>
            <input
              type="text"
              value={couponCode}
              className='w-100'
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter Coupon Code"
              style={{ padding: '8px', textTransform: 'uppercase' }}
            />
            <button 
              onClick={() => handleApplyCoupon()} 
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

          {userCoupons.length > 0 && (
            <div className="claimed-coupons-list">
              <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: '600', color: '#666' }}>Your Claimed Rewards:</p>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                {userCoupons.map((uc) => (
                  <div 
                    key={uc._id}
                    onClick={() => applyClaimedCoupon(uc)}
                    style={{
                      background: '#fff8f0',
                      border: '1px dashed #f6ad55',
                      width:"100%",
                      padding: '5px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontWeight: 'bold', color: '#dd6b20' }}>{uc.couponId.code}</span>
                    <span style={{ fontSize: '10px', color: '#718096' }}>
                      {uc.couponId.discountType === 'PERCENTAGE' ? `${uc.couponId.discountValue}% OFF` : `₹${uc.couponId.discountValue} OFF`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
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