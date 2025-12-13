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
import Topbar from "../components/topbar/topbar.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Buypage() {

   const { id } = useParams();
  const [cake, setCake] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect (() => {
    const fetchCake = async () => {

      try{
       const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${id}`
        );

        

        setCake(res.data.product);
        setLoading(false);
        
      }catch (error)  {
          console.log(error);
        setLoading(false);
      }

    }
    fetchCake();
  },[id])

   if (loading) return <h2>Loading...</h2>;
  return (

    <div>
      <div>
        <Topbar />
      </div>

    <div  className="homeContainer" >
       
       
        <div className="my-5">
           <CakeProductPage  products={cake}/>
        </div>

        <div>
          <Footer/>
        </div>
       
    </div>

      
    </div>
  );
}

export default Buypage;