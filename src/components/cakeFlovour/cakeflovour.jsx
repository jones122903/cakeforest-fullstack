import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './cakeflovour.module.css';
import { useNavigate } from 'react-router-dom';


const Cakeflovor = () => {

  const navigate = useNavigate()

  const [hoveredIndex, setHoveredIndex] = useState(null);


const gotoCakeAll = (categoryName) => {
  navigate("/gallery", {
    state: {
      selectedFilter: categoryName,
    },
  });
}

  // 🔹 Your Cake List with Local Images
  const cakeCategories = [
    { id: 4, name: "All", image: "https://bkmedia.bakingo.com/choco-vanilla-cake0006chva-AAA.jpg?tr=w-665,h-665,dpr-1.5&q=50" },
    { id: 2, name: "Birthday", image: "https://bkmedia.bakingo.com/black-forest-cake0001chbl-AAAA1.jpg?tr=w-665,h-665,dpr-1.5&q=50" },
    { id: 3, name: "Designer", image: "https://bkmedia.bakingo.com/pokemon-pikachu-theme-cake-them4989flav-A.jpg?tr=w-665,h-665,dpr-1.5&q=50" },
    { id: 1, name: "Anniversary", image: "https://imgcdn.floweraura.com/rosy-kiss-red-velvet-cake-9752700ca-AA.jpg?tr=w-315,dpr-1.5" },
    { id: 5, name: "Bento", image: "https://bkmedia.bakingo.com/older-wiser-hotter-bento-cake-bento5521-A_0.jpg?tr=w-665,h-665,dpr-1.5&q=50" },
    { id: 6, name: "Kids", image: "https://bkmedia.bakingo.com/little-panda-party-cake-them5464flav-A.JPG?tr=w-665,h-665,dpr-1.5&q=50" },
    { id: 7, name: "Fruits", image: "https://bkmedia.bakingo.com/fresh-fruit-cake0014frui-AAAA.jpg?tr=w-665,h-665,dpr-1.5&q=50" },
    { id: 8, name: "Phote", image: "https://bkmedia.bakingo.com/roblox-heroes-cake-phot4012flav-AA_0.jpg?tr=w-665,h-665,dpr-1.5&q=50" },
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
                onClick={()=>gotoCakeAll(cake.name)}
              >
                <div className={styles.imageWrapper}>
                  <img 
                    src={cake.image} 
                    alt={cake.name}
                    className={`${styles.cakeImage} ${hoveredIndex === index ? styles.zoomed : ''}`}
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

export default Cakeflovor;

