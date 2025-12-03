import React, { useState, useRef } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './cakeGallery.module.css';

// Import cake images from assets/cake folder
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

// Purple Butterfly Birthday Cake images
import purplebutterflybirthdaycake1 from '../../assets/cake/purple butterfly birthday cake/purplebutterflybirthdaycake1.jpg';
import purplebutterflybirthdaycake2 from '../../assets/cake/purple butterfly birthday cake/purplebutterflybirthdaycake2.jpg';
import purplebutterflybirthdaycake3 from '../../assets/cake/purple butterfly birthday cake/purplebutterflybirthdaycake3.jpg';

// Choco Butterscotch Cake images
import chocobutterscotchcake1 from '../../assets/cake/choco butterscotch cake/chocobutterscotchcake1.jpg';
import chocobutterscotchcake2 from '../../assets/cake/choco butterscotch cake/chocobutterscotchcake2.jpg';
import chocobutterscotchcake3 from '../../assets/cake/choco butterscotch cake/chocobutterscotchcake3.jpg';

// Floral Pearl Elegance Cake images
import floralpearlelegancecake1 from '../../assets/cake/floral pearl elegance cake/floralpearlelegancecake1.jpg';
import floralpearlelegancecake2 from '../../assets/cake/floral pearl elegance cake/floralpearlelegancecake2.jpg';
import floralpearlelegancecake3 from '../../assets/cake/floral pearl elegance cake/floralpearlelegancecake3.jpg';

// Red Velvet Cake images
import redvelvetcake1 from '../../assets/cake/red velvet cake/redvelvetcake1.jpg';
import redvelvetcake2 from '../../assets/cake/red velvet cake/redvelvetcake2.jpg';
import redvelvetcake3 from '../../assets/cake/red velvet cake/redvelvetcake3.jpg';

// Forever To Go Anniversary Cake images
import forevertogoanniversarycake1 from '../../assets/cake/forever to go anniversary cake/forevertogoanniversarycake1.jpg';
import forevertogoanniversarycake2 from '../../assets/cake/forever to go anniversary cake/forevertogoanniversarycake2.jpg';
import forevertogoanniversarycake3 from '../../assets/cake/forever to go anniversary cake/forevertogoanniversarycake3.jpg';

// Pink Barbie N Bow Cake images
import pinkbarbienBowcake1 from '../../assets/cake/Pink Barbie N Bow Cake/PinkBarbieNBowCake1.jpg';
import pinkbarbienBowcake2 from '../../assets/cake/Pink Barbie N Bow Cake/PinkBarbieNBowCake2.jpg';
import pinkbarbienBowcake3 from '../../assets/cake/Pink Barbie N Bow Cake/PinkBarbieNBowCake3.jpg';

// Rasmalai Pista Cream Cake images
import rasmalaipistacreamcake1 from '../../assets/cake/rasmalai pista cream cake/rasmalaipistacreamcake1(3).jpg';
import rasmalaipistacreamcake2 from '../../assets/cake/rasmalai pista cream cake/rasmalaipistacreamcake2(2).jpg';
import rasmalaipistacreamcake3 from '../../assets/cake/rasmalai pista cream cake/rasmalaipistacreamcake3.jpg';
import rasmalaipistacreamcake4 from '../../assets/cake/rasmalai pista cream cake/rasmalaipistacreamcake4.jpg';
import rasmalaipistacreamcake5 from '../../assets/cake/rasmalai pista cream cake/rasmalaipistacreamcake5.jpg';

// Fruit Fiesta Chocolate Cake images
import fruitfiestachocolatecake1 from '../../assets/cake/Fruit Fiesta Chocolate Cake/FruitFiestaChocolateCake1.jpg';
import fruitfiestachocolatecake2 from '../../assets/cake/Fruit Fiesta Chocolate Cake/FruitFiestaChocolateCake2.jpg';
import fruitfiestachocolatecake3 from '../../assets/cake/Fruit Fiesta Chocolate Cake/FruitFiestaChocolateCake3.jpg';

// Labubu Dolls Bento Cake images
import labubudollsbentocake1 from '../../assets/cake/labubu dolls bento cake/labubudollsbentocake1.jpg';
import labubudollsbentocake2 from '../../assets/cake/labubu dolls bento cake/labubudollsbentocake2.jpg';
import labubudollsbentocake3 from '../../assets/cake/labubu dolls bento cake/labubudollsbentocake3.jpg';

// Harry Potter Gryffindor Drip Cake images
import harrypottergryffindordripcake1 from '../../assets/cake/Harry Potter Gryffindor Drip Cake/HarryPotterGryffindorDripCake1.jpg';
import harrypottergryffindordripcake2 from '../../assets/cake/Harry Potter Gryffindor Drip Cake/HarryPotterGryffindorDripCake2.jpg';
import harrypottergryffindordripcake3 from '../../assets/cake/Harry Potter Gryffindor Drip Cake/HarryPotterGryffindorDripCake3.jpg';

