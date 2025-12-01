import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import Carousel from "../components/carousel/carousel.jsx";
import CakePrice from "../components/cake_price/cakePrice.jsx";
import Category from "../components/categories/category.jsx";
import Cakeflovor from "../components/cakeFlovour/cakeflovour.jsx";
import CakeCategory from "../components/Cake_Choices/Cake_Choices.jsx";
import "../app/App.css"
import AllCake from "../components/allcake/allcake.jsx";
import Cakeforher from "../components/cakeforher/cakeforher.jsx";
import BlogSection from "../components/Blogs/Blogs.jsx";
import ReviewsSection from "../components/reviewsection/reviewsection.jsx";

import FlowerAuraNavbar from "../components/topbar/topbar.jsx";
import Footer from "../components/footer/footer.jsx";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="homeContainer" >
      {/* Admin Panel Access Button */}
      <motion.button
        onClick={() => navigate('/admin/dashboard')}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: '0 12px 32px rgba(102, 126, 234, 0.6)',
        }}
        whileTap={{ scale: 0.95 }}
        title="Admin Panel"
      >
        <Settings size={28} color="white" />
      </motion.button>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "60px" }}
      >
        <motion.h1
          className="animated-title"
          initial={{
            clipPath: "inset(0 100% 0 0)", // fully hidden from right side
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            clipPath: "inset(0 0% 0 0)", // reveal fully left → right
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        >
          CAKE FOREST
        </motion.h1>
      </div>
      <div>

        <div className="my-5">
          <FlowerAuraNavbar />
        </div>

        <div className="my-5">
          <Category />
        </div>
        <div className="my-5">
          <Carousel />
        </div>
        <div className="my-5">
          <Cakeflovor />
        </div>
      </div>
      <div className="my-5">
        <CakePrice />
      </div>
      <div className="my-5">
        <AllCake />
      </div>
      <div className="my-5">
        <CakeCategory />
      </div>
      <div className="my-5">
        <Cakeforher />
      </div>
      <div className="my-5">
         <BlogSection/>
      </div>
      <div>
        <ReviewsSection />
      </div>

      <div className="my-5">
        <Footer />
      </div>


    </div>
  );
}

export default Home;
