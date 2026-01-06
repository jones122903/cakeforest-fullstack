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
import {
  addToWishlistAsync,
  removeFromWishlistAsync,
  fetchWishlist,
} from "../../redux/slice/wishlistSlice";
// import "../Cart All Pages/Cartuialert.css";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { showHotToast } from "../../admin/utils/showToast.jsx";

const CakeGallery = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Location State:", location.state);

  // Redux
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const filters = ["All", "Birthday", "Anniversary", "Kids", "Love", "Wedding"];

  // Try multiple possible paths to get userId
  const userId = user?._id || user?.user?._id || user?.id;

  // const activeFilter = filters.includes(selectedFilter) ? selectedFilter : "All";

  useEffect(() => {
    if (location.state?.selectedFilter) {
      setSelectedFilter(location.state.selectedFilter);
    }
  }, [location.state]);

  //   useEffect(() => {
  //   if (!filters.includes(selectedFilter)) {
  //     setSelectedFilter("All");
  //   }
  // }, [selectedFilter]);

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
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  const toggleWishlist = (cakeId) => {
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
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }

    const isInWishlist = wishlistItems.some(
      (item) => (typeof item === "string" ? item : item._id) === cakeId
    );

    if (isInWishlist) {
      dispatch(
        removeFromWishlistAsync({
          userId,
          productId: cakeId,
        })
      );

      showHotToast("error", "Removed from Favourites"); // 🔴 red bg
    } else {
      dispatch(
        addToWishlistAsync({
          userId,
          productId: cakeId,
        })
      );

      showHotToast("success", "Added to Favourites"); // 🔵 success bg + tick
    }
  };

  const gotoCakebuy = (id) => {
    navigate(`/buypage/${id}`);
  };

  // Filter cakes based on selected category
  const filteredCakes =
    selectedFilter === "All"
      ? products
      : products.filter((cake) => {
        if (!cake.category) return false;
        const filterLower = selectedFilter.toLowerCase();
        if (Array.isArray(cake.category)) {
          return cake.category.some(
            (cat) => cat.toLowerCase() === filterLower
          );
        }
        return cake.category.toLowerCase() === filterLower;
      });

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
        return b.price - a.price;
    }
  });

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <div>
        <div className="">
          <FlowerAuraNavbar />
        </div>
        <div className={styles.cakeContainer}>
          {/* Filter Section */}
          <div className={styles.filterSection}>
            <div className={styles.filterChips}>
              {filters.map((filter) => (
                <button
                  key={filter}
                  // className={`${styles.filterChip} ${ activeFilter === filter ? styles.activeFilter : ""}`}
                  className={`${styles.filterChip} ${selectedFilter === filter ? styles.activeFilter : ""
                    }`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className={styles.sortDropdown}>
              <FormControl sx={{ minWidth: 130 }} size="small">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Sort by" }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ddd",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0e4d65",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0e4d65",
                    },
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#333",
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
          {sortedCakes.length > 0 ? (
            <div className={styles.cakesGrid}>
              {sortedCakes.map((cake) => {
                if (!cake.images || cake.images.length === 0) return null;

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

                      {cake.availability === "available" && (
                        <span className={styles.badgeTag}>Available</span>
                      )}

                      <button
                        className={styles.wishlistBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(cake._id);
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {wishlistItems.some(
                            (item) =>
                              (typeof item === "string" ? item : item._id) ===
                              cake._id
                          ) ? (
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

                      <div className={styles.vegBadge}>
                        <div className={styles.vegDot}></div>
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <h3 className={styles.cakeName}>{cake.cakeName}</h3>

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
                            <p className={styles.originalPrice}>
                              ₹{cake.price}
                            </p>

                            {/* Discount badge */}
                            <span className={styles.discountBadge}>
                              {cake.discount}% OFF
                            </span>
                          </>
                        ) : (
                          <p className={styles.cakePrice}>₹{cake.price}</p>
                        )}
                      </div>

                      <div className={styles.ratingSection}>
                        <span className={styles.ratingBadge}>★ 4.8</span>
                        <span className={styles.reviewsText}>
                          (50+ Reviews)
                        </span>
                      </div>

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
    </>
  );
};

export default CakeGallery;
