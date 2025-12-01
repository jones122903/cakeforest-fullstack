import React, { useState,useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import { useApp } from '../../context/AppContext.jsx';
import './AdminLayout.css';

const AdminLayout = () => {
    const { sidebarCollapsed } = useApp();
    const [sideWidth,setSideWidth] = useState(true)
    console.log(sideWidth)

    useEffect(() => {
    const handleResize = () => {
        const width = window.innerWidth;

        if (width <= 768) {
            // Mobile
            setSideWidth(false);
        } 
        else if (width > 768 && width <= 1024) {
            // Tablet — your required behavior
            setSideWidth(true);       // auto shrink sidebar
        } 
        else {
            // Desktop like 1440px
            setSideWidth(true);       // keep normal sidebar open
        }
    };

    handleResize(); // run on first load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
}, []);


    return (
        <div className="admin-layout">
            <Sidebar setSideWidth={setSideWidth} sideWidth={sideWidth} />
            <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sideWidth={sideWidth} />
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
