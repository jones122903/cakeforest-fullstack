import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchWishlist,
  removeFromWishlistAsync,
} from "../../redux/slice/wishlistSlice";
import styles from "./Wishlist.module.css";
import { Trash2 } from "lucide-react";
import noWishlistImg from "../../assets/cake_price/no_wishlist.png";
import Footer from "../footer/footer.jsx";
import FlowerAuraNavbar from "../topbar/topbar.jsx";


const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist(user._id));
    } else {
      // If not logged in & trying to access, maybe redirect or show empty
      // But user probably came from menu which is visible
    }
  }, [dispatch, user]);

  const handleRemove = (e, productId) => {
    e.stopPropagation();
    if (user?._id) {
      dispatch(removeFromWishlistAsync({ userId: user._id, productId }));
    }
  };

  const handleCardClick = () => {
    navigate("/buypage");
  };

  if (!user) {
    return (
      <div>
        <div className="">
          <FlowerAuraNavbar />
        </div>
        <div className={styles.wishlistContainer}>
          <h2 className={styles.mainTitle}>My Favourites</h2>
          <div className={styles.emptyWishlist}>
            <img
              src={noWishlistImg}
              alt="Login Required"
              className={styles.emptyImage}
            />
            <p>
              Please{" "}
              <span
                style={{
                  color: "#2C5F7C",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>{" "}
              to view your favourites.
            </p>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="">
        <FlowerAuraNavbar />
      </div>
      <div className={styles.wishlistContainer}>
        <h2 className={styles.mainTitle}>
          My Favourites ({wishlistItems.length})
        </h2>


        {wishlistItems.length === 0 ? (
          <div className={styles.emptyWishlist}>
            <img
              src={noWishlistImg}
              alt="No Favourites"
              className={styles.emptyImage}
            />
            <p>No items in your favourites yet.</p>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#2C5F7C",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
              onClick={() => navigate("/gallery")}
            >
              Browse Cakes
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {wishlistItems.map((item) => {
              // item is the product object populated by backend
              // Safety check if item is null (if product deleted but id in wishlist)
              if (!item) return null;
              // Also handle if item is just an ID string (shouldn't happen with updated controller but good safety)
              const product = typeof item === "string" ? null : item;
              if (!product) return null;

              return (
                <div
                  key={product._id}
                  className={styles.cakeCard}
                  onClick={handleCardClick}
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : ""
                      }
                      alt={product.cakeName}
                      className={styles.cakeImage}
                    />
                    <button
                      className={styles.removeBtn}
                      onClick={(e) => handleRemove(e, product._id)}
                      title="Remove from Favourites"
                    >
                      <Trash2 size={18} color="#e74c3c" />
                    </button>
                  </div>

                  <div className={styles.cardBody}>
                    <h5 className={styles.cakeName}>{product.cakeName}</h5>
                    <p className={styles.cakePrice}>₹ {product.price}</p>
                    <div className={styles.ratingSection}>
                      <span className={styles.ratingBadge}>★ 4.8</span>
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        (50+ Reviews)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Wishlist;
