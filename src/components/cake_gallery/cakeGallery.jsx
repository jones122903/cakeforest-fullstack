import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from './cakeGallery.module.css';

// Import cake images from assets/cake_gallery folder
// Chocolate Truffle Cake images
import chocolateTruffle1 from '../../assets/cake_gallery/chocolate_truffle_1.jpg';
import chocolateTruffle2 from '../../assets/cake_gallery/chocolate_truffle_2.jpg';
import chocolateTruffle3 from '../../assets/cake_gallery/chocolate_truffle_3.jpg';
import chocolateTruffle4 from '../../assets/cake_gallery/chocolate_truffle_4.jpg';

// Vanilla Cake images
import vanillaCake1 from '../../assets/cake_gallery/vanilla_cake_1.jpg';
import vanillaCake2 from '../../assets/cake_gallery/vanilla_cake_2.jpg';
import vanillaCake3 from '../../assets/cake_gallery/vanilla_cake_3.jpg';
import vanillaCake4 from '../../assets/cake_gallery/vanilla_cake_4.jpg';

// Butterfly Themed Cake images
import butterflyThemed1 from '../../assets/cake_gallery/butterfly_themed_1.jpg';
import butterflyThemed2 from '../../assets/cake_gallery/butterfly_themed_2.jpg';
import butterflyThemed3 from '../../assets/cake_gallery/butterfly_themed_3.jpg';
import butterflyThemed4 from '../../assets/cake_gallery/butterfly_themed_4.jpg';

// Vintage Floral Cake images
import vintageFloral1 from '../../assets/cake_gallery/vintage_floral_1.jpg';
import vintageFloral2 from '../../assets/cake_gallery/vintage_floral_2.jpg';
import vintageFloral3 from '../../assets/cake_gallery/vintage_floral_3.jpg';
import vintageFloral4 from '../../assets/cake_gallery/vintage_floral_4.jpg';

const CakeGallery = () => {
  const [wishlist, setWishlist] = useState({});
  const [imageIndex, setImageIndex] = useState({});
  const [hovered, setHovered] = useState(null);

  // Different images for each cake for carousel effect
  // Each cake has 4 HD quality images (1080x1080 recommended)
  const cakeImages = {
    1: [chocolateTruffle1, chocolateTruffle2, chocolateTruffle3, chocolateTruffle4],
    2: [vanillaCake1, vanillaCake2, vanillaCake3, vanillaCake4],
    3: [butterflyThemed1, butterflyThemed2, butterflyThemed3, butterflyThemed4],
    4: [vintageFloral1, vintageFloral2, vintageFloral3, vintageFloral4],
  };

  const cakes = [
    {
      id: 1,
      name: 'Chocolate Truffle Cake',
      price: '₹595',
      rating: 4.9,
      reviews: 828,
      delivery: 'Tomorrow',
      badge: 'Same Day',
      veg: true,
    },
    {
      id: 2,
      name: 'Scrumptious Vanilla Cake',
      price: '₹635',
      rating: 4.9,
      reviews: 90,
      delivery: 'Tomorrow',
      badge: 'Best Seller',
      veg: true,
    },
    {
      id: 3,
      name: 'Pearls N Butterfly Themed Cake',
      price: '₹1595',
      rating: null,
      reviews: 0,
      delivery: 'Tomorrow',
      badge: null,
      veg: true,
    },
    {
      id: 4,
      name: 'Vintage Floral Cake',
      price: '₹1395',
      rating: null,
      reviews: 0,
      delivery: 'Tomorrow',
      badge: null,
      veg: true,
    },
  ];

  // Auto-rotate images only when hovered
  useEffect(() => {
    if (hovered === null) return;

    const interval = setInterval(() => {
      setImageIndex(prev => ({
        ...prev,
        [hovered]: ((prev[hovered] || 0) + 1) % (cakeImages[hovered]?.length || 1)
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [hovered, cakeImages]);

  const toggleWishlist = (id) => {
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className={styles.cakeContainer}>
      {/* Header Section */}
      {/* <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>All Cakes</h1>
          <p className={styles.subtitle}>Item 30 of 1016 Total | Ranging From ₹245 to ₹2545</p>
        </div>
        <button className={styles.viewAllBtn}>View All</button>
      </div> */}

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterChips}>
          {['Birthday', 'Anniversary', 'Chocolate', 'Butterscotch', 'Photo Cakes', 'Designer'].map(filter => (
            <button key={filter} className={styles.filterChip}>
              {filter}
            </button>
          ))}
        </div>
        <div className={styles.sortDropdown}>
          <select className={styles.dropdown}>
            <option>Popularity</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* Cakes Grid */}
      <div className={styles.cakesGrid}>
        {cakes.map(cake => (
          <div
            key={cake.id}
            className={styles.cakeCard}
            onMouseEnter={() => setHovered(cake.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Image Wrapper */}
            <div className={styles.imageWrapper}>
              <img
                src={cakeImages[cake.id][imageIndex[cake.id] || 0]}
                alt={cake.name}
                className={styles.cakeImage}
              />

              {/* Dot Indicators - Always Visible */}
              <div className={styles.dotIndicators}>
                {cakeImages[cake.id].map((_, idx) => (
                  <div
                    key={idx}
                    className={`${styles.dot} ${idx === (imageIndex[cake.id] || 0) ? styles.active : ''}`}
                  />
                ))}
              </div>

              {/* Badge */}
              {cake.badge && (
                <span className={styles.badgeTag}>{cake.badge}</span>
              )}

              {/* Wishlist Button */}
              <button
                className={`${styles.wishlistBtn} ${wishlist[cake.id] ? styles.liked : ''}`}
                onClick={() => toggleWishlist(cake.id)}
              >
                {wishlist[cake.id] ? (
                  <FaHeart size={20} />
                ) : (
                  <FaRegHeart size={20} />
                )}
              </button>

              {/* Veg Badge */}
              {cake.veg && (
                <div className={styles.vegBadge}>
                  <div className={styles.vegDot}></div>
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className={styles.cardBody}>
              <h3 className={styles.cakeName}>{cake.name}</h3>
              <p className={styles.cakePrice}>{cake.price}</p>

              {/* Rating Section */}
              {cake.rating && (
                <div className={styles.ratingSection}>
                  <span className={styles.ratingBadge}>
                    ★ {cake.rating}
                  </span>
                  <span className={styles.reviewsText}>({cake.reviews} Reviews)</span>
                </div>
              )}

              {/* Delivery Info */}
              <p className={styles.deliveryText}>
                <span className={styles.deliveryLabel}>Earliest Delivery:</span>
                <span className={styles.deliveryTime}>{cake.delivery}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CakeGallery;