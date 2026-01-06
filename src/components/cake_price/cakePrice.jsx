import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./cakePrice.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlistAsync,
  removeFromWishlistAsync,
  fetchWishlist,
} from "../../redux/slice/wishlistSlice";
// import toast, { Toaster } from "react-hot-toast"; // Added Toaster import
// import "../Cart All Pages/Cartuialert.css";
import Swal from "sweetalert2";
import { Toaster } from "react-hot-toast";
import { showHotToast } from "../../admin/utils/showToast.jsx";

const CakePrice = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRefs = useRef({});
  const navigate = useNavigate();

  // Redux
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Extract userId robustly like in cakeGallery.jsx
  const userId = user?._id || user?.user?._id || user?.id;

  // Initial Fetch
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );

        if (response.data.success) {
          // Shuffle and pick 8 random products
          const allProducts = response.data.products;
          const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
          setProducts(shuffled.slice(0, 8));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Fetch wishlist if user is logged in
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  const gotoCakebuy = (id) => {
    navigate(`/buypage/${id}`);
  };

  const gotoCakeALl = () => {
    navigate("/gallery");
  };

  // Heart Click Handler (Add/Remove Wishlist)
  const handleHeartClick = (e, cakeId) => {
    e.stopPropagation();

    if (!userId) {
      Swal.fire({
        title: "Login Required!",
        text: "You need to be logged in to save favourites",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2C5F7C",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Now",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    // Check if productId is in wishlist array
    const isInWishlist = wishlistItems.some((item) => {
      const id = typeof item === "string" ? item : item._id;
      return id === cakeId;
    });

    if (isInWishlist) {
      // Remove
      dispatch(removeFromWishlistAsync({ userId: userId, productId: cakeId }));

      showHotToast("error", "Removed from Favourites");
    } else {
      // Add
      dispatch(addToWishlistAsync({ userId: userId, productId: cakeId }));

      showHotToast("success", "Added to Favourites");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      {/* Add Toaster component to render toasts */}

      <div className={styles.cakeContainer}>
        <div className={styles.headerSection}>
          <div className={styles.headerContent}>
            <h2 className={styles.mainTitle}>Bestseller Cakes Online</h2>
            <p className={styles.subtitle}>
              Delectably Delicious in Every Layers!
            </p>
          </div>
          <button className={styles.viewAllBtn} onClick={gotoCakeALl}>
            View All
          </button>
        </div>

        <div className={styles.cakesGrid}>
          {products.map((cake) => {
            // Only render cake card if images exist for this cake
            if (!cake.images || cake.images.length === 0) return null;

            const isInWishlist = wishlistItems?.some((item) => {
              const id = typeof item === "string" ? item : item._id;
              return id === cake._id;
            });

            return (
              <div
                key={cake._id}
                className={styles.cakeCard}
                onClick={() => gotoCakebuy(cake._id)}
                onMouseEnter={() => {
                  const swiper = swiperRefs.current[cake._id];
                  if (swiper && swiper.autoplay) {
                    swiper.autoplay.start();
                  }
                }}
                onMouseLeave={() => {
                  const swiper = swiperRefs.current[cake._id];
                  if (swiper && swiper.autoplay) {
                    swiper.autoplay.stop();
                    swiper.slideTo(0);
                  }
                }}
              >
                <div className={styles.imageWrapper}>
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    autoplay={{
                      delay: 1500,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: false,
                    }}
                    loop={true}
                    speed={500}
                    className={styles.cakeSwiper}
                    onSwiper={(swiper) => {
                      swiperRefs.current[cake._id] = swiper;
                      swiper.autoplay.stop();
                    }}
                  >
                    {cake.images.map((image, idx) => {
                      // Fix for broken URLs that might have 'undefined' from server
                      const cleanImage = image.startsWith("undefined")
                        ? image.replace(
                            "undefined",
                            import.meta.env.VITE_API_URL_SOUND
                          )
                        : image;

                      return (
                        <SwiperSlide key={idx}>
                          <img
                            src={cleanImage}
                            alt={`${cake.cakeName} - Image ${idx + 1}`}
                            className={styles.cakeImage}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>

                  <button
                    className={styles.wishlistBtn}
                    onClick={(e) => handleHeartClick(e, cake._id)}
                  >
                    <AnimatePresence mode="wait">
                      {isInWishlist ? (
                        <motion.div
                          key="filled"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <svg
                            width="27"
                            height="27"
                            viewBox="0 0 24 24"
                            fill="red"
                            stroke="white"
                            strokeWidth="0.8"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="outline"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <svg
                            width="27"
                            height="27"
                            viewBox="0 0 24 24"
                            fill="white"
                            stroke="#0E4D65"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>

                  {cake.availability === "available" && (
                    <span className={styles.vegBadge}>
                      <span className={styles.vegDot}></span>
                    </span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h5 className={styles.cakeName}>{cake.cakeName}</h5>

                  <div className={styles.priceContainer}>
                    {cake.discount > 0 ? (
                      <>
                        {/* Final discounted price */}
                        <p className={styles.cakePrice}>
                          ₹
                          {Math.round(
                            cake.price - (cake.price * cake.discount) / 100
                          )}
                        </p>

                        {/* Original price */}
                        <p className={styles.originalPrice}>₹{cake.price}</p>

                        {/* Discount badge */}
                        <span className={styles.discountBadge}>
                          {cake.discount}% OFF
                        </span>
                      </>
                    ) : (
                      <p className={styles.cakePrice}>₹{cake.price}</p>
                    )}
                  </div>

                  {/* Static Rating as data isn't in API yet */}
                  <div className={styles.ratingSection}>
                    <span className={styles.ratingBadge}>★ 4.8</span>
                    <span className={styles.reviewsText}>(50+ Reviews)</span>
                  </div>

                  <div className={styles.deliveryText}>
                    <span className={styles.deliveryLabel}>
                      Earliest Delivery :
                    </span>
                    <span className={styles.deliveryTime}>Tomorrow</span>
                  </div>
                </div>
              </div>
            );
          })}
          <button className={styles.viewAllBtn} onClick={gotoCakeALl}>
            View All
          </button>
        </div>
      </div>
    </>
  );
};

export default CakePrice;
