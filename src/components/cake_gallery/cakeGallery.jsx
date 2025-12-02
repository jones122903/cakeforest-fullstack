import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './cakeGallery.module.css';

// Import cake images from assets/cake_gallery folder
// Chocolate Truffle Cake images
import chocolatetrafflecake1 from '../../assets/cake/chocolate traffle cake/chocolatetrafflecake1.jpg';
import chocolatetrafflecake2 from '../../assets/cake/chocolate traffle cake/chocolatetrafflecake2.jpg';
import chocolatetrafflecake3 from '../../assets/cake/chocolate traffle cake/chocolatetrafflecake3.jpg';
import chocolatetrafflecake4 from '../../assets/cake/chocolate traffle cake/chocolatetrafflecake4.jpg';
import chocolatetrafflecake5 from '../../assets/cake/chocolate traffle cake/chocolatetrafflecake5.jpg';
import chocolatetrafflecake6 from '../../assets/cake/chocolate traffle cake/chocolatetrafflecake6.jpg';

// Vanilla Cake images
import scrumptiousvanillacake1 from '../../assets/cake/scrumptious vanilla cake/scrumptiousvanillacake1.jpg';
import scrumptiousvanillacake2 from '../../assets/cake/scrumptious vanilla cake/scrumptiousvanillacake2.jpg';
import scrumptiousvanillacake3 from '../../assets/cake/scrumptious vanilla cake/scrumptiousvanillacake3.jpg';
import scrumptiousvanillacake4 from '../../assets/cake/scrumptious vanilla cake/scrumptiousvanillacake4.jpg';
import scrumptiousvanillacake5 from '../../assets/cake/scrumptious vanilla cake/scrumptiousvanillacake5.jpg';

// Butterfly Themed Cake images
import pearlsnbutterflythemed1 from '../../assets/cake/pearls n butterfly themed/pearlsnbutterflythemed1.jpg';
import pearlsnbutterflythemed2 from '../../assets/cake/pearls n butterfly themed/pearlsnbutterflythemed2.jpg';
import pearlsnbutterflythemed3 from '../../assets/cake/pearls n butterfly themed/pearlsnbutterflythemed3.jpg';

// Vintage Floral Cake images
import vintagefloralcake1 from '../../assets/cake/vintage floral cake/vintagefloralcake1.jpg';
import vintagefloralcake2 from '../../assets/cake/vintage floral cake/vintagefloralcake2.jpg';
import vintagefloralcake3 from '../../assets/cake/vintage floral cake/vintagefloralcake3.jpg';

const CakeGallery = () => {
  const [wishlist, setWishlist] = useState({});

  // Different images for each cake for carousel effect
  // Each cake has 3-6 HD quality images (1080x1080 recommended)
  const cakeImages = {
    1: [chocolatetrafflecake1, chocolatetrafflecake2, chocolatetrafflecake3, chocolatetrafflecake4, chocolatetrafflecake5, chocolatetrafflecake6],
    2: [scrumptiousvanillacake1, scrumptiousvanillacake2, scrumptiousvanillacake3, scrumptiousvanillacake4, scrumptiousvanillacake5],
    3: [pearlsnbutterflythemed1, pearlsnbutterflythemed2, pearlsnbutterflythemed3],
    4: [vintagefloralcake1, vintagefloralcake2, vintagefloralcake3],
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

  const toggleWishlist = (id) => {
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className={styles.cakeContainer}>
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
        {cakes.map(cake => {
          // Only render cake card if images exist for this cake
          if (!cakeImages[cake.id]) return null;

          return (
            <div
              key={cake.id}
              className={styles.cakeCard}
            >
              {/* Swiper Carousel - Plays only on hover */}
              <div 
                className={styles.imageWrapper}
                onMouseEnter={(e) => {
                  const swiper = e.currentTarget.querySelector('.swiper')?.swiper;
                  if (swiper && swiper.autoplay) {
                    swiper.autoplay.start();
                  }
                }}
                onMouseLeave={(e) => {
                  const swiper = e.currentTarget.querySelector('.swiper')?.swiper;
                  if (swiper && swiper.autoplay) {
                    swiper.autoplay.stop();
                    swiper.slideTo(0); // Reset to first slide
                  }
                }}
              >
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
                    disableOnInteraction: true,
                    pauseOnMouseEnter: true,
                  }}
                  loop={true}
                  speed={500}
                  className={styles.cakeSwiper}
                  onSwiper={(swiper) => {
                    swiper.autoplay.stop(); // Stop autoplay initially
                  }}
                >
                  {cakeImages[cake.id].map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={image}
                        alt={`${cake.name} - Image ${idx + 1}`}
                        className={styles.cakeImage}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

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
          );
        })}
      </div>
    </div>
  );
};

export default CakeGallery;