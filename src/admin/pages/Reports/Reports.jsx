import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import '../Dashboard/Dashboard.css';

const Reports = () => {
    const reportTypes = [
        {
            title: 'Daily Sales Report',
            description: 'Download today\'s sales transactions',
            icon: FileText,
            color: '#667eea',
            action: 'downloadDailySales',
        },
        {
            title: 'Monthly Sales Report',
            description: 'Complete monthly sales summary',
            icon: FileSpreadsheet,
            color: '#10b981',
            action: 'downloadMonthlySales',
        },
        {
            title: 'Expenses Report',
            description: 'All business expenses breakdown',
            icon: FileText,
            color: '#ef4444',
            action: 'downloadExpenses',
        },
        {
            title: 'Stock Report',
            description: 'Current inventory status',
            icon: FileSpreadsheet,
            color: '#f59e0b',
            action: 'downloadStock',
        },
        {
            title: 'Customer Report',
            description: 'Customer database with purchase history',
            icon: FileText,
            color: '#8b5cf6',
            action: 'downloadCustomers',
        },
    ];

    const downloadExcel = (data, filename) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleDownload = (action) => {
        // Sample data for demonstration
        const sampleData = [
            { Date: '2025-11-30', Order: '#ORD001', Customer: 'John Doe', Amount: 1200, Status: 'Delivered' },
            { Date: '2025-11-30', Order: '#ORD002', Customer: 'Jane Smith', Amount: 1500, Status: 'Pending' },
        ];

        downloadExcel(sampleData, action);
        alert(`Downloading ${action} report...`);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Reports & Analytics</h1>
                <p className="dashboard-subtitle">Download detailed business reports</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {reportTypes.map((report, index) => (
                    <div key={index} className="chart-card" style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                background: `${report.color}20`,
                                color: report.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <report.icon size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', color: '#111827' }}>
                                    {report.title}
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                                    {report.description}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => handleDownload(report.action)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: report.color,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <Download size={16} />
                                Download Excel
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Downloads */}
            <div className="chart-card" style={{ marginTop: '2rem' }}>
                <h3 className="chart-title">Recent Downloads</h3>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    <p>• Daily Sales Report - Downloaded on Nov 29, 2025</p>
                    <p>• Monthly Sales Report - Downloaded on Nov 25, 2025</p>
                    <p>• Stock Report - Downloaded on Nov 20, 2025</p>
                </div>
            </div>
        </div>
    );
};

export default Reports;
