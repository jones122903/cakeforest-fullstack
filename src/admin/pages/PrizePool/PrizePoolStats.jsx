import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Package, Award, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPrizePoolStats } from '../../../services/prizePoolService';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import '../Dashboard/Dashboard.css';

const COLORS = ['#667eea', '#f6ad55', '#48bb78', '#e53e3e'];

const PrizePoolStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchStats();
  }, [id]);

  const fetchStats = async () => {
    try {
      const data = await getPrizePoolStats(id, token);
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard"><div className="text-center p-5">Loading statistics...</div></div>;
  }

  if (!stats) {
    return <div className="dashboard"><div className="text-center p-5">No data available</div></div>;
  }

  // Prepare pie chart data
  const statusData = [
    { name: 'Created', value: stats.statusBreakdown?.CREATED || 0 },
    { name: 'Revealed', value: stats.statusBreakdown?.REVEALED || 0 },
    { name: 'Claimed', value: stats.statusBreakdown?.CLAIMED || 0 },
    { name: 'Expired', value: stats.statusBreakdown?.EXPIRED || 0 },
  ].filter(item => item.value > 0);

  // Prepare timeline data (mock data - replace with actual backend data if available)
  const timelineData = stats.timeline || [];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/admin/prize-pools')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{stats.prizePool?.prizeName || 'Prize Pool Statistics'}</h1>
            <p className="dashboard-subtitle">Detailed analytics and performance metrics</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>Total Quantity</span>
            <Package size={20} color="#667eea" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>{stats.totalQuantity}</div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>Used</span>
            <Award size={20} color="#f6ad55" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#f6ad55' }}>{stats.usedQuantity}</div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>Remaining</span>
            <TrendingUp size={20} color="#48bb78" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#48bb78' }}>{stats.remainingQuantity}</div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>Win Rate</span>
            <Clock size={20} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#8b5cf6' }}>
            {stats.usedQuantity > 0 ? ((stats.usedQuantity / stats.totalQuantity) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Pie Chart */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
              No data available
            </div>
          )}
        </div>

        {/* Line Chart - Timeline */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Cards Generated Over Time</h3>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#667eea" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
              Timeline data not available
            </div>
          )}
        </div>
      </div>

      {/* Scratch Cards Table */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Issued Scratch Cards</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="products-table">
            <thead>
              <tr>
                <th>Card ID</th>
                <th>User</th>
                <th>Status</th>
                <th>Reward</th>
                <th>Generated Date</th>
                <th>Claimed Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.scratchCards && stats.scratchCards.length > 0 ? (
                stats.scratchCards.map((card) => (
                  <tr key={card._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{card._id.slice(-8)}</td>
                    <td>{card.userId?.email || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${card.status === 'CLAIMED' ? 'active' : 'inactive'}`}>
                        {card.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600', color: card.isWinning ? '#48bb78' : '#999' }}>
                      {card.isWinning ? card.rewardText : 'Better luck next time'}
                    </td>
                    <td>{new Date(card.createdAt).toLocaleDateString()}</td>
                    <td>{card.claimedAt ? new Date(card.claimedAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    No scratch cards issued yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrizePoolStats;
