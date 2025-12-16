import React, { useState, useEffect, useCallback,useRef } from "react";
import { Bell, Search, Moon, Sun, Menu } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
// import NotificationDrawer from "../../pages/notification/NotificationDrawer.jsx";
import NotificationDrawer from "../../pages/notification/notificationDrawer.jsx";
import axios from "axios";

const Navbar = ({ sideWidth }) => {
  const { darkMode, toggleDarkMode, toggleSidebar } = useApp();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

   const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.loop = true;
  }, []);

const handleBellClick = () => {
  audioRef.current
    .play()
    .then(() => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      console.log("🔓 Sound unlocked");
    })
    .catch((err) => {
      console.log("❌ Unlock error", err);
    });

  setOpen(true);
};




  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications/unread-count`
      );
      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);

    const handleRefresh = () => fetchUnreadCount();
    window.addEventListener('refreshNotifications', handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshNotifications', handleRefresh);
    };
  }, [fetchUnreadCount]);

  const handleNotificationClick = async () => {
    setOpen(true);

    // Mark all notifications as read when drawer opens
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/mark-read`
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

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
          onClick={()=>{handleNotificationClick();handleBellClick()}}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
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
