import React, { useState, useEffect,useRef } from "react";
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
  Package,
  Star,
} from "lucide-react";
import { IndianRupee } from "lucide-react";
import styles from "./topbar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { clearToken } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import OrderDrawer from "./OrderDrawer";
import CartDrawer from "./cart/cartDrawer.jsx";
import axios from "axios";
import { showHotToast } from "../../admin/utils/showToast.jsx";

const Topbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
const [searchText, setSearchText] = useState("");
const [showDropdown, setShowDropdown] = useState(false);
const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
const [cartCount, setCartCount] = useState(0);




  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const api_url = import.meta.env.VITE_API_URL;

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const wishlistCount = wishlistItems?.length || 0;

  const handleCartClick = () => {
  if (token) {
    setIsCartDrawerOpen(true);
    setIsMobileMenuOpen(false);
  } else {
    showHotToast("error", "Please login to view cart");
    navigate("/login");
  }
};

const fetchCartCount = async () => {
  if (!token) {
    setCartCount(0);
    return;
  }

  try {
    const res = await axios.get(`${api_url}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.success) {
      setCartCount(res.data.cart?.items?.length || 0);
    }
  } catch (error) {
    console.error("Error fetching cart count:", error);
  }
};

useEffect(() => {
  if (!isCartDrawerOpen) {
    fetchCartCount();
  }
}, [isCartDrawerOpen]);




  // Fetch pending orders count
  const fetchPendingCount = async () => {
    if (!user || !token) {
      setPendingCount(0);
      return;
    }

    try {
      const userId = user.id || user._id;
      const response = await axios.get(`${api_url}/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const pending = response.data.orders.filter(
          (order) => order.status === "pending"
        ).length;
        setPendingCount(pending);
      }
    } catch (error) {
      console.error("Error fetching pending count:", error);
    }
  };


  useEffect(() => {
  if (searchText.trim() === "") {
    setFilteredProducts([]);
    return;
  }

  const filtered = products.filter((product) =>
    product.cakeName
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  setFilteredProducts(filtered);
}, [searchText, products]);


  useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/products`
    );
    if (response.data.success) {
      setProducts(response.data.products);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const searchRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);

const handleSearchChange = (e) => {
  setSearchText(e.target.value);
  setShowDropdown(true);
};


  useEffect(() => {
    if (token && user) {
      fetchPendingCount();
      // Refresh count every 30 seconds
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, token]);

  // Refresh count when drawer closes
  useEffect(() => {
    if (!isOrderDrawerOpen && token && user) {
      fetchPendingCount();
    }
  }, [isOrderDrawerOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  
  const handleLogout = () => {
    dispatch(clearToken());
    setPendingCount(0);
    showHotToast("success", "You've successfully logged out");
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleOrderClick = () => {
    if (token) {
      setIsOrderDrawerOpen(true);
      setIsMobileMenuOpen(false);
    } else {
      showHotToast("error", "Please login to view orders");
      navigate("/login");
      setIsMobileMenuOpen(false);
    }
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
      <OrderDrawer open={isOrderDrawerOpen} setOpen={setIsOrderDrawerOpen} />
      <CartDrawer open={isCartDrawerOpen} setOpen={setIsCartDrawerOpen}/>


      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div className={styles.container}>
          <nav className={`${styles.navbar} navbar navbar-expand-lg`}>
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
            <div  ref={searchRef} className={`d-none mx-auto d-lg-block ${styles.searchContainer}`}>
  <input
    type="text"
    placeholder="Search for cakes..."
    className={styles.searchInput}
    value={searchText}
    onChange={handleSearchChange}
    onFocus={() => setShowDropdown(true)}
   />

  <span className={styles.searchIcon}>
    <Search size={20} />
  </span>

  {/* 🔽 Search result dropdown */}
  {/* 🔽 Search result dropdown */}
{showDropdown && (
  <div className={styles.searchDropdown}>
    {(searchText ? filteredProducts : products)
      .slice(0, 6)
      .map((product) => (
        <div
          key={product._id}
          className={styles.searchItem}
          onClick={() => {
            navigate(`/buypage/${product._id}`);
            setShowDropdown(false);
            setSearchText("");
          }}
        >
          <img
            src={product.images?.[0]}
            alt={product.cakeName}
            className={styles.searchImg}
          />
          <span>{product.cakeName}</span>
        </div>
      ))}

    {searchText && filteredProducts.length === 0 && (
      <p className={styles.noResult}>No cakes found</p>
    )}
  </div>
)}


 
</div>


            {/* DESKTOP ICONS */}
            <div className={`ms-auto d-none d-lg-flex ${styles.iconGroup}`}>
              <div
                className={styles.iconItem}
                onClick={handleOrderClick}
                style={{ cursor: "pointer" }}
              >
                <Package size={24} />
                <span className={styles.iconText}>Order</span>
                {pendingCount > 0 && (
                  <span className={styles.badge}>{pendingCount}</span>
                )}
              </div>

              <div
  className={styles.iconItem}
  onClick={handleCartClick}
  style={{ cursor: "pointer" }}
>
  <ShoppingCart size={24} />
  <span className={styles.iconText}>Cart</span>

  {cartCount > 0 && (
    <span className={styles.badge}>{cartCount}</span>
  )}
</div>


              {/* Conditional Login/Logout - Desktop */}
              {token ? (
                <div className={styles.iconItem}>
                  <User size={24} />
                  <span className={styles.iconText}>
                    {user?.name || user?.email?.split("@")[0] || "Account"}
                  </span>
                </div>
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
                    <div
                      className={styles.dropdownItem}
                      onClick={() => navigate("/couponspage")}
                    >
                      <Tag size={18} /> <span>Coupons</span>
                    </div>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => navigate("/wishlist")}
                    >
                      <Heart size={18} /> <span>Favourites</span>
                    </div>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => navigate("/rewards")}
                    >
                      <BadgePercent size={18} /> <span>Rewards </span>
                    </div>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => navigate("/reviews")}
                    >
                      <Star size={18} /> <span>Reviews</span>
                    </div>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => navigate("/about")}
                    >
                      <Info size={18} /> <span>About Us</span>
                    </div>
                    <div
                      className={styles.dropdownItem}
                      onClick={() =>
                        window.open("https://wa.me/8870985683", "_blank")
                      }
                    >
                      <MessageCircle size={18} /> <span>Whatsapp</span>
                    </div>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => navigate("/contact")}
                    >
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
                        <span style={{ color: "#e74c3c" }}>Logout</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* OVERLAY */}
      <div
        className={`${styles.overlay} ${
          isMobileMenuOpen ? styles.overlayOpen : ""
        }`}
        onClick={toggleMobileMenu}
      />

      {/* SIDE DRAWER */}
      <div
        className={`${styles.sideDrawer} ${
          isMobileMenuOpen ? styles.sideDrawerOpen : ""
        }`}
      >
        {/* HEADER */}
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
          {/* USER INFO */}
          {token && user && (
            <div className={styles.userInfoSection}>
              <User size={24} color="#2C5F7C" />
              <div>
                <div className={styles.userName}>{user.name || "User"}</div>
                <div className={styles.userEmail}>{user.email}</div>
              </div>
            </div>
          )}

            {!token && (
              <div className={styles.drawerMenuItem} onClick={handleLogin}>
                <User size={22} color="#2C5F7C" />
                <span className={styles.drawerMenuText}>Login</span>
              </div>
            )}
            
          {/* ORDERS */}
          <div className={styles.drawerMenuItem} onClick={handleOrderClick}>
            <Package size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Order</span>
            {pendingCount > 0 && (
              <span className={styles.badge}>{pendingCount}</span>
            )}
          </div>

          {/* CART */}
          <div
            className={styles.drawerMenuItem}
             onClick={handleCartClick}
  style={{ cursor: "pointer" }}
          >
            <ShoppingCart size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Cart</span>
          </div>

           {/* <div
  className={styles.iconItem}
 
>
  <ShoppingCart size={24} />
  <span className={styles.iconText}>Cart</span>

  {cartCount > 0 && (
    <span className={styles.badge}>{cartCount}</span>
  )}
</div> */}

          {/* COUPONS */}
          <div
            className={styles.drawerMenuItem}
            onClick={() => navigate("/couponspage")}
          >
            <Tag size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Coupons</span>
          </div>

          {/* FAVOURITES */}
          <div
            className={styles.drawerMenuItem}
            onClick={() => navigate("/wishlist")}
          >
            <Heart size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Favourites</span>
          </div>

          {/* OFFERS */}
          <div
            className={styles.drawerMenuItem}
            onClick={() => navigate("/rewards")}
          >
            <BadgePercent size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Rewards</span>
          </div>

          {/* REVIEWS */}
          <div
            className={styles.drawerMenuItem}
            onClick={() => navigate("/reviews")}
          >
            <Star size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Reviews</span>
          </div>

          {/* ABOUT */}
          <div
            className={styles.drawerMenuItem}
            onClick={() => navigate("/about")}
          >
            <Info size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>About Us</span>
          </div>

          {/* WHATSAPP */}
          <div
            className={styles.drawerMenuItem}
            onClick={() => window.open("https://wa.me/919876543210", "_blank")}
          >
            <MessageCircle size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Whatsapp</span>
          </div>

          {/* CONTACT */}
          <div
            className={styles.drawerMenuItem}
            onClick={() => navigate("/contact")}
          >
            <Phone size={22} color="#2C5F7C" />
            <span className={styles.drawerMenuText}>Contact</span>
          </div>

          {/* LOGIN – only when NOT logged in */}

          {/* LOGOUT – only when logged in */}
          {token && (
            <div
              className={styles.drawerMenuItem}
              onClick={handleLogout}
              style={{ borderTop: "1px solid #e5e7eb" }}
            >
              <LogOut size={22} color="#e74c3c" />
              <span
                className={styles.drawerMenuText}
                style={{ color: "#e74c3c" }}
              >
                Logout
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
