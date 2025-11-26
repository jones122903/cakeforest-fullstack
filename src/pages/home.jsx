import React from "react";
import { motion } from "framer-motion";
import Carousel from "../components/carousel/carousel.jsx";
import CakePrice from "../components/cake_price/cakePrice.jsx";
import Category from "../components/categories/category.jsx";
import Cakeflovor from "../components/cakeFlovour/cakeflovour.jsx";
import CakeCategory from "../components/Cake_Choices/Cake_Choices.jsx";
import "../app/App.css"
import AllCake from "../components/allcake/allcake.jsx";
import Cakeforher from "../components/cakeforher/cakeforher.jsx";
import ReviewsSection from "../components/reviewsection/reviewsection.jsx";

function Home() {
  return (
    <div  className="homeContainer" >
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
        <CakePrice/>
      </div>
      <div className="my-5">
         <AllCake/>
      </div>
      <div className="my-5">
         <CakeCategory/>
      </div>
      <div className="my-5">
         <Cakeforher/>
      </div>
      <div className="my-5">
         <ReviewsSection/>
      </div>
    </div>
  );
}

export default Home;
