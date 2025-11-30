import React from 'react';
import { Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { darkMode, toggleDarkMode, toggleSidebar } = useApp();
    const { user } = useAuth();

    return (
        <div className="admin-navbar">
            <div className="navbar-left">
                <button className="menu-btn" onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            <div className="navbar-right">
                <button className="icon-btn" onClick={toggleDarkMode}>
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="icon-btn notification-btn">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </button>

                <div className="user-profile">
                    <div className="user-avatar">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="user-info">
                        <p className="user-name">{user?.name || 'Admin'}</p>
                        <span className="user-role">Administrator</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
