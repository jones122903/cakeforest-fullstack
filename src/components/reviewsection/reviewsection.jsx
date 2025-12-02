import React from "react";
import { Star, ThumbsUp } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./reviewSection.module.css";

export default function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      name: "kapila",
      rating: 4.5,
      text: "Very nice service. Trusted nd genuine",
      postedOn: "18th Nov 2025",
      city: "Bundi",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop",
    },
    {
      id: 2,
      name: "Serene Banerjee",
      rating: 4.5,
      text: "Product was very fresh and delivered on time.... please maintain",
      postedOn: "18th Nov 2025",
      city: "Kolkata",
      occasion: "Birthday",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop",
    },
    {
      id: 3,
      name: "Biswa jit",
      rating: 4.5,
      text: "Taste was amazing and thanks this",
      postedOn: "18th Nov 2025",
      city: "Kolkata",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop",
    },
    {
      id: 4,
      name: "Priya Sharma",
      rating: 5,
      text: "Excellent quality and timely delivery. Highly recommended!",
      postedOn: "17th Nov 2025",
      city: "Mumbai",
      occasion: "Anniversary",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop",
    },
    {
      id: 5,
      name: "Rahul Kumar",
      rating: 4,
      text: "Good service and fresh products. Will order again.",
      postedOn: "16th Nov 2025",
      city: "Delhi",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop",
    },
  ];

  return (
    <div className={styles.containera}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          Review & Ratings for Cakes Delivery{" "}
          <a href="#" className={styles.viewAllLink}>
            (View All Reviews)
          </a>
        </h2>

        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <Star fill="#FFA500" stroke="#FFA500" size={24} />
            <span className={styles.statText}>4.9 out of 5</span>
          </div>

          <div className={styles.statItem}>
            <ThumbsUp fill="#FFA500" stroke="#FFA500" size={24} />
            <span className={styles.statText}>97% Recommended</span>
          </div>
        </div>
      </div>

      {/* Swiper */}
      <div className={styles.swiperWrapper}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={false}
          spaceBetween={20}
          slidesPerView={3}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
          speed={800}
          className={styles.swiper}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className={styles.ReviewCard}>
                {review.image && (
                  <div className={styles.imageWrapper}>
                    <img
                      src={review.image}
                      alt={review.name}
                      className={styles.reviewImage}
                    />
                <p className={`${styles.reviewText} ms-2`}>{review.text}</p>
                  </div>
                )}


                <div className={styles.reviewerSection}>
                  <div className={styles.nameRatingRow}>
                    <span className={styles.reviewerName}>{review.name}</span>
                    <span className={styles.ratingBadge}>
                      ★ {review.rating}
                    </span>
                  </div>

                  <div className={styles.metaInfo}>
                    <p className={styles.metaText}>
                      <span className={styles.metaLabel}>Posted On :</span>{" "}
                      {review.postedOn}
                    </p>

                    <p className={styles.metaText}>
                      <span className={styles.metaLabel}>City :</span>{" "}
                      {review.city}
                    </p>

                    {review.occasion && (
                      <p className={styles.metaText}>
                        <span className={styles.metaLabel}>Occasion :</span>{" "}
                        {review.occasion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
