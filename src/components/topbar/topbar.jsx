import React, { useState } from "react";
import {
  Search,
  MapPin,
  Edit2,
  Package,
  ShoppingCart,
  IndianRupee,
  User,
  Menu,
} from "lucide-react";
import "./topbar.css";

export default function FlowerAuraNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("Deliver To ?");
  const [cartCount] = useState(0);


  return (
    <div className="navbar-wrapper">
      {/* TOP BAR */}
      <div className="topbar">
        {/* Logo */}
        <div className="logo-area">
       
          <span className="logo-text">CAKE FORESTS</span>
        </div>

        {/* Delivery */}
        <div className="delivery-box">
          <img src="https://flagcdn.com/w40/in.png" alt="IN" />
          <span>{deliveryLocation}</span>
          <Edit2 size={16} />
        </div>

        {/* Search */}
        <div className="search-area">
          <input
            type="text"
            placeholder="Search for flowers, cakes, gifts, etc."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-btn mt-1 me-3" type="button" >
            <Search size={18} />
          </span>
        </div>

        {/* Actions */}
        <div className="action-area">
         

          <div className="action-box cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            <span>Cart</span>
          </div>

       
          <div className="action-box">
            <User size={22} />
            <span>Sign In</span>
          </div>

          <div className="action-box">
            <Menu size={22} />
            <span>More</span>
          </div>
        </div>
      </div>

    
    </div>
  );
}
