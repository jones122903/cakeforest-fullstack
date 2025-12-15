import React, { useState } from "react";
import { Bell, Search, Moon, Sun, Menu } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
// import NotificationDrawer from "../../pages/notification/NotificationDrawer.jsx";
import NotificationDrawer from "../../pages/notification/notificationDrawer.jsx";   

const Navbar = ({ sideWidth }) => {
  const { darkMode, toggleDarkMode, toggleSidebar } = useApp();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className={sideWidth ? "admin-navbar-1" : "admin-navbar"}>
      <div className="navbar-left">
        <button className="navbar-menu-btn ms-3" onClick={toggleSidebar}>
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

        {/* 🔔 Bell Button */}
        <button
          className="icon-btn notification-btn"
          onClick={() => setOpen(true)}
        >
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        {/* ✅ Drawer OUTSIDE button */}
        <NotificationDrawer
          open={open}
          setOpen={setOpen}
          loading={loading}
          setLoading={setLoading}
        />

        <div className="user-profile">
          <div className="user-avatar">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.name || "Admin"}</p>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
