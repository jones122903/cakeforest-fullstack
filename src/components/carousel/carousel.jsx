import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper modules
import { Pagination, Navigation, Autoplay } from "swiper/modules";

// Swiper CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Carousel() {

  const isMobile = window.innerWidth <= 700;
  return (
    <div style={{ width: "100%",maxWidth:"100%", margin: "0 auto", }}>
       

      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        // spaceBetween={20}
        // slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        speed={800}
        pagination={{ 
          clickable: true,
          el: ".custom-swiper-pagination"
        }}
        
        style={{
          borderRadius: "12px",
         height: isMobile ? "250px" : "300px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)"
        }}
      >

        <SwiperSlide>
          <img
            src="https://imgcdn.floweraura.com/Christmas_cake-banner_Web_1583x426.jpg?tr=w-1280,dpr-1.5,q-70"
            alt="Nature 1"
            style={{ width: "100%", height: "350px", objectFit: "fill" }}
          />
        </SwiperSlide>

         

        <SwiperSlide>
          <img
            src="https://imgcdn.floweraura.com/banner_Web_1583x426_4.jpg?tr=w-1280,dpr-1.5,q-70"
            alt="Nature 2"
            style={{ width: "100%", height: "350px", objectFit: "cover" }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://imgcdn.floweraura.com/Christmas-banner_international_Web_1583x426.jpg?tr=w-1280,dpr-1.5,q-70"
            alt="Nature 3"
            style={{ width: "100%", height: "350px", objectFit: "cover" }}
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src="https://imgcdn.floweraura.com/chocolate-cake-landingpage-fa-desktop.jpg?tr=w-1280,dpr-1.5,q-70"
            alt="Nature 4"
            style={{ width: "100%", height: "350px", objectFit: "fill" }}
          />
        </SwiperSlide>
        {/* <SwiperSlide>
          <img
            src="https://imgcdn.floweraura.com/chocolate-cake-landingpage-fa-desktop.jpg?tr=w-1280,dpr-1.5,q-70"
            alt="Nature 5"
            style={{ width: "100%", height: "350px", objectFit: "fill" }}
          />
        </SwiperSlide> */}
      </Swiper>
      <div className="custom-swiper-pagination" style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}></div>
    </div>
  );
}