// Classic Butterscotch Crunch Cake images
import classicbutterscotchcrunchcake1 from '../../assets/cake/Classic Butterscotch Crunch Cake/ClassicButterscotchCrunchCake1.jpg';
import classicbutterscotchcrunchcake2 from '../../assets/cake/Classic Butterscotch Crunch Cake/ClassicButterscotchCrunchCake2.jpg';
import classicbutterscotchcrunchcake3 from '../../assets/cake/Classic Butterscotch Crunch Cake/ClassicButterscotchCrunchCake3.jpg';

// Rasmalai Pista Delight Cake images
import rasmalaipistadelightcake1 from '../../assets/cake/rasmalai pista delight cake/rasmalaipistadelightcake1.jpg';
import rasmalaipistadelightcake2 from '../../assets/cake/rasmalai pista delight cake/rasmalaipistadelightcake2.jpg';
import rasmalaipistadelightcake3 from '../../assets/cake/rasmalai pista delight cake/rasmalaipistadelightcake3.jpg';

const CakeGallery = () => {
  const [wishlist, setWishlist] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const swiperRefs = useRef({});

  // Different images for each cake for carousel effect
  const cakeImages = {
    1: [chocolatetrafflecake1, chocolatetrafflecake2, chocolatetrafflecake3, chocolatetrafflecake4,],
    2: [scrumptiousvanillacake1, scrumptiousvanillacake2, scrumptiousvanillacake3, scrumptiousvanillacake4],
    3: [pearlsnbutterflythemed1, pearlsnbutterflythemed2, pearlsnbutterflythemed3],
    4: [vintagefloralcake1, vintagefloralcake2, vintagefloralcake3],
    5: [purplebutterflybirthdaycake1, purplebutterflybirthdaycake2, purplebutterflybirthdaycake3],
    6: [chocobutterscotchcake1, chocobutterscotchcake2, chocobutterscotchcake3],
    7: [floralpearlelegancecake1, floralpearlelegancecake2, floralpearlelegancecake3],
    8: [redvelvetcake1, redvelvetcake2, redvelvetcake3],
    9: [forevertogoanniversarycake1, forevertogoanniversarycake2, forevertogoanniversarycake3],
    10: [pinkbarbienBowcake1, pinkbarbienBowcake2, pinkbarbienBowcake3],
    11: [rasmalaipistacreamcake1, rasmalaipistacreamcake2, rasmalaipistacreamcake3, rasmalaipistacreamcake4],
    12: [fruitfiestachocolatecake1, fruitfiestachocolatecake2, fruitfiestachocolatecake3],
    13: [labubudollsbentocake1, labubudollsbentocake2, labubudollsbentocake3],
    14: [harrypottergryffindordripcake1, harrypottergryffindordripcake2, harrypottergryffindordripcake3],
    15: [classicbutterscotchcrunchcake1, classicbutterscotchcrunchcake2, classicbutterscotchcrunchcake3],
    16: [rasmalaipistadelightcake1, rasmalaipistadelightcake2, rasmalaipistadelightcake3],
  };

  const cakes = [
    {
      id: 1,
      name: 'Chocolate Truffle Cake',
      price: '₹595',
      originalPrice: '₹799',
      discount: '26%',
      rating: 4.9,
      reviews: 828,
      delivery: 'Tomorrow',
      badge: 'Same Day',
      veg: true,
      category: 'Chocolate',
    },
    {
      id: 2,
      name: 'Scrumptious Vanilla Cake',
      price: '₹635',
      originalPrice: '₹849',
      discount: '25%',
      rating: 4.9,
      reviews: 90,
      delivery: 'Tomorrow',
      badge: 'Best Seller',
      veg: true,
      category: 'Birthday',
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
      category: 'Designer',
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
      category: 'Designer',
    },
    {
      id: 5,
      name: 'Purple Butterfly Birthday Cake',
      price: '₹815',
      rating: null,
      reviews: 0,
      delivery: 'Tomorrow',
      badge: 'Best Seller',
      veg: true,
      category: 'Birthday',
    },
    {
      id: 6,
      name: 'Choco Butterscotch Cake',
      price: '₹645',
      originalPrice: '₹799',
      discount: '19%',
      rating: 5,
      reviews: 1,
      delivery: 'Tomorrow',
      badge: null,
      veg: true,
      category: 'Butterscotch',
    },
    {
      id: 7,
      name: 'Floral Pearl Elegance Cake',
      price: '₹795',
      rating: 5,
      reviews: 1,
      delivery: 'Tomorrow',
      badge: null,
      veg: true,
      category: 'Designer',
    },
    {
      id: 8,
      name: 'Red Velvet Cake',
      price: '₹685',
      originalPrice: '₹899',
      discount: '24%',
      rating: 4.5,
      reviews: 320,
      delivery: 'Tomorrow',
      badge: null,
      veg: true,
      category: 'Chocolate',
    },
    {
      id: 9,
      name: 'Forever To Go Anniversary Cake',
      price: '₹815',
      rating: null,
      reviews: 0,
      delivery: 'Tomorrow',
      badge: null,
      veg: true,
      category: 'Anniversary',
    },
    {
      id: 10,
      name: 'Pink Barbie N Bow Cake',
      price: '₹1895',
      rating: null,
      reviews: 0,
      delivery: 'Tomorrow',
      badge: null,
      veg: true,
      category: 'Designer',
    },
    {
      id: 11,
      name: 'Rasmalai Pista Cream Cake',
      price: '₹815',
      originalPrice: '₹999',
      discount: '18%',
      rating: 4.9,
      reviews: 271,
      delivery: 'Tomorrow',
      badge: 'Same Day',
      veg: true,
      category: 'Birthday',
    },
    {
      id: 12,
      name: 'Fruit Fiesta Chocolate Cake',
      price: '₹775',
      rating: null,
      reviews: 0,
      delivery: 'Tomorrow',
      badge: 'Best Seller',
      veg: true,
      category: 'Chocolate',
    },
    {
      id: 13,
      name: 'Labubu Dolls Bento Cake',
      price: '₹545',
      rating: null,
      reviews: 0,
      delivery: 'Tomorrow',
      badge: null,
      veg: true,
      category: 'Photo Cakes',
    },
    {
      id: 14,
      name: 'Harry Potter Gryffindor Drip Cake',
      price: '₹1995',
      rating: null,
      reviews: 0,
      delivery: 'Tomorrow',
      badge: null,
      veg: true,
      category: 'Designer',
    },
    {
      id: 15,
      name: 'Classic Butterscotch Crunch Cake',
      price: '₹645',
      rating: null,
      reviews: 0,
      delivery: 'Tomorrow',
      badge: 'Best Seller',
      veg: true,
      category: 'Butterscotch',
    },
    {
      id: 16,
      name: 'Rasmalai Pista Delight Cake',
      price: '₹815',
      rating: 5,
      reviews: 2,
      delivery: 'Tomorrow',
      badge: 'Best Seller',
      veg: true,
      category: 'Birthday',
    },
  ];

  const toggleWishlist = (id) => {
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter cakes based on selected category
  const filteredCakes = selectedFilter === 'All'
    ? cakes
    : cakes.filter(cake => cake.category === selectedFilter);

  // Sort cakes based on selected sort option
  const sortedCakes = [...filteredCakes].sort((a, b) => {
    switch (sortBy) {
      case 'priceLowToHigh':
        // Extract numeric value from price string (e.g., "₹595" => 595)
        const priceA = parseInt(a.price.replace('₹', ''));
        const priceB = parseInt(b.price.replace('₹', ''));
        return priceA - priceB;

      case 'priceHighToLow':
        const priceA2 = parseInt(a.price.replace('₹', ''));
        const priceB2 = parseInt(b.price.replace('₹', ''));
        return priceB2 - priceA2;

      case 'newest':
        // Sort by ID in descending order (assuming higher ID = newer)
        return b.id - a.id;

      case 'popularity':
      default:
        // Sort by reviews count (higher reviews = more popular)
        return b.reviews - a.reviews;
    }
  });

  return (
    <div className={styles.cakeContainer}>
      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterChips}>
          {['All', 'Birthday', 'Anniversary', 'Chocolate', 'Butterscotch', 'Photo Cakes', 'Designer'].map(filter => (
            <button
              key={filter}
              className={`${styles.filterChip} ${selectedFilter === filter ? styles.activeFilter : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className={styles.sortDropdown}>
          <select
            className={styles.dropdown}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popularity">Popularity</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Cakes Grid */}
      <div className={styles.cakesGrid}>
        {sortedCakes.map(cake => {
          // Only render cake card if images exist for this cake
          if (!cakeImages[cake.id]) return null;

          return (
            <div
              key={cake.id}
              className={styles.cakeCard}


              onMouseEnter={() => {
                const swiper = swiperRefs.current[cake.id];
                if (swiper && swiper.autoplay) {
                  swiper.autoplay.start();
                }
              }}
              onMouseLeave={() => {
                const swiper = swiperRefs.current[cake.id];
                if (swiper && swiper.autoplay) {
                  swiper.autoplay.stop();
                  swiper.slideTo(0);
                }
              }}
            >
              {/* Swiper Carousel - Plays only on hover */}
              <div
                className={styles.imageWrapper}

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
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                  }}
                  loop={true}
                  speed={500}
                  className={styles.cakeSwiper}
                  onSwiper={(swiper) => {
                    swiperRefs.current[cake.id] = swiper;
                    swiper.autoplay.stop();
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

                {/* Price Section with discount */}
                <div className={styles.priceContainer}>
                  <p className={styles.cakePrice}>{cake.price}</p>
                  {cake.originalPrice && (
                    <>
                      <p className={styles.originalPrice}>{cake.originalPrice}</p>
                      {cake.discount && (
                        <span className={styles.discountBadge}>{cake.discount} OFF</span>
                      )}
                    </>
                  )}
                </div>

                {/* Rating Section */}
                {cake.rating ? (
                  <div className={styles.ratingSection}>
                    <span className={styles.ratingBadge}>★ {cake.rating}</span>
                    <span className={styles.reviewsText}>({cake.reviews} Reviews)</span>
                  </div>
                ) : (
                  <div className={styles.ratingPlaceholder}></div>
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