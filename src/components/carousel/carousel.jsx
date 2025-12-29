import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";



export default function Carousel() {
const api_url = import.meta.env.VITE_API_URL;

  /* ================= FETCH BANNERS ================= */
  const fetchBanners = async () => {
    const res = await axios.get(`${api_url}/banner`);
    return res.data.data;
  };

  const {
    data: banners = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
  });
   
  console.log(banners,"b")

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
            src="https://imgcdn.floweraura.com/chocolate-cake-landingpage-fa-desktop.jpg?tr=w-1280,dpr-1.5,q-70"
            alt="Nature 4"
            style={{ width: "100%", height: "350px", objectFit: "fill" }}
          />
        </SwiperSlide>

        {banners.length >= 0 && banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <img
              src={banner.image}
              alt={banner.bannerName}
              style={{
                width: "100%",
                height: isMobile ? "250px" : "300px",
                objectFit: "cover",
              }}
              />
 </SwiperSlide>
        ))}
    
 
        
      </Swiper>
      <div className="custom-swiper-pagination" style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}></div>
    </div>
  );
}
