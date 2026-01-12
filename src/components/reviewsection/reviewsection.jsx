import React, { useEffect, useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./reviewSection.module.css";
import axios from "axios";


export default function ReviewsSection() {

  const API_URL = import.meta.env.VITE_API_URL
  const [reviewData,setReviewData]= useState([])
 


  useEffect(()=>{
    getReview()
  },[])

  const getReview= async()=>{
    try {
      const response = await axios.get(`${API_URL}/review`)
      console.log(response.data.reviews)
      setReviewData(response.data.reviews)
    } catch (error) {
      console.error(error)
    }
  }

  

  return (
    <div className={styles.containera}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          Review & Ratings for Cakes Delivery
          {/* <a href="#" className={styles.viewAllLink}>
            (View All Reviews)
          </a> */}
        </h2>

        {/* <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <Star fill="#FFA500" stroke="#FFA500" size={24} />
            <span className={styles.statText}>4.9 out of 5</span>
          </div>

          <div className={styles.statItem}>
            <ThumbsUp fill="#FFA500" stroke="#FFA500" size={24} />
            <span className={styles.statText}>97% Recommended</span>
          </div>
        </div> */}
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
          {reviewData.map((review) => (
  <SwiperSlide key={review._id}>
    <div className={styles.ReviewCard}>

      {review.images?.length > 0 && (
        <div className={styles.imageWrapper}>
          <img
            src={review.images[0]}
            alt={review.cakeName}
            className={styles.reviewImage}
          />
          <p className={`${styles.reviewText} ms-2`}>
            {review.description}
          </p>
        </div>
      )}

      <div className={styles.reviewerSection}>
        <div className={styles.nameRatingRow}>
          <span className={styles.reviewerName}>
            {review.cakeName}
          </span>
          <span className={styles.ratingBadge}>
            ★ {review.rating}
          </span>
        </div>

        <div className={styles.metaInfo}>
          <p className={styles.metaText}>
            <span className={styles.metaLabel}>Posted On :</span>{" "}
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
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
