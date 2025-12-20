import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { Heart, MapPin, Smile, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// Import cake images
import redVelvetMain from '../../assets/images/cakes/red_velvet_main.png';
import chocolateCake from '../../assets/images/cakes/chocolate_cake.png';
import strawberryCake from '../../assets/images/cakes/strawberry_cake.png';
import birthdayCake from '../../assets/images/cakes/birthday_cake.png';
import blackforestCake from '../../assets/images/cakes/blackforest_cake.png';
import butterscotchCake from '../../assets/images/cakes/butterscotch_cake.png';
import pineappleCake from '../../assets/images/cakes/pineapple_cake.png';
import './cakeProductPage.css'

const CakeProductPage = ({ products }) => {
  const navigate = useNavigate();
  const [selectedWeight, setSelectedWeight] = useState('0.5 Kg');
  const [selectedVariant, setSelectedVariant] = useState('Basic');
  const [nameOnCake, setNameOnCake] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
 console.log("hhsadhjkashdfjasdhfjkashfjiahdsfjhsdjfhasjd",products)

  /* 
   * Weight Logic:
   * If products.weight matches one of our standard weights, we make that the only available one?
   * Or if products.weight is just a string "0.5", we might need to parse it.
   * Let's filter available based on product data if present.
   */
  const standardWeights = ['0.5 Kg', '1 Kg', '1.5 Kg', '2 Kg', '3 Kg'];
  // If product has a weight (e.g. "0.5"), we try to find it in our list or default to it.
  // Assuming the backend sends the *available* weight(s).
  // If it's a single string like "0.5", we treat that as the only available one.
  const availableWeight = products?.weight ? (products.weight.includes("Kg") ? products.weight : `${products.weight} Kg`) : '0.5 Kg';
  
  // Set initial weight to the available one
  useEffect(() => {
    if (products?.weight) {
        // Normalize: add " Kg" if missing
        const w = products.weight.toString().includes("Kg") || products.weight.toString().includes("kg") 
            ? products.weight 
            : `${products.weight} Kg`;
        setSelectedWeight(w);
    }
  }, [products]);

  const variants = [
    { name: 'Birthday caps', price: 70, image: 'https://m.media-amazon.com/images/I/617ZmT9mO0S._UL1500_.jpg' },
    { name: 'Snow Spray', price: 30, image: 'https://n3.sdlcdn.com/imgs/i/k/x/Snow-Spray-for-Party-Celebration-SDL724902112-1-f17c6.jpg' },
    { name: 'Fire Candle', price: 30, image: 'https://5.imimg.com/data5/XQ/DR/FS/SELLER-27345468/sparkling-fire-candle-for-birthday-12-cm-pack-of-6-candle-multicolor-pack-of-6--500x500.jpeg' },
    { name: 'Papper Out', price: 70, image: 'https://m.media-amazon.com/images/I/71cfQZ3NODL._AC_SL1200_.jpg' },
    { name: 'Combo', price: 150, image:'https://www.volonepal.com/wp-content/uploads/2020/07/Combo-8.jpg' },
  ];


  const addons = [
    {
      name: '6 Red Roses Bunch',
      price: 399,
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba'
    },
    {
      name: 'Large Teddy Bear (12")',
      price: 799,
      image: 'https://images.unsplash.com/photo-1600369671789-d23bdf75d4b3'
    },
    {
      name: '2 Layer Lucky Bamboo',
      price: 299,
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'
    },
    {
      name: '16 Ferrero Rocher',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1619158400600-2f2360a6e82f'
    }
  ];

  const cakeImages = [
    // If products has images, use them.
    ...(products?.images || [
    redVelvetMain,
    chocolateCake,
    strawberryCake,
    birthdayCake,
    blackforestCake,
    butterscotchCake,
    pineappleCake
    ])
  ];



  /* 
   * Mapping product images from props if available, otherwise using fallback/hardcoded.
   * ensuring we use the images from the DB for specific products.
   */
  const productImages = products?.images && products.images.length > 0 
    ? products.images 
    : [redVelvetMain, chocolateCake, strawberryCake, birthdayCake, blackforestCake, butterscotchCake, pineappleCake];

  // If we have a product price from props, use it. 
  // For now, we are keeping the variants logic but it might need adjustment if variants are specific to products.
  // Assuming the `products.price` is the base price.
  // Ideally, variants should come from the DB too. 
  // Since they are not in the provided JSON, we might want to be careful.
  // Let's rely on the hardcoded variants for "upgrades" but update the base logic if needed.
  // However, the user asked to "map the data".
  
  // Let's use the product price as the default current price if no variant is selected or if variants are not applicable.
  // But the UI selects a variant by default.
  // Let's make the variants selection update the price relative to the product price OR just use the product price if it's high priority.
  
  // SIMPLIFICATION:
  // The user provided data has a specific price (1995).
  // The hardcoded variants have prices like 685, 775.
  // If I load the Harry Potter cake, showing 685 (Red Velvet) is wrong.
  
  // Strategy: If `products` data is present, we prioritize it.
  
  const currentPrice = products?.price || (variants.find(v => v.name === selectedVariant)?.price || 685);
  
  // Helper to get current image
  const getCurrentImage = () => {
      if (products?.images?.length > 0) return products.images[selectedImageIndex];
      return cakeImages[selectedImageIndex];
  };

  const goToChapter = () => {
    if (!nameOnCake.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Required Field',
        text: 'Please enter the Name on Cake to proceed!',
        confirmButtonColor: '#ff4444'
      });
      return;
    }

    navigate("/order", {
      state: {
        product: {
          _id: products?._id,
          cakeName: products?.cakeName,
          image: productImages[selectedImageIndex] || productImages[0],
          price: currentPrice,
          weight: selectedWeight,
          variant: selectedVariant, 
          nameOnCake: nameOnCake,
          flavor: products?.flavor
        }
      }
    });
  };

  

  return (
    <div  >
 

      <div className="product-container">
        <div className="product-layout">
          {/* Image Section */}
          <div className="image-section">
            <div className="thumbnail-container">
              {cakeImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={img} alt={`Cake ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="main-image-container">
              <div className="main-image">
                <img src={cakeImages[selectedImageIndex]} alt={products?.cakeName || "Cake"} />
              </div>

              {/* <div className="stats-section">
                <div className="stat-box">
                  <Smile className="stat-icon" size={32} />
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>20+ Mn Smiles</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Delivered</div>
                </div>
                <div className="stat-box">
                  <MapPin className="stat-icon" size={32} />
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>20000+</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Pincodes Covered</div>
                </div>
                <div className="stat-box">
                  <Truck className="stat-icon" size={32} />
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>620+ Cities</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Same-day delivery</div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Details Section */}
          <div className="details-section">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <div className="eggless-badge mb-2">
                  <span style={{ color: '#4caf50' }}>●</span> EGGLESS
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginTop: '10px' }}>
                  {products.cakeName}
                </h2>
              </div>
              <Heart style={{ cursor: 'pointer' }} size={28} />
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="rating-badge">★ 4.9</span>
              <span style={{ color: '#666' }}>319 Reviews</span>
            </div>

            <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#ff4444' }}>
              ₹ {currentPrice}
            </h3>
            {/* Discount/Strike-through if needed, based on props? */}

            {/* Variants */}
            <div className="mt-4">
              <strong className="d-block mb-2">Make this gift extra special</strong>
              <div className="variants-grid">
                {variants.map((variant) => (
                  <div
                    key={variant.name}
                    className={`variant-card ${selectedVariant === variant.name ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(variant.name)}
                  >
                    <img src={variant.image} alt={variant.name} />
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                      {variant.name}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>₹ {variant.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weight Selection */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Weight</strong>
                <span style={{ color: '#0066cc', fontSize: '14px', cursor: 'pointer' }}>
                  Serving Info ⓘ
                </span>
              </div>
              <div className="weights-container">
                {standardWeights.map((weight) => {
                   // Check availability. For now, strict match with the product's single weight.
                   // If products.weight is "0.5", then "0.5 Kg" is available, others disabled.
                   const isAvailable = products?.weight 
                        ? (weight.toLowerCase().includes(products.weight.toString().toLowerCase())) 
                        : true;

                  return (
                    <button
                        key={weight}
                        className={`weight-btn ${selectedWeight === weight ? 'active' : ''} ${!isAvailable ? 'disabled-weight' : ''}`}
                        onClick={() => isAvailable && setSelectedWeight(weight)}
                        disabled={!isAvailable}
                        style={!isAvailable ? { opacity: 0.5, cursor: 'not-allowed', background: '#eee', borderColor: '#ddd' } : {}}
                    >
                        {weight}
                        {!isAvailable && <span style={{display: 'block', fontSize: '8px', color: 'red'}}>Out of Stock</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name on Cake */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Name on Cake</strong>
                <span style={{ fontSize: '12px', color: '#999' }}>
                  {nameOnCake.length} / 25
                </span>
              </div>
              <input
                type="text"
                className="name-input"
                placeholder="Write Name Here"
                required
                maxLength={25}
                value={nameOnCake}
                onChange={(e) => setNameOnCake(e.target.value)}
              />
            </div>

            {/* Addons */}
            <div className="mb-4">
              <strong className="d-block mb-3">Recommended Addon Products</strong>
              <div className="addons-grid">
                {addons.map((addon) => (
                  <div key={addon.name} className="addon-card">
                    <img src={addon.image} alt={addon.name} />
                    <div style={{ fontSize: '11px', marginBottom: '4px' }}>{addon.name}</div>
                    <div style={{ fontSize: '13px', fontWeight: '700' }}>₹ {addon.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="d-flex align-items-center gap-2 mb-3" style={{ background: '#f0f9ff', borderRadius: '6px', padding: '12px' }}>
              <Truck size={20} style={{ color: '#0066cc' }} />
              <span style={{ fontSize: '14px' }}>
                Get today! Order within <strong>8hr 31min</strong>
              </span>
            </div>

            {/* Buttons */}
            <div className="buttons-container">
              <button className="btn-cart w-100 w-md-50">GO TO CART</button>
              <button className="btn-buy w-100 w-md-50" onClick={goToChapter}>BUY NOW | ₹ {currentPrice}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakeProductPage;