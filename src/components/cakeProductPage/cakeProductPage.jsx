import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { Heart, MapPin, Smile, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import axios from "axios";
import { BiInfoCircle } from "react-icons/bi";
import redVelvetMain from "../../assets/images/cakes/red_velvet_main.png";
import chocolateCake from "../../assets/images/cakes/chocolate_cake.png";
import strawberryCake from "../../assets/images/cakes/strawberry_cake.png";
import birthdayCake from "../../assets/images/cakes/birthday_cake.png";
import blackforestCake from "../../assets/images/cakes/blackforest_cake.png";
import butterscotchCake from "../../assets/images/cakes/butterscotch_cake.png";
import pineappleCake from "../../assets/images/cakes/pineapple_cake.png";
import "./cakeProductPage.css";
import { showHotToast } from "../../admin/utils/showToast";

  const CakeProductPage = ({ products }) => {
  const navigate = useNavigate();
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [nameOnCake, setNameOnCake] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const standardWeights = ["0.5 Kg", "1 Kg", "1.5 Kg", "2 Kg", "2.5 Kg", "3 Kg"];
  const { token } = useSelector((state) => state.auth);

  // Normalize weights from backend (handle both array and string cases)
    //  const productAvailableWeights = Array.isArray(products?.weight) 
    // ? products.weight.map(w => w.toString().includes("Kg") ? w : `${w} Kg`)
    // : (products?.weight ? [products.weight.toString().includes("Kg") ? products.weight : `${products.weight} Kg`] : []);

  // Set initial weight to the first available one
  // useEffect(() => {
  //   if (productAvailableWeights.length > 0) {
  //     setSelectedWeight(productAvailableWeights[0]);
  //   }
  // }, [products]);

  const toggleVariant = (variant) => {
  setSelectedVariants((prev) => {
    const exists = prev.find(v => v.name === variant.name);

    if (exists) {
      
      return prev.filter(v => v.name !== variant.name);
    } else {
      // not selected → add
      return [...prev, variant];
    }
  });
};

// 🔢 Convert weight string to multiplier
const getWeightMultiplier = (weight) => {
  if (!weight) return 1;

  const kg = parseFloat(weight); // "1 Kg" → 1
  return kg / 0.5; // base is 0.5 Kg
};


// backend weight (example: "1.5")
const backendMinWeight = parseFloat(products?.weight || "0.5");

const isWeightDisabled = (weightLabel) => {
  const weightValue = parseFloat(weightLabel); // "1 Kg" → 1
  return weightValue < backendMinWeight;
};



const basePrice = products?.price || 500; // 0.5 Kg price

const weightMultiplier = getWeightMultiplier(selectedWeight);

const cakePriceByWeight = basePrice * weightMultiplier;

const currentPrice = cakePriceByWeight;

// ➕ Selected variants total price
const variantsTotal = selectedVariants.reduce(
  (sum, v) => sum + v.price,
  0
);
 

useEffect(() => {
  if (products?.weight) {
    setSelectedWeight(`${products.weight} Kg`);
  }
}, [products]);



  const variants = [
    {
      name: "Birthday caps",
      price: 70,
      image: "https://m.media-amazon.com/images/I/617ZmT9mO0S._UL1500_.jpg",
    },
    {
      name: "Snow Spray",
      price: 30,
      image:
        "https://n3.sdlcdn.com/imgs/i/k/x/Snow-Spray-for-Party-Celebration-SDL724902112-1-f17c6.jpg",
    },
    {
      name: "Fire Candle",
      price: 30,
      image:
        "https://5.imimg.com/data5/XQ/DR/FS/SELLER-27345468/sparkling-fire-candle-for-birthday-12-cm-pack-of-6-candle-multicolor-pack-of-6--500x500.jpeg",
    },
    {
      name: "Papper Out",
      price: 70,
      image: "https://m.media-amazon.com/images/I/71cfQZ3NODL._AC_SL1200_.jpg",
    },
    {
      name: "Combo",
      price: 150,
      image: "https://www.volonepal.com/wp-content/uploads/2020/07/Combo-8.jpg",
    },
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
      pineappleCake,
    ]),
  ];

  const productImages =
    products?.images && products.images.length > 0
      ? products.images
      : [
          redVelvetMain,
          chocolateCake,
          strawberryCake,
          birthdayCake,
          blackforestCake,
          butterscotchCake,
          pineappleCake,
        ];
 

  // Helper to get current image
  const getCurrentImage = () => {
    if (products?.images?.length > 0)
      return products.images[selectedImageIndex];
    return cakeImages[selectedImageIndex];
  };

  const goToChapter = () => {
    navigate("/order", {
      state: {
        product: {
          _id: products?._id,
          cakeName: products?.cakeName,
          image: productImages[selectedImageIndex] || productImages[0],
          price: currentPrice,
          weight: selectedWeight,
          variants: selectedVariants,
          flavor: products?.flavor,
        },
      },
    });
  };


  const fetchcartItems = async () => {
  if (!user || !token) return;
  setLoading(true);

  try { 

    const res = await axios.get(`${api_url}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("FULL RESPONSE:", res.data);

    if (res.data.success && res.data.cart) {
      console.log("ITEMS:", res.data.cart.items);
      setcartItems(res.data.cart.items || []);
    }
  } catch (err) {
    console.error("FETCH CART ERROR:", err);
  } finally {
    setLoading(false);
  }
};


  const handleAddToCart = async () => {
  if (!token) {
    showHotToast("success","Please login to add items to cart");
    navigate("/login");
    return;
  }

  const normalizeWeight = (weight) => {
  if (!weight) return "";
  return weight.replace(" Kg", ""); // "0.5 Kg" → "0.5"
};


  try {
    const cartPayload = {
      productId: products._id,
      quantity: 1,
       weight: normalizeWeight(selectedWeight),
       addons: selectedVariants.map((v) => ({
        name: v.name,
        price: v.price,
        quantity:v.quantity,
        total:v.price
      })),
     price: currentPrice +variantsTotal,
    };

     

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/cart`, // ✅ correct route
      cartPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,       // ✅ REQUIRED
          "Content-Type": "application/json",
        },
      }
    );

    
      showHotToast("success",res.data.message || "Cart added successful!")
       fetchcartItems() // or open cart drawer
   
  } catch (error) {
    console.error("Error adding to cart:", error);
    showHotToast("error",
      error.response?.data?.message || "Failed to add to cart"
    );
  }
};

  return (
    <div>
      <div className="product-container">
        <div className="product-layout">
          {/* Image Section */}
          <div className="image-section">
            <div className="thumbnail-container">
              {cakeImages.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${
                    selectedImageIndex === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={img} alt={`Cake ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="main-image-container">
              <div className="main-image">
                <img
                  src={cakeImages[selectedImageIndex]}
                  alt={products?.cakeName || "Cake"}
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="details-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    marginTop: "10px",
                  }}
                >
                  {products.cakeName}
                </h2>
              </div>
              <Heart style={{ cursor: "pointer" }} size={28} />
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="rating-badge">★ 4.9</span>
              <span style={{ color: "#666" }}>319 Reviews</span>
            </div>

            <h3
              style={{ fontSize: "32px", fontWeight: "700", color: "#ff4444" }}
            >
              ₹ {currentPrice}
            </h3>
            {/* Discount/Strike-through if needed, based on props? */}

            {/* Variants */}
            <div className="mt-4">
              <strong className="d-block mb-2">
                Make this gift extra special
              </strong>
             <div className="variants-grid">
  {variants.map((variant) => {
    const isSelected = selectedVariants.some(
      v => v.name === variant.name
    );

    return (
      <div
        key={variant.name}
        className={`variant-card ${isSelected ? "active" : ""}`}
        onClick={() => toggleVariant(variant)}
      >
        <img src={variant.image} alt={variant.name} />
        <div style={{ fontSize: "12px", fontWeight: "600" }}>
          {variant.name}
        </div>
        <div style={{ fontSize: "14px", fontWeight: "700" }}>
          ₹ {variant.price}
        </div>

        {/* {isSelected && (
          <div className="selected-badge">✓ Selected</div>
        )} */}
      </div>
    );
  })}
</div>

            </div>

            {/* Weight Selection */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Weight</strong>
                <span
                  style={{
                    color: "#0066cc",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Serving Info <BiInfoCircle size={20}/>
                </span>
              </div>

              <div className="weights-container">
  {standardWeights.map((weight) => {
    const disabled = isWeightDisabled(weight);

    return (
      <button
        key={weight}
        disabled={disabled}
        className={`weight-btn 
          ${selectedWeight === weight ? "active" : ""} 
          ${disabled ? "disabled" : ""}
        `}
        onClick={() => !disabled && setSelectedWeight(weight)}
      >
        {weight}
        
      </button>
    );
  })}
</div>


            </div>

            {/* Buttons */}
            <div className="buttons-container">
              <button className="btn-cart w-100 w-md-50" type="button" onClick={()=>handleAddToCart()} >GO TO CART</button>
              <button className="btn-buy w-100 w-md-50" onClick={goToChapter}>
                BUY NOW | ₹ {currentPrice+variantsTotal}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakeProductPage;
