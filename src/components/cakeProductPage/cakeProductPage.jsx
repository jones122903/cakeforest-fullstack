import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Heart, MapPin, Smile, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Import cake images
import redVelvetMain from '../../assets/images/cakes/red_velvet_main.png';
import chocolateCake from '../../assets/images/cakes/chocolate_cake.png';
import strawberryCake from '../../assets/images/cakes/strawberry_cake.png';
import birthdayCake from '../../assets/images/cakes/birthday_cake.png';
import blackforestCake from '../../assets/images/cakes/blackforest_cake.png';
import butterscotchCake from '../../assets/images/cakes/butterscotch_cake.png';
import pineappleCake from '../../assets/images/cakes/pineapple_cake.png';
import './cakeProductPage.css'

const CakeProductPage = () => {
  const navigate = useNavigate();
  const [selectedWeight, setSelectedWeight] = useState('0.5 Kg');
  const [selectedVariant, setSelectedVariant] = useState('Basic');
  const [nameOnCake, setNameOnCake] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);


  const weights = ['0.5 Kg', '1 Kg', '1.5 Kg', '2 Kg', '3 Kg'];

  const variants = [
    { name: 'Basic', price: 685, image: redVelvetMain },
    { name: 'For Anniversary', price: 775, image: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'For Birthday', price: 775, image: birthdayCake },
    { name: 'With Flower', price: 995, image: 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'With Mixed Fl...', price: 2195, image: 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=400' }
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
    redVelvetMain,
    chocolateCake,
    strawberryCake,
    birthdayCake,
    blackforestCake,
    butterscotchCake,
    pineappleCake
  ];



  const currentPrice = variants.find(v => v.name === selectedVariant)?.price || 685;

  const goToChapter = (id) => {
    navigate("/order", { state: { cakeId: id } });
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
                <img src={cakeImages[selectedImageIndex]} alt="Red Velvet Cake" />
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
                  Decadent Red Velvet Cake
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
                {weights.map((weight) => (
                  <button
                    key={weight}
                    className={`weight-btn ${selectedWeight === weight ? 'active' : ''}`}
                    onClick={() => setSelectedWeight(weight)}
                  >
                    {weight}
                  </button>
                ))}
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