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
import "bootstrap/dist/css/bootstrap.min.css";
import {
  MapPin,
  ShoppingCart,
  User,
  MoreVertical,
  Search,
  Menu,
  X,
  Edit,
} from "lucide-react";
import { IndianRupee } from "lucide-react";
import styles from "./topbar.module.css";

const Topbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 9999,
        background: "#fff",
      }}
    >
      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div className={styles.container}>
          <nav className={`${styles.navbar} navbar navbar-expand-lg`}>

            {/* MOBILE MENU BUTTON */}
           

            {/* LOGO */}
            <div className="navbar-brand d-flex align-items-center">
             <svg
  className={styles.logo}
  viewBox="0 0 350 80"
  preserveAspectRatio="xMidYMid meet"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M30 20 L40 35 L50 20 L40 28 L30 20 Z" fill="#244B64" />
  <path d="M22 28 L40 45 L58 28 L40 36 L22 28 Z" fill="#2C5F7C" />
  <path d="M15 36 L40 57 L65 36 L40 46 L15 36 Z" fill="#387C9D" />

  <text
    x="85"
    y="52"
    fill="#2C5F7C"
    fontSize="35"
    fontWeight="800"
    fontFamily="Poppins, sans-serif"
    letterSpacing="1px"
  >
    Cake Forest
  </text>
</svg>

            </div>

             <button
              className="navbar-toggler d-lg-none border-0 p-0 me-4"
              type="button"
              onClick={toggleMobileMenu}
              style={{ background: "none", border: "none" }}
            >
              <Menu size={28} className={styles.menuIcon} />
            </button>

            {/* SEARCH BAR (DESKTOP) */}
            <div className={`d-none mx-auto d-lg-block ${styles.searchContainer}`}>
              <input
                type="text"
                placeholder="Search for products..."
                className={styles.searchInput}
              />
              <span className={styles.searchIcon}>
                <Search size={20} />
              </span>
            </div>

            {/* DESKTOP ICONS */}
            <div className={`ms-auto d-none d-lg-flex ${styles.iconGroup}`}>
              <div className={styles.iconItem}>
                <MapPin size={24} />
                <span className={styles.iconText}>Track Order</span>
              </div>

              <div className={styles.iconItem}>
                <ShoppingCart size={24} />
                <span className={styles.iconText}>Cart</span>
                <span className={styles.badge}>2</span>
              </div>

              <div className={styles.iconItem}>
                <User size={24} />
                <span className={styles.iconText}>My Account</span>
              </div>

              <div className={styles.iconItem}>
                <MoreVertical size={24} />
                <span className={styles.iconText}>More</span>
              </div>
            </div>

            {/* MOBILE ICONS */}
            {/* <div className={`d-flex d-lg-none ms-auto ${styles.mobileIconsRow}`}>
              <div className={styles.iconItem}>
                <ShoppingCart size={22} />
                <span className={styles.badge}>0</span>
              </div>
              <div className={styles.iconItem}>
                <Search size={22} />
              </div>
              <div className={styles.iconItem}>
                <User size={24} />
              </div>
            </div> */}
          </nav>
        </div>
      </div>

      {/* OVERLAY */}
      <div
        className={`${styles.overlay} ${
          isMobileMenuOpen ? styles.overlayOpen : ""
        }`}
        onClick={toggleMobileMenu}
      ></div>

      {/* SIDE DRAWER */}
      <div
        className={`${styles.sideDrawer} ${
          isMobileMenuOpen ? styles.sideDrawerOpen : ""
        }`}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Menu</span>
          <button
            onClick={toggleMobileMenu}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={24} color="#2C5F7C" />
          </button>
        </div>

        <div className={styles.drawerMenu}>
          <div className={styles.deliverSection}>
            <span className={styles.flag}>🇮🇳</span>
            <span className={styles.deliverText}>Deliver To ?</span>
            <Edit size={16} color="#2C5F7C" />
          </div>

          <div className={styles.drawerMenuItem}>
            <MapPin size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Track Order</span>
          </div>

          <div className={styles.drawerMenuItem}>
            <ShoppingCart size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Cart</span>
            <span className={styles.badge}>2</span>
          </div>

          <div className={styles.drawerMenuItem}>
            <User size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>My Account</span>
          </div>

          <div className={styles.drawerMenuItem}>
            <Search size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Search Products</span>
          </div>

          <div className={styles.drawerMenuItem}>
            <IndianRupee size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Currency: INR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
