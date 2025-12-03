// import React, { useState } from "react";
// import {
//   Search,
//   Edit2,
//   ShoppingCart,
//   User,
//   Menu,
//   Building2,
//   Heart,
//   Gift,
//   RefreshCw,
//   Store,
//   HelpCircle,
//   Info,
//   BadgeDollarSign,
//   Phone,
//   MessageCircle
// } from "lucide-react";
// import "./topbar.css";

// export default function FlowerAuraNavbar() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [deliveryLocation, setDeliveryLocation] = useState("Deliver To ?");
//   const [cartCount] = useState(0);
//   const [showMore, setShowMore] = useState(false);

//   // More menu items WITH ICONS
//   const moreMenuItems = [
//     { label: "Corporate Gifts", icon: <Building2 size={20} /> },
//     { label: "My Favourites", icon: <Heart size={20} /> },
//     { label: "Gift Finder", icon: <Gift size={20} /> },
//     { label: "Refer and Earn", icon: <RefreshCw size={20} /> },
//     { label: "Franchise", icon: <Store size={20} /> },
//     { label: "FAQ", icon: <HelpCircle size={20} /> },
//     { label: "About Us", icon: <Info size={20} /> },
//     { label: "Sell With Us", icon: <BadgeDollarSign size={20} /> },
//     { label: "Contact Us", icon: <Phone size={20} /> },
//     { label: "Whatsapp", icon: <MessageCircle size={20} /> },
//   ];

//   return (
//     <div className="navbar-wrapper">
//       {/* MAIN TOP BAR */}
//       <div className="topbar">
//         <div className="logo-area">
//           <span className="logo-text">CAKE FORESTS</span>
//         </div>

//         <div className="delivery-box">
//           <img src="https://flagcdn.com/w40/in.png" alt="IN" />
//           <span>{deliveryLocation}</span>
//           <Edit2 size={16} />
//         </div>

//         <div className="search-area">
//           <input
//             type="text"
            // placeholder="Search for flowers, cakes, gifts, etc."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <span className="search-btn mt-1 my-3"  type="button">
//             <Search size={18} />
//           </span>
//         </div>

//         <div className="action-area">
//           <div className="d-flex flex-column align-items-center">
//             <ShoppingCart size={22} />
//             {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
//             <span>Cart</span>
//           </div>

//           <div className="d-flex flex-column align-items-center">
//             <User size={22} />
//             <span>Sign In</span>
//           </div>

//           <div
//             className="d-flex flex-column align-items-center more-btn"
//             onClick={() => setShowMore(!showMore)}
//           >
//             <Menu size={22} />
//             <span>More</span>
//           </div>
//         </div>
//       </div>

//       {/* MORE DROPDOWN */}
//       {showMore && (
//         <div className="more-dropdown">
//           {moreMenuItems.map((item) => (
//             <div key={item.label} className="dropdown-item">
//               {item.icon}
//               <span style={{ marginLeft: "10px" }}>{item.label}</span>
//             </div>
//           ))}
//         </div>
        
//       )}
//     </div>
    
//   );
// }
import React, { useState } from "react";
import {
  Search,
  Edit2,
  ShoppingCart,
  User,
  Menu,
  Building2,
  Heart,
  Gift,
  RefreshCw,
  Store,
  HelpCircle,
  Info,
  BadgeDollarSign,
  Phone,
  MessageCircle
} from "lucide-react";

import "./topbar.css";

export default function FlowerAuraNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("Deliver To ?");
  const [cartCount] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const moreMenuItems = [
    { label: "Corporate Gifts", icon: <Building2 size={20} /> },
    { label: "My Favourites", icon: <Heart size={20} /> },
    { label: "Gift Finder", icon: <Gift size={20} /> },
    { label: "Refer and Earn", icon: <RefreshCw size={20} /> },
    { label: "Franchise", icon: <Store size={20} /> },
    { label: "FAQ", icon: <HelpCircle size={20} /> },
    { label: "About Us", icon: <Info size={20} /> },
    { label: "Sell With Us", icon: <BadgeDollarSign size={20} /> },
    { label: "Contact Us", icon: <Phone size={20} /> },
    { label: "Whatsapp", icon: <MessageCircle size={20} /> },
  ];

  return (
    <div className="navbar-wrapper">

      {/* ---------------- MOBILE HEADER ---------------- */}
      <div className="mobile-header">

        {/* Row 1 */}
        <div className="mobile-row-1">
          <Menu size={26} className="m-icon" />

          <h2 className="mobile-title">CAKE FORESTS</h2>

          <div className="right-icons">
            <div className="cart-wrap">
              <ShoppingCart size={24} className="m-icon" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>

            <Search
              size={24}
              className="m-icon"
              onClick={() => setShowSearch(!showSearch)}
            />
          </div>
        </div>

        {/* Location Bar */}
        <div className="mobile-location">
          <img src="https://flagcdn.com/w40/in.png" alt="" />
          <span>{deliveryLocation}</span>
          <Edit2 size={18} />
        </div>

        {/* Search Bar Toggle */}
        {showSearch && (
          <div className="mobile-searchbar">
            <input
              type="text"
              placeholder="Search....flowers, cakes, gifts, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={20} className="m-search-icon" />
          </div>
        )}
      </div>

      {/* ---------------- DESKTOP NAVBAR ---------------- */}
      <div className="topbar">
        <div className="logo-area">
          <span className="logo-text">CAKE FORESTS</span>
        </div>

        <div className="delivery-box">
          <img src="https://flagcdn.com/w40/in.png" alt="IN" />
          <span>{deliveryLocation}</span>
          <Edit2 size={16} />
        </div>

        <div className="search-area">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-btn mt-1 my-3" type="button">
            <Search size={18} />
          </span>
        </div>

        <div className="action-area">
          <div className="d-flex flex-column align-items-center">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            <span>Cart</span>
          </div>

          <div className="d-flex flex-column align-items-center">
            <User size={22} />
            <span>Sign In</span>
          </div>

          <div
            className="d-flex flex-column align-items-center more-btn"
            onClick={() => setShowMore(!showMore)}
          >
            <Menu size={22} />
            <span>More</span>
          </div>
        </div>
      </div>

      {showMore && (
        <div className="more-dropdown">
          {moreMenuItems.map((item) => (
            <div key={item.label} className="dropdown-item">
              {item.icon}
              <span style={{ marginLeft: "10px" }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
