import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./cakePrice.module.css";

// 🔹 Import Local Images
import cake_price1 from "../../assets/cake_price/cake_price1.avif";
import cake_price2 from "../../assets/cake_price/cake_price2.avif";
import cake_price3 from "../../assets/cake_price/cake_price3.avif";
import cake_price4 from "../../assets/cake_price/cake_price4.avif";
import cake_price5 from "../../assets/cake_price/cake_price5.avif";
import cake_price6 from "../../assets/cake_price/cake_price6.avif";
import cake_price7 from "../../assets/cake_price/cake_price7.avif";
import cake_price8 from "../../assets/cake_price/cake_price8.avif";
import { useNavigate } from "react-router-dom";

const CakePrice = () => {
  const [wishlist, setWishlist] = React.useState({});
  const navigate = useNavigate()

  const toggleWishlist = (cakeId) => {
    setWishlist((prev) => ({
      ...prev,
      [cakeId]: !prev[cakeId],
    }));
  };

  const gotoCakebuy = () => {
    navigate("/buypage")
  }

  const gotoCakeALl = () => {
    navigate("/gallery")
  }

  const cakes = [
    {
      id: 1,
      image: cake_price1,
      name: "Decadent Red Velvet Cake",
      price: 685,
      rating: 4.9,
      reviews: 319,
      delivery: "In 3 hours",
    },
    {
      id: 2,
      image: cake_price2,
      name: "Chocolate Truffle Cake",
      price: 595,
      rating: 4.9,
      reviews: 828,
      delivery: "In 3 hours",
    },
    {
      id: 3,
      image: cake_price3,
      name: "Divine Butterscotch Cake",
      price: 545,
      rating: 4.9,
      reviews: 728,
      delivery: "In 3 hours",
    },
    {
      id: 4,
      image: cake_price4,
      name: "Choco Butterscotch Cake",
      price: 645,
      rating: 5,
      reviews: 1,
      delivery: "In 3 hours",
    },
    {
      id: 5,
      image: cake_price5,
      name: "Fruit Fiesta Chocolate Cake",
      price: 675,
      rating: 4.8,
      reviews: 210,
      delivery: "In 3 hours",
    },
    {
      id: 6,
      image: cake_price6,
      name: "Purple Butterfly Birthday Cake",
      price: 625,
      rating: 4.9,
      reviews: 512,
      delivery: "In 3 hours",
    },
    {
      id: 7,
      image: cake_price7,
      name: "Customizable Photo Cake",
      price: 525,
      rating: 4.7,
      reviews: 430,
      delivery: "In 3 hours",
    },
    {
      id: 8,
      image: cake_price8,
      name: "Classic Butterscotch Crunch Cake",
      price: 715,
      rating: 5,
      reviews: 105,
      delivery: "In 3 hours",
    },
  ];

  return (
    <div className={styles.cakeContainer}>
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <h2 className={styles.mainTitle}>Bestseller Cakes Online</h2>
          <p className={styles.subtitle}>
            Delectably Delicious in Every Layers!
          </p>
        </div>
        <button className={styles.viewAllBtn} onClick={gotoCakeALl}>View All</button>
      </div>

      <div className={styles.cakesGrid}>
        {cakes.map((cake) => (
          <div key={cake.id} className={styles.cakeCard} onClick={gotoCakebuy}>
            <div className={styles.imageWrapper}>
              <img
                src={cake.image}
                alt={cake.name}
                className={styles.cakeImage}
              />

              <button
                className={styles.wishlistBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(cake.id);
                }}
              >
                <AnimatePresence mode="wait">
                  {wishlist[cake.id] ? (
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

              <span className={styles.vegBadge}>
                <span className={styles.vegDot}></span>
              </span>
            </div>

            <div className={styles.cardBody}>
              <h5 className={styles.cakeName}>{cake.name}</h5>
              <p className={styles.cakePrice}>₹ {cake.price}</p>

              {cake.id !== 5 && cake.id !== 6 && cake.id !== 8 ? (
                <div className={styles.ratingSection}>
                  <span className={styles.ratingBadge}>★ {cake.rating}</span>
                  <span className={styles.reviewsText}>
                    ({cake.reviews} Reviews)
                  </span>
                </div>
              ) : (
                <div className={styles.ratingSection}></div>
              )}

              <div className={styles.deliveryText}>
                <span className={styles.deliveryLabel}>Earliest Delivery :</span>
                <span className={styles.deliveryTime}> {cake.delivery}</span>
              </div>
            </div>
          </div>
        ))}
        <button className={styles.viewAllBtn} onClick={gotoCakeALl}>View All</button>
      </div>
    </div>
  );
};

export default CakePrice;