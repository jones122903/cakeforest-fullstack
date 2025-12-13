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
  LogOut,
  Tag,
  Heart,
  BadgePercent,
  Info,
  MessageCircle,
  Phone,
  Gift,
} from "lucide-react";
import { IndianRupee } from "lucide-react";
import styles from "./topbar.module.css";
// Redux imports add பண்ணுங்க
import { useSelector, useDispatch } from "react-redux";
import { clearToken } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Toast message-க்கு

const Topbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Redux hooks add பண்ணுங்க
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  // const cartItems = useSelector((state) => state.cart.items);
  // const cartCount = cartItems?.length || 0;

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const wishlistCount = wishlistItems?.length || 0;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Show Toast Notification (same as AddProduct.jsx)
  const showToast = async (icon, title) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,

      didOpen: (toast) => {
        const progressBar = toast.querySelector(".swal2-timer-progress-bar");
        progressBar.style.background = icon === "success" ? "green" : "red";

        // Fix visibility issue: Topbar has z-index 9999, so we need > 9999
        const container = Swal.getContainer();
        if (container) {
          container.style.zIndex = "10000";
          // container.style.marginTop = "50px";
        }

        toast.addEventListener("mouseenter", () => {
          Swal.stopTimer();
        });

        toast.addEventListener("mouseleave", () => {
          Swal.resumeTimer();
        });
      },

      customClass: {
        popup: icon === "success" ? "colored-toast" : "colored-toast-error",
        container: 'toast-high-zindex', // Higher z-index க்கு
      },

      iconColor: icon === "success" ? "green" : "red",
    });

    await Toast.fire({ icon, title });
  };

  // Logout handler add 
  const handleLogout = () => {
    dispatch(clearToken());
    showToast("success", "You’ve successfully logged out");
    navigate("/");
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
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
            <div
              className={`d-none mx-auto d-lg-block ${styles.searchContainer}`}
            >
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
                <span className={styles.iconText}>Order</span>
              </div>
{/* 
              <div className={styles.iconItem} onClick={() => navigate('/wishlist')}>
                <Heart size={24} />
                <span className={styles.iconText}>Favourites</span>
                {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
              </div> */}

              <div className={styles.iconItem}>
                <ShoppingCart size={24} />
                <span className={styles.iconText}>Cart</span>
                <span className={styles.badge}>2</span>
              </div>

              {/* <div className={styles.iconItem}>
                <User size={24} />
                <span className={styles.iconText}>My Account</span>
              </div> */}

              {/* Conditional Login/Logout - Desktop */}
              {token ? (
                <>
                  <div className={styles.iconItem}>
                    <User size={24} />
                    <span className={styles.iconText}>
                      {user?.name || user?.email?.split("@")[0] || "Account"}
                    </span>
                  </div>

                  <div
                    className={styles.iconItem}
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}
                  >
                    <LogOut size={24} />
                    <span className={styles.iconText}>Logout</span>
                  </div>
                </>
              ) : (
                <div
                  className={styles.iconItem}
                  onClick={handleLogin}
                  style={{ cursor: "pointer" }}
                >
                  <User size={24} />
                  <span className={styles.iconText}>Login</span>
                </div>
              )}

              <div
                className={styles.iconItem}
                onMouseEnter={() => setShowMore(true)}
                onMouseLeave={() => setShowMore(false)}
              >
                <MoreVertical size={24} />
                <span className={styles.iconText}>More</span>

                {showMore && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownItem} onClick={() => navigate('/coupons')}>
                      <Tag size={18} /> <span>Coupons</span>
                    </div>
                    <div className={styles.dropdownItem} onClick={() => navigate('/wishlist')}>
                      <Heart size={18} /> <span>Favourites</span>
                    </div>
                    <div className={styles.dropdownItem} onClick={() => navigate('/offers')}>
                      <BadgePercent size={18} /> <span>Offers</span>
                    </div>
                    <div className={styles.dropdownItem} onClick={() => navigate('/about')}>
                      <Info size={18} /> <span>About Us</span>
                    </div>
                    <div className={styles.dropdownItem} onClick={() => window.open('https://wa.me/919876543210', '_blank')}>
                      <MessageCircle size={18} /> <span>Whatsapp</span>
                    </div>
                    <div className={styles.dropdownItem} onClick={() => navigate('/contact')}>
                      <Phone size={18} /> <span>Contact</span>
                    </div>
                    {token && (
                      <div
                        className={styles.dropdownItem}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogout();
                          setShowMore(false);
                        }}
                      >
                        <LogOut size={18} color="#e74c3c" />
                        <span style={{ color: '#e74c3c' }}>Logout</span>
                      </div>
                    )}
                  </div>
                )}
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
      <div className={`${styles.overlay} ${isMobileMenuOpen ? styles.overlayOpen : ""}`} onClick={toggleMobileMenu}></div>
      {/* SIDE DRAWER */}
      <div className={`${styles.sideDrawer} ${isMobileMenuOpen ? styles.sideDrawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Menu</span>
          <button onClick={toggleMobileMenu} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={24} color="#2C5F7C" />
          </button>
        </div>
        <div className={styles.drawerMenu}>

          {token && user && (
            <div className={styles.userInfoSection}>
              <User size={24} color="#2C5F7C" />
              <div>
                <div className={styles.userName}>{user.name || 'User'}</div>
                <div className={styles.userEmail}>{user.email}</div>
              </div>
            </div>
          )}
          <div className={styles.drawerMenuItem} onClick={() => navigate('/order')}>
            <MapPin size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Order</span>
          </div>
          <div className={styles.drawerMenuItem} onClick={() => navigate('/order')}>
            <ShoppingCart size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Cart</span>
            {/* <span className={styles.badge}>2</span> */}
          </div>

          {/* New Menu Items */}
          <div className={styles.drawerMenuItem} onClick={() => navigate('/coupons')}>
            <Tag size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Coupons</span>
          </div>
          <div className={styles.drawerMenuItem} onClick={() => navigate('/wishlist')}>
            <Heart size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Favourites</span>
          </div>
          <div className={styles.drawerMenuItem} onClick={() => navigate('/offers')}>
            <BadgePercent size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Offers</span>
          </div>
          <div className={styles.drawerMenuItem} onClick={() => navigate('/about')}>
            <Info size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>About Us</span>
          </div>
          <div className={styles.drawerMenuItem} onClick={() => window.open('https://wa.me/919876543210', '_blank')}>
            <MessageCircle size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Whatsapp</span>
          </div>
          <div className={styles.drawerMenuItem} onClick={() => navigate('/contact')}>
            <Phone size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Contact</span>
          </div>
          {token ? (
            <div
              className={styles.drawerMenuItem}
              onClick={handleLogout}
              style={{ borderTop: '1px solid #e0e0e0', marginTop: '10px', paddingTop: '10px' }}
            >
              <LogOut size={22} color="#e74c3c" />
              <span className={styles.drawerMenuText} style={{ color: '#e74c3c' }}>Logout</span>
            </div>
          ) : (
            <div className={styles.drawerMenuItem} onClick={handleLogin}>
              <User size={22} color="#2C5F7C" />
              <span className={styles.drawerMenuText}>Login</span>
            </div>
          )}



        </div>
      </div>
    </div>
  );
};

export default Topbar;
