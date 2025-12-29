import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  Receipt,
  Tag,
  Gift,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
   Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import "./Sidebar.css";

const Sidebar = ({ setSideWidth, sideWidth }) => {
  const { logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useApp();
  const navigate = useNavigate();

  const menuItems = [
    // { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/products", icon: ShoppingBag, label: "Products" },
    { path: "/admin/banners", icon: Sparkles, label: "Banners" },
    { path: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { path: "/admin/customers", icon: Users, label: "Customers" },
    { path: "/admin/coupons", icon: Tag, label: "Coupons" },
    { path: "/admin/prize-pools", icon: Gift, label: "Prize Pools" },
    // { path: "/admin/reports", icon: BarChart3, label: "Reports" },
    // { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Overlay for mobile/tablet */}
      {!sidebarCollapsed && window.innerWidth < 1024 && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarCollapsed(true)}
        ></div>
      )}

      <div className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && <h2 className="sidebar-title">Cake Forest</h2>}
          {/* {window.innerWidth > 768 && ( */}
          <button
            className="sidebar-toggle"
            onClick={() => {
              toggleSidebar(); // <-- function call
              setSideWidth((prev) => !prev);
            }}
          >
            {sidebarCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
          {/* //   )} */}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
              title={sidebarCollapsed ? item.label : ""}
              onClick={closeSidebar}
            >
              <item.icon className="sidebar-icon" size={20} />
              {!sidebarCollapsed && (
                <span className="sidebar-label">{item.label}</span>
              )}
            </NavLink>
          ))}

          <button
            className="sidebar-item logout-btn"
            onClick={() => {
              handleLogout();
              closeSidebar();
            }}
          >
            <LogOut className="sidebar-icon" size={20} />
            {!sidebarCollapsed && <span className="sidebar-label">Logout</span>}
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
