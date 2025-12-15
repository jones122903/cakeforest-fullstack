import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./category.module.css";

// 🔹 Import Local Images

import cake1 from "../../assets/category/cake1.avif";
import cake2 from "../../assets/category/cake2.avif";
import cake3 from "../../assets/category/cake3.avif";
import cake4 from "../../assets/category/cake4.avif";
import cake5 from "../../assets/category/cake5.avif";
import cake6 from "../../assets/category/cake6.avif";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const navigate = useNavigate()

  // 🔹 Your Cake List with Local Images
  const cakeCategories = [
    { id: 1, name: "All Cakes", image: "https://imgcdn.floweraura.com/be-mine-love-chocolate-cake-9749190ca-A.jpg?tr=w-315,dpr-1.5" },
    { id: 2, name: "Birthday Cakes", image: "https://imgcdn.floweraura.com/black-forest-birthday-drip-cake-9728120ca-A_1.jpg?tr=w-315,dpr-1.5" },
    { id: 3, name: "Designer Cakes", image: "https://imgcdn.floweraura.com/layers-of-love-red-velvet-fruit-cake-9751337ca-A.jpg?tr=w-315,dpr-1.5" },
    { id: 4, name: "Anniversary Cakes", image: "https://imgcdn.floweraura.com/photo-anniversary-red-cake-9831550ca-A_0.jpg?tr=w-315,dpr-1.5" },
    { id: 5, name: "Photo Cakes", image: "https://imgcdn.floweraura.com/iron-man-bday-poster-cake-9935580ca-aaaa.jpg?tr=w-315,dpr-1.5" },
    { id: 6, name: "Bento Cakes", image: "https://imgcdn.floweraura.com/bento4887flav-A_0.jpg?tr=w-315,dpr-1.5" },
  ];

  const gotoCakeALl =()=>{
     navigate("/gallery")
  }

  return (
    <div className={styles.cakeDeliveryContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>Online Cake Delivery</h1>
        <p className={styles.subtitle}>Baked Fresh, Delivered Fresh</p>
      </div>

      <div className="">
        <div className="row g-8 justify-content-center">
          {cakeCategories.map((cake, index) => (
            <div key={cake.id} className="col-lg-2 col-md-4 col-sm-6 col-6 my-2">
              <div
                className={styles.cakeCard}
                onClick={gotoCakeALl}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={cake.image}
                    alt={cake.name}
                    className={`${styles.cakeImage} ${
                      hoveredIndex === index ? styles.zoomed : ""
                    }`}
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

export default Category;
