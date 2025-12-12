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

const CakePrice = () => {
  const [wishlist, setWishlist] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRefs = useRef({});
  const navigate = useNavigate();

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
  }, []);

  const toggleWishlist = (cakeId) => {
    setWishlist((prev) => ({
      ...prev,
      [cakeId]: !prev[cakeId],
    }));
  };

  const gotoCakebuy = () => {
    navigate("/buypage");
  };

  const gotoCakeALl = () => {
    navigate("/gallery");
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
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

          return (
            <div
              key={cake._id}
              className={styles.cakeCard}
              onClick={gotoCakebuy}
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
                  {cake.images.map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={image}
                        alt={`${cake.cakeName} - Image ${idx + 1}`}
                        className={styles.cakeImage}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <button
                  className={styles.wishlistBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(cake._id);
                  }}
                >
                  <AnimatePresence mode="wait">
                    {wishlist[cake._id] ? (
                      <motion.div
                        key="filled"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <FaHeart size={27} className={styles.redHeart} />
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

                {cake.availability === 'available' && (
                  <span className={styles.vegBadge}>
                    <span className={styles.vegDot}></span>
                  </span>
                )}
              </div>

              <div className={styles.cardBody}>
                <h5 className={styles.cakeName}>{cake.cakeName}</h5>
                <p className={styles.cakePrice}>₹ {cake.price}</p>

                {/* Static Rating as data isn't in API yet */}
                <div className={styles.ratingSection}>
                  <span className={styles.ratingBadge}>★ 4.8</span>
                  <span className={styles.reviewsText}>(50+ Reviews)</span>
                </div>

                <div className={styles.deliveryText}>
                  <span className={styles.deliveryLabel}>Earliest Delivery :</span>
                  <span className={styles.deliveryTime}> Tomorrow</span>
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
  );
};

export default CakePrice;