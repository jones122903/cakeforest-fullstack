import { useState, useRef, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { Select, MenuItem, FormControl } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./cakeGallery.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../footer/footer.jsx";
import ReviewsSection from "../reviewsection/reviewsection.jsx";
import FlowerAuraNavbar from "../topbar/topbar.jsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlistAsync, removeFromWishlistAsync, fetchWishlist } from "../../redux/slice/wishlistSlice";
import toast from "react-hot-toast";
import "../Cart All Pages/Cartuialert.css";

const CakeGallery = () => {
  // const [wishlist, setWishlist] = useState({}); // Removed local state
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRefs = useRef({});

  // Redux
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Fetch wishlist if logged in
    if (user?._id) {
      dispatch(fetchWishlist(user._id));
    }
  }, [dispatch, user?._id]);

  const toggleWishlist = (cakeId) => {
    if (!user) {
      alert("Please login to add to favourites!");
      // navigate("/login"); // Optional: redirect
      return;
    }

    const isInWishlist = wishlistItems.some((item) => {
      const id = typeof item === 'string' ? item : item._id;
      return id === cakeId;
    });

    if (isInWishlist) {
      dispatch(removeFromWishlistAsync({ userId: user._id, productId: cakeId }));
      toast.custom((t) => (
        <div className={`re-bk-toast-wrapper ${t.visible ? "slide-in" : "slide-out"}`} style={{ zIndex: 99999999 }}>
          <div className="re-bk-toast">
            <span className="re-bk-text-toast">Removed from Favourites</span>
          </div>
          <div className="re-bk-progress" />
        </div>
      ), { duration: 2000, position: "top-right" });

    } else {
      dispatch(addToWishlistAsync({ userId: user._id, productId: cakeId }));
      toast.custom((t) => (
        <div className={`re-bk-toast-wrapper ${t.visible ? "slide-in" : "slide-out"}`} style={{ zIndex: 99999999 }}>
          <div className="re-bk-toast">
            <img src="https://bkassets.bakingo.com/bakingo-ssr/static/media/check.adfc0424.svg" alt="check mark" />
            <span className="re-bk-text-toast">Added to Favourites</span>
          </div>
          <div className="re-bk-progress" />
        </div>
      ), { duration: 2000, position: "top-right" });
    }
  };

  // Filter cakes based on selected category
  const filteredCakes =
    selectedFilter === "All"
      ? products
      : products.filter(
        (cake) => cake.category.toLowerCase() === selectedFilter.toLowerCase()
      );

  // Sort cakes based on selected sort option
  const sortedCakes = [...filteredCakes].sort((a, b) => {
    switch (sortBy) {
      case "priceLowToHigh":
        return a.price - b.price;

      case "priceHighToLow":
        return b.price - a.price;

      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);

      case "popularity":
      default:
        // Assuming availability or another metric for popularity since reviews aren't in DB yet
        return b.price - a.price; // Placeholder sort
    }
  });

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div>
      <div className="">
        <FlowerAuraNavbar />
      </div>
      <div className={styles.cakeContainer}>
        {/* Filter Section */}
        <div className={styles.filterSection}>
          <div className={styles.filterChips}>
            {[
              "All",
              "Birthday",
              "Anniversary",
              "Kids",
              "Love",
              "Wedding",

            ].map((filter) => (
              <button
                key={filter}
                className={`${styles.filterChip} ${selectedFilter === filter ? styles.activeFilter : ""
                  }`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className={styles.sortDropdown}>
            <FormControl sx={{ m: 1, minWidth: 130 }} size="medium">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Sort by' }}
                sx={{
                  bgcolor: 'white',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ddd',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0e4d65',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0e4d65',
                  },
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333'
                }}
              >
                <MenuItem value="popularity">Popularity</MenuItem>
                <MenuItem value="priceLowToHigh">Low to High</MenuItem>
                <MenuItem value="priceHighToLow">High to Low</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Cakes Grid */}
        {/* Cakes Grid */}
        {sortedCakes.length > 0 ? (
          <div className={styles.cakesGrid}>
            {sortedCakes.map((cake) => {
              // Only render cake card if images exist for this cake
              if (!cake.images || cake.images.length === 0) return null;

              return (
                <div
                  key={cake._id}
                  className={styles.cakeCard}
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
                  {/* Swiper Carousel - Plays only on hover */}
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

                    {/* Badge */}
                    {cake.availability === "available" && (
                      <span className={styles.badgeTag}>Available</span>
                    )}

                    <button
                      className={styles.wishlistBtn}
                      onClick={() => toggleWishlist(cake._id)}
                    >
                      <AnimatePresence mode="wait">
                        {wishlistItems.some((item) => (typeof item === 'string' ? item : item._id) === cake._id) ? (
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

                    {/* Veg Badge */}
                    <div className={styles.vegBadge}>
                      <div className={styles.vegDot}></div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cakeName}>{cake.cakeName}</h3>

                    {/* Price Section with discount */}
                    <div className={styles.priceContainer}>
                      <p className={styles.cakePrice}>₹{cake.price}</p>
                      {cake.discount > 0 && (
                        <>
                          <p className={styles.originalPrice}>
                            ₹
                            {Math.round(
                              cake.price + (cake.price * cake.discount) / 100
                            )}
                          </p>
                          <span className={styles.discountBadge}>
                            {cake.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {/* Rating Section - Static for now as DB doesn't have it explicitly */}
                    <div className={styles.ratingSection}>
                      <span className={styles.ratingBadge}>★ 4.8</span>
                      <span className={styles.reviewsText}>(50+ Reviews)</span>
                    </div>

                    {/* Delivery Info */}
                    <p className={styles.deliveryText}>
                      <span className={styles.deliveryLabel}>
                        Earliest Delivery:
                      </span>
                      <span className={styles.deliveryTime}>Tomorrow</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              fontSize: "1.5rem",
              color: "#555",
              textAlign: "center",
            }}
          >
            No cakes found in {selectedFilter} category.
          </div>
        )}
        <div style={{ marginTop: "89px" }}>
          <ReviewsSection />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default CakeGallery;
