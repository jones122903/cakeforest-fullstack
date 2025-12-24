import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./category.module.css";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const navigate = useNavigate()

  // 🔹 Your Cake List with Local Images
  const cakeCategories = [
    { id: 1, name: "All", image: "https://imgcdn.floweraura.com/be-mine-love-chocolate-cake-9749190ca-A.jpg?tr=w-315,dpr-1.5" },
    { id: 2, name: "Birthday", image: "https://imgcdn.floweraura.com/black-forest-birthday-drip-cake-9728120ca-A_1.jpg?tr=w-315,dpr-1.5" },
    { id: 3, name: "Designer", image: "https://imgcdn.floweraura.com/layers-of-love-red-velvet-fruit-cake-9751337ca-A.jpg?tr=w-315,dpr-1.5" },
    { id: 4, name: "Anniversary", image: "https://imgcdn.floweraura.com/photo-anniversary-red-cake-9831550ca-A_0.jpg?tr=w-315,dpr-1.5" },
    { id: 5, name: "Photo", image: "https://imgcdn.floweraura.com/iron-man-bday-poster-cake-9935580ca-aaaa.jpg?tr=w-315,dpr-1.5" },
    { id: 6, name: "Bento", image: "https://imgcdn.floweraura.com/bento4887flav-A_0.jpg?tr=w-315,dpr-1.5" },
  ];

  const gotoCakeAll = (categoryName) => {
  navigate("/gallery", {
    state: {
      selectedFilter: categoryName,
    },
  });
};

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
                onClick={()=>{gotoCakeAll(cake.name)}}
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

                <h5 className={styles.cakeTitle}>{cake.name} Cakes</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
