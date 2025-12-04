import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Cake_Choices/Cake_Choices.module.css';
import cake1 from "../../assets/category/cakes-with-flowers_3.avif"
import cake2 from "../../assets/category/kids-cakes_2.avif"
import cake3 from "../../assets/category/pinata-cakes_2.avif";
import cake4 from "../../assets/category/pull-me-pp-cakes_2.avif";
import cake5 from "../../assets/category/bento-cakes_7.avif";
import cake6 from "../../assets/category/desserts_8.avif";
import { useNavigate } from 'react-router-dom';


const CakeCategory = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const navigate = useNavigate()

  const gotoCakeALl =()=>{
     navigate("/gallery")
  }

  // 🔹 Your Cake List with Local Images
  const cakeCategories = [
    { id: 1, name: "Cake Combos", image: cake1 },
    { id: 2, name: "Kids Cakes", image: cake2 },
    { id: 3, name: "Pinata Cakes", image: cake3 },
    { id: 4, name: "Pull Me UP Cakes", image: cake4 },
    { id: 5, name: "Bento Cakes", image: cake5 },
    { id: 6, name: "Desserts", image: cake6 },
  ];

  return (
    <div className={styles.cakeDeliveryContainer}>
      <div className={styles.headerSection}>
        <h4 className="fw-bold">Choose Cake of Your Choice</h4>
        <p className="text-secondary">Confection Made To Perfection!</p>
      </div>

      <div className="">
        <div className="row g-8 justify-content-center">
          {cakeCategories.map((cake, index) => (
            <div key={cake.id} className="col-lg-2 col-md-4 col-sm-6 col-6">
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

                <h5 className="fs-6 fw-medium">{cake.name}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CakeCategory;
