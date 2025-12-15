import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './cakeflovour.module.css';

// 🔹 Import Local Images

import cake1 from "../../assets/category/cake1.avif";
import cake2 from "../../assets/category/cake2.avif";
import cake3 from "../../assets/category/cake3.avif";
import cake4 from "../../assets/category/cake4.avif";
import cake5 from "../../assets/category/cake5.avif";
import cake6 from "../../assets/category/cake6.avif";
import { useNavigate } from 'react-router-dom';


const Cakeflovor = () => {

  const navigate = useNavigate()

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const gotoCakeALl =()=>{
     navigate("/gallery")
  }

  // 🔹 Your Cake List with Local Images
  const cakeCategories = [
    { id: 1, name: "All Cakes", image: "https://imgcdn.floweraura.com/rosy-kiss-red-velvet-cake-9752700ca-AA.jpg?tr=w-315,dpr-1.5" },
    { id: 2, name: "Birthday Cakes", image: "https://imgcdn.floweraura.com/love-you-more-red-velvet-cake-9748810ca-A_0.jpg?tr=w-315,dpr-1.5" },
    { id: 3, name: "Designer Cakes", image: "https://imgcdn.floweraura.com/eggless-velvety-cake-9911230ca-AA.jpg?tr=w-315,dpr-1.5" },
    { id: 4, name: "Anniversary Cakes", image: "https://imgcdn.floweraura.com/velvet-cake_b.jpg?tr=w-315,dpr-1.5" },
    { id: 5, name: "Photo Cakes", image: "https://imgcdn.floweraura.com/cherry-n-red-velvet-valentine-cake-9748800ca-A_0.jpg?tr=w-315,dpr-1.5" },
    { id: 6, name: "Bento Cakes", image: "https://imgcdn.floweraura.com/12_12.jpg?tr=w-315,dpr-1.5" },
    { id: 7, name: "Photo Cakes", image: "https://imgcdn.floweraura.com/red-velvet-valentine-cake-9827310ca-AA.jpg?tr=w-315,dpr-1.5" },
    { id: 8, name: "Bento Cakes", image: "https://imgcdn.floweraura.com/iron-man-bday-poster-cake-9935580ca-aaaa.jpg?tr=w-315,dpr-1.5" },
  ];

  return (
    <div className={`${styles.cakeDeliveryContainer} beige-color-bg`}>
      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>Cakes by Flavour </h1>
        <p className={styles.subtitle}>Order Your Favourite Cake Online</p>
      </div>

      <div className="">
        <div className="row g-8 justify-content-center">
          {cakeCategories.map((cake, index) => (
            <div key={cake.id} className="col-lg-3 col-md-4 col-sm-6 col-6 my-2">
              <div 
                className={styles.cakeCard}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={gotoCakeALl}
              >
                <div className={styles.imageWrapper}>
                  <img 
                    src={cake.image} 
                    alt={cake.name}
                    className={`${styles.cakeImage} ${hoveredIndex === index ? styles.zoomed : ''}`}
                  />
   
                 
                </div>

                <h5 className={styles.cakeTitle}>{cake.name}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cakeflovor;

