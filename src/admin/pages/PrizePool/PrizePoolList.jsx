import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Package, Calendar, Activity } from 'lucide-react';
import { getAllPrizePools } from '../../../services/prizePoolService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../Dashboard/Dashboard.css';

const PrizePoolList = () => {
  const [prizePools, setPrizePools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrizePools();
  }, []);

  const fetchPrizePools = async () => {
    try {
      const data = await getAllPrizePools(token);
      if (data.success) {
        setPrizePools(data.prizePools);
      }
    } catch (error) {
      toast.error('Failed to load prize pools');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (pool) => {
    const now = new Date();
    const expiry = new Date(pool.expiryDate);
    const remaining = pool.totalQuantity - pool.usedQuantity;

    if (!pool.isActive) {
      return <span className="status-badge inactive">Inactive</span>;
    } else if (expiry < now) {
      return <span className="status-badge inactive">Expired</span>;
    } else if (remaining === 0) {
      return <span className="status-badge inactive">Exhausted</span>;
    } else {
      return <span className="status-badge active">Active</span>;
    }
  };

  const getProgressPercentage = (pool) => {
    return ((pool.usedQuantity / pool.totalQuantity) * 100).toFixed(1);
  };

  if (loading) {
    return <div className="dashboard"><div className="text-center p-5">Loading prize pools...</div></div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Prize Pools</h1>
          <p className="dashboard-subtitle">Manage scratch card prize pools and rewards</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/admin/prize-pools/create')}
        >
          <Plus size={18} />
          Create Prize Pool
        </button>
      </div>

      {prizePools.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <Package size={64} color="#ccc" style={{ marginBottom: '20px' }} />
          <h3 style={{ color: '#888', marginBottom: '10px' }}>No Prize Pools Yet</h3>
          <p style={{ color: '#999', marginBottom: '20px' }}>Create your first prize pool to start rewarding customers</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/admin/prize-pools/create')}
          >
            <Plus size={18} />
            Create Prize Pool
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {prizePools.map((pool) => (
            <div 
              key={pool._id} 
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #eee',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/admin/prize-pools/${pool._id}/stats`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#333' }}>
                    {pool.prizeName}
                  </h3>
                  {pool.description && (
                    <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                      {pool.description}
                    </p>
                  )}
                </div>
                {getStatusBadge(pool)}
              </div>

              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ textAlign: 'center', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                    {pool.totalQuantity}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Total</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#f6ad55' }}>
                    {pool.usedQuantity}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Used</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#48bb78' }}>
                    {pool.totalQuantity - pool.usedQuantity}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Remaining</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Usage</span>
                  <span style={{ fontSize: '12px', color: '#667eea', fontWeight: '700' }}>
                    {getProgressPercentage(pool)}%
                  </span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: '#e2e8f0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${getProgressPercentage(pool)}%`,
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    borderRadius: '4px',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>

              {/* Footer Info */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid #eee',
                fontSize: '12px',
                color: '#666'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} />
                  Expires: {new Date(pool.expiryDate).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#667eea', fontWeight: '600' }}>
                  <Activity size={14} />
                  View Details
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrizePoolList;
