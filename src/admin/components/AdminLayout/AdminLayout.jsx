import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import { useApp } from '../../context/AppContext.jsx';
import './AdminLayout.css';

const AdminLayout = () => {
    const { sidebarCollapsed } = useApp();

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar />
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
