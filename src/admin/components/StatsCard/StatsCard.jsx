import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = '#667eea' }) => {
    const isPositive = trend === 'up';

    return (
        <div className="stats-card" style={{ borderTopColor: color }}>
            <div className="stats-header">
                <div>
                    <p className="stats-title">{title}</p>
                    <h3 className="stats-value">{value}</h3>
                </div>
                <div className="stats-icon" style={{ backgroundColor: `${color}20`, color }}>
                    <Icon size={24} />
                </div>
            </div>

            {trend && (
                <div className="stats-footer">
                    <div className={`stats-trend ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{trendValue}</span>
                    </div>
                    <span className="stats-period">vs last week</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
