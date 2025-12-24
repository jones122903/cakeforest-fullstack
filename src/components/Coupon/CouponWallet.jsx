import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Clock, CheckCircle, Tag } from 'lucide-react';
import { getUserCoupons } from '../../services/scratchCardService';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const CouponWallet = () => {
  const [coupons, setCoupons] = useState([]);
  const [filter, setFilter] = useState('active'); // 'active', 'expired'
  const [loading, setLoading] = useState(true);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      fetchCoupons();
    }
  }, [user]);

  const fetchCoupons = async () => {
    try {
      const userId = user?._id || user?.id;
      const data = await getUserCoupons(userId, token);
      if (data.success) {
        setCoupons(data.userCoupons);
      }
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon ${code} copied!`);
  };

  const getDaysLeft = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const filteredCoupons = coupons.filter(coupon => {
    if (filter === 'active') {
      return !isExpired(coupon.couponId.expiryDate);
    } else {
      return isExpired(coupon.couponId.expiryDate);
    }
  });

  if (!user) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Please login to view your coupons</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0e4d65', margin: '0 0 10px 0' }}>
          My Coupon Wallet
        </h1>
        <p style={{ color: '#666' }}>Your claimed coupons and rewards</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
        <button
          onClick={() => setFilter('active')}
          style={{
            padding: '12px 24px',
            border: filter === 'active' ? '2px solid #48bb78' : '2px solid #ddd',
            background: filter === 'active' ? '#48bb78' : 'white',
            color: filter === 'active' ? 'white' : '#666',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Active ({coupons.filter(c => !isExpired(c.couponId.expiryDate)).length})
        </button>
        <button
          onClick={() => setFilter('expired')}
          style={{
            padding: '12px 24px',
            border: filter === 'expired' ? '2px solid #e53e3e' : '2px solid #ddd',
            background: filter === 'expired' ? '#e53e3e' : 'white',
            color: filter === 'expired' ? 'white' : '#666',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Expired
        </button>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading coupons...</div>
      ) : filteredCoupons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <p style={{ color: '#999', fontSize: '18px' }}>
            {filter === 'active' ? 'No active coupons yet' : 'No expired coupons'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredCoupons.map((coupon, index) => (
            <CouponCard 
              key={coupon._id} 
              coupon={coupon} 
              index={index}
              onCopy={copyToClipboard}
              getDaysLeft={getDaysLeft}
              isExpired={isExpired}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CouponCard = ({ coupon, index, onCopy, getDaysLeft, isExpired }) => {
  const [copied, setCopied] = useState(false);
  const daysLeft = getDaysLeft(coupon.couponId.expiryDate);
  const expired = isExpired(coupon.couponId.expiryDate);
  const expiringSoon = daysLeft <= 3 && daysLeft > 0;
  
  const isPercentage = coupon.couponId.discountType === 'PERCENTAGE';

  const handleCopy = () => {
    onCopy(coupon.couponId.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        position: 'relative',
        background: expired ? '#f5f5f5' : isPercentage ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        opacity: expired ? 0.7 : 1
      }}
    >
      {/* Perforated Edge Effect */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '20px',
        background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 8px, white 8px, white 16px)',
        zIndex: 1
      }} />
      
      {/* Expiring Soon Badge */}
      {expiringSoon && !expired && (
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: '#ff6b6b',
          color: 'white',
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '700',
          zIndex: 2
        }}>
          Expiring Soon!
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '24px', paddingLeft: '35px', position: 'relative' }}>
        {/* Discount Badge */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Tag size={16} color="white" />
            <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>
              {isPercentage ? `${coupon.couponId.discountValue}% OFF` : `₹${coupon.couponId.discountValue} OFF`}
            </span>
          </div>
        </div>

        {/* Coupon Code */}
        <div style={{
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '15px',
          border: '2px dashed rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px', fontWeight: '600' }}>
                COUPON CODE
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#333', fontFamily: 'monospace', letterSpacing: '2px' }}>
                {coupon.couponId.code}
              </div>
            </div>
            <button
              onClick={handleCopy}
              style={{
                background: copied ? '#48bb78' : '#f5f5f5',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {copied ? <CheckCircle size={20} color="white" /> : <Copy size={20} color="#666" />}
            </button>
          </div>
        </div>

        {/* Details */}
        <div style={{ color: 'white', fontSize: '13px' }}>
          {coupon.couponId.minOrderValue > 0 && (
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ opacity: 0.8 }}>Min Order:</span>
              <span style={{ fontWeight: '700' }}>₹{coupon.couponId.minOrderValue}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} />
            <span style={{ opacity: 0.8 }}>
              {expired ? 'Expired' : `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      </div>

      {/* Countdown Bar for Expiring Soon */}
      {expiringSoon && !expired && (
        <div style={{
          height: '4px',
          background: 'rgba(255,255,255,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${(daysLeft / 3) * 100}%`,
            background: '#ff6b6b',
            transition: 'width 0.3s'
          }} />
        </div>
      )}
    </motion.div>
  );
};

export default CouponWallet;
