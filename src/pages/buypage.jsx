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
import FlowerAuraNavbar from "../components/topbar/topbar.jsx";
import Footer from "../components/footer/footer.jsx";
import CakeProductPage from "../components/cakeProductPage/cakeProductPage.jsx";

function Buypage() {
  return (
    <div  className="homeContainer" >
      
      <div>
        <div className="my-5">
           <CakeProductPage/>
        </div>
      </div>

      
    </div>
  );
}

export default Buypage;