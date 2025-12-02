import React from 'react';
import {
    ShoppingCart,
    DollarSign,
    Clock,
    Package,
    Receipt,
    TrendingUp
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import StatsCard from '../../components/StatsCard/StatsCard';
import { formatCurrency } from '../../utils/formatCurrency';
import './Dashboard.css';

const Dashboard = () => {
    // Sample data for charts
    const last7DaysData = [
        { day: 'Mon', orders: 45 },
        { day: 'Tue', orders: 52 },
        { day: 'Wed', orders: 61 },
        { day: 'Thu', orders: 48 },
        { day: 'Fri', orders: 70 },
        { day: 'Sat', orders: 85 },
        { day: 'Sun', orders: 68 },
    ];

    const monthlyRevenueData = [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 61000 },
        { month: 'Apr', revenue: 70000 },
        { month: 'May', revenue: 75000 },
        { month: 'Jun', revenue: 82000 },
    ];

    const topSellingCakes = [
        { name: 'Red Velvet', value: 450 },
        { name: 'Chocolate', value: 380 },
        { name: 'Vanilla', value: 320 },
        { name: 'Black Forest', value: 250 },
        { name: 'Butterscotch', value: 180 },
    ];

    const profitExpenseData = [
        { month: 'Jan', profit: 35000, expense: 25000 },
        { month: 'Feb', profit: 42000, expense: 28000 },
        { month: 'Mar', profit: 51000, expense: 30000 },
        { month: 'Apr', profit: 60000, expense: 32000 },
        { month: 'May', profit: 65000, expense: 35000 },
        { month: 'Jun', profit: 72000, expense: 38000 },
    ];

    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

    const lowStockItems = [
        { name: 'Red Velvet Cake (1Kg)', stock: 5 },
        { name: 'Chocolate Cake (2Kg)', stock: 3 },
        { name: 'Black Forest (1.5Kg)', stock: 7 },
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Cards Grid */}
            <div className="stats-grid">
                <StatsCard
                    title="Today's Orders"
                    value="28"
                    icon={ShoppingCart}
                    trend="up"
                    trendValue="+12%"
                    color="#667eea"
                />
                <StatsCard
                    title="Total Orders"
                    value="1,284"
                    icon={Package}
                    trend="up"
                    trendValue="+8%"
                    color="#764ba2"
                />
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(385420)}
                    icon={DollarSign}
                    trend="up"
                    trendValue="+23%"
                    color="#10b981"
                />
                <StatsCard
                    title="Pending Orders"
                    value="12"
                    icon={Clock}
                    trend="down"
                    trendValue="-5%"
                    color="#f59e0b"
                />
                <StatsCard
                    title="Total Expenses"
                    value={formatCurrency(125000)}
                    icon={Receipt}
                    trend="up"
                    trendValue="+15%"
                    color="#ef4444"
                />
                <StatsCard
                    title="Monthly Profit"
                    value={formatCurrency(72000)}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="+18%"
                    color="#8b5cf6"
                />
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* Last 7 Days Orders */}
                <div className="chart-card">
                    <h3 className="chart-title">Last 7 Days Orders</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={last7DaysData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#667eea"
                                strokeWidth={3}
                                dot={{ fill: '#667eea', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Revenue */}
                <div className="chart-card">
                    <h3 className="chart-title">Monthly Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Legend />
                            <Bar dataKey="revenue" fill="#764ba2" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Selling Cakes */}
                <div className="chart-card">
                    <h3 className="chart-title">Top Selling Cakes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={topSellingCakes}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {topSellingCakes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Profit vs Expense */}
                <div className="chart-card">
                    <h3 className="chart-title">Profit vs Expense</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={profitExpenseData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="profit"
                                stackId="1"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.6}
                            />
                            <Area
                                type="monotone"
                                dataKey="expense"
                                stackId="2"
                                stroke="#ef4444"
                                fill="#ef4444"
                                fillOpacity={0.6}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Low Stock Items */}
            <div className="info-section">
                <div className="info-card">
                    <h3 className="info-title">⚠️ Low Stock Items</h3>
                    <div className="low-stock-list">
                        {lowStockItems.map((item, index) => (
                            <div key={index} className="stock-item">
                                <span className="stock-name">{item.name}</span>
                                <span className={`stock-count ${item.stock < 5 ? 'critical' : 'warning'}`}>
                                    {item.stock} units left
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
