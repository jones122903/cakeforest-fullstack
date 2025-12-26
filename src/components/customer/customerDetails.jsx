import React, { useState } from "react";
import styles from "./customerDetails.module.css";
import {
  User, Phone, Mail, MessageCircle, MapPin, Navigation, Building, Flag, CreditCard, CheckCircle, ShoppingBag, X, Calendar, Clock, Cake
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import { Popconfirm, Button } from "antd";
import CouponSection from "../../admin/pages/Coupons/CouponSection";
import ScratchCard from "../ScratchCard/ScratchCard";
import { showHotToast } from "../../admin/utils/showToast";

 const format = "hh:mm A"; // ✅ 12-hour format with AM/PM

const CustomerDetails = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    whatsapp: "",
    deliveryDate: new Date().toISOString().split("T")[0],
    deliveryTime:  "",
    wishesOnCake: "",
    flatNo: "",
    street: "",
    landmark: "",
    city: "",
    pincode: "",
    instructions: "",
    paymentMethod: "online",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { token, user } = useSelector((state) => state.auth);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [showScratchModal, setShowScratchModal] = useState(false);
  const [scratchCard, setScratchCard] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    if (!token) {
      Swal.fire({ icon: "warning", title: "Please Login", text: "You need to login first to place an order" });
      navigate("/");
    }
  }, [token, navigate]);

  const incomingOrderDetails = location.state?.orderDetails;
  const isCartOrder = Array.isArray(incomingOrderDetails?.items);

  const orderDetails = isCartOrder
  ? {
      // 🛒 CART ORDER
      items: incomingOrderDetails.items.map((item) => ({
        cakeName: item.productName,
        weight: item.weight,
        quantity: item.quantity,
        addons: item.addons || [],
        price: item.itemTotal,
      })),
      deliveryCharge: incomingOrderDetails.deliveryFee || 50,
      totalAmount: incomingOrderDetails.grandTotal,
    }
  : {
      // 🧁 SINGLE BUY NOW
      items: [
        {
          cakeName: incomingOrderDetails?.cakeName,
          weight: incomingOrderDetails?.weight,
          quantity: incomingOrderDetails?.quantity || 1,
          addons: incomingOrderDetails?.addons || [],
          price:
            incomingOrderDetails?.grandTotal ||
            incomingOrderDetails?.productTotal ||
            0,
        },
      ],
      deliveryCharge: 50,
      totalAmount:
        incomingOrderDetails?.grandTotal ||
        incomingOrderDetails?.productTotal ||
        0,
    };

    console.log(orderDetails,"orderdetail")
  
  
  // const orderDetails = {
  //   _id: incomingOrderDetails?._id,
  //   cakeName: incomingOrderDetails?.cakeName || "Red Velvet Bliss",
  //   cakePrice: incomingOrderDetails?.cakePrice || 0,
  //   variant: incomingOrderDetails?.variant || "Classic",
  //   weight: incomingOrderDetails?.weight || "1 kg",
  //   addons: incomingOrderDetails?.addons || [],
  //   price: incomingOrderDetails?.grandTotal || incomingOrderDetails?.productTotal || 0,
  //   deliveryCharge: 50,
  //   quantity: incomingOrderDetails?.quantity || 1,
  // };

 const subtotal = orderDetails.items.reduce(
  (sum, item) => sum + Number(item.price || 0),
  0
);

const discount = appliedCoupon
  ? Number(appliedCoupon.discountAmount || 0)
  : 0;

const totalAmount =
  subtotal + Number(orderDetails.deliveryCharge || 0) - discount;


  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = user?._id || user?.id;
      if (!userId) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/details/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.data.success && response.data.details) {
          setFormData({
            fullName: response.data.details.fullName || "",
            phone: response.data.details.phone || "",
            email: response.data.details.email || user.email || "",
            whatsapp: response.data.details.whatsapp || "",
            deliveryDate: response.data.details.deliveryDate || new Date().toISOString().split("T")[0],
            deliveryTime: response.data.details.deliveryTime || dayjs().format(format),
            wishesOnCake: response.data.details.wishesOnCake || "",
            flatNo: response.data.details.flatNo || "",
            street: response.data.details.street || "",
            landmark: response.data.details.landmark || "",
            city: response.data.details.city || "",
            pincode: response.data.details.pincode || "",
            instructions: response.data.details.instructions || "",
            paymentMethod: response.data.details.paymentMethod || "online",
          });
        }
      } catch (error) { console.log("New user"); }
    };
    fetchUserDetails();
  }, [user, token]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit number";
    if (!formData.deliveryDate.trim()) newErrors.deliveryDate = "Delivery Date is required";
    if (!formData.deliveryTime.trim()) newErrors.deliveryTime = "Delivery Time is required";
    if (!formData.flatNo.trim()) newErrors.flatNo = "Flat / Door No is required";
    if (!formData.street.trim()) newErrors.street = "Street Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }
    if (!formData.wishesOnCake.trim()) {
      newErrors.wishesOnCake = "Wishes is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const finishOrder = () => {
    setShowScratchModal(false);
    navigate("/");
  };

  const handleOrderPlacement = async (isPaid) => {
    try {
      const userId = user?._id || user?.id;

      const cartItemsPayload = isCartOrder
  ? orderDetails.items.map((item) => ({
      productId: item.productId || null,
      cakeName: item.cakeName,
      weight: item.weight,
      quantity: item.quantity,
      cakePrice: item.cakePrice || item.price,
      price: item.price,
      addons: item.addons || [],
      nameOnCake: formData.wishesOnCake,
    }))
  : [
      {
        productId: orderDetails._id,
        cakeName: orderDetails.cakeName,
        weight: orderDetails.weight,
        quantity: orderDetails.quantity,
        cakePrice: orderDetails.cakePrice,
        price: orderDetails.price,
        addons: orderDetails.addons || [],
        nameOnCake: formData.wishesOnCake,
      },
    ];

      
      // 1. Update/Save user profile details
      await axios.post(`${import.meta.env.VITE_API_URL}/details`, 
        { userId, ...formData }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Prepare Order Payload
      const orderPayload = {
        userId,
        cartItems: cartItemsPayload,
        deliveryDetails: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          whatsapp: formData.whatsapp,
          address: {
            flatNo: formData.flatNo,
            street: formData.street,
            landmark: formData.landmark,
            city: formData.city,
            pincode: formData.pincode,
          },
          instructions: formData.instructions,
        },
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        wishesOnCake: formData.wishesOnCake,
        paymentMethod: formData.paymentMethod,
        totalAmount: totalAmount,
        finalAmount: totalAmount,
        deliveryCharge: orderDetails.deliveryCharge,
        appliedCouponId: appliedCoupon ? appliedCoupon.coupon?._id || appliedCoupon._id : null,
        discountAmount: discount,
        isPaid: isPaid
      };

      // 3. Place Order
      const orderResponse = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, 
        orderPayload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (orderResponse.data.success) {
        const orderId = orderResponse.data.order?._id || orderResponse.data._id;

        showHotToast("success", "Order Placed Successfully! 🎉");

        // 4. Generate Scratch Card
        try {
          const scratchResponse = await axios.post(`${import.meta.env.VITE_API_URL}/scratchcards/generate`, {
            userId,
            orderId,
            totalAmount
          }, { headers: { Authorization: `Bearer ${token}` } });

          if (scratchResponse.data.success) {
            const card = scratchResponse.data.scratchCard;
            setScratchCard(card);
            setIsRevealed(card.status !== 'CREATED');
            setIsClaimed(card.status === 'CLAIMED');
            setShowScratchModal(true);
          } else {
            // No card generated, but order is success, so redirect
            finishOrder();
          }
        } catch (err) {
          console.error("Scratch card generation failed:", err.response?.data || err.message);
          // Redirect even if scratch card fails, it shouldn't block the order completion
          finishOrder();
        }
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      Swal.fire({ 
        icon: "error", 
        title: "Order Failed", 
        text: error.response?.data?.message || "Something went wrong while placing your order.", 
        confirmButtonColor: "#0e4d65" 
      });
    }
  };

  const handleClaim = async () => {
    if (!scratchCard?._id) return;
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/scratchcards/${scratchCard._id}/claim`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setIsClaimed(true);
        // Swal.fire({
        //   icon: "success",
        //   title: "Coupon Claimed!",
        //   text: "Your reward is now available for your next order.",
        //   timer: 2000,
        //   showConfirmButton: false
        // });
        showHotToast("success", "Coupon Claimed! Your reward is now available for your next order.");
        setTimeout(finishOrder, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to claim coupon");
    }
  };

  const payment = (num) => {
    if (num === " ") { alert("no value"); return; }

    const options = {
      key: "rzp_test_YOUR_KEY", // Replace with env variable in real app
      amount: num,
      currency: "INR",
      name: "CakeForest Shop",
      description: "Order Payment",
      handler: async function (response) {
        // Verify payment API call would go here
        // For now assuming success
        handleOrderPlacement(true);
      },
      prefill: { name: formData.fullName, email: formData.email, contact: formData.phone },
      theme: { color: "#0e4d65" },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (formData.paymentMethod === "online") {
        payment(totalAmount * 100);
      } else {
        handleOrderPlacement(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className={styles.container}>
      {/* Scratch Card Modal Overlay */}
      {showScratchModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)" }}>
            <div style={{ background: "white", padding: "30px", borderRadius: "20px", textAlign: "center", maxWidth: "400px", width: "90%", position:"relative", animation: "popIn 0.3s ease", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
                <button onClick={finishOrder} style={{position:"absolute", top:15, right:15, background:"#f5f5f5", border:"none", borderRadius:"50%", padding: 5, cursor:"pointer", display:"flex"}}><X size={20} color="#555" /></button>
                
                <h2 style={{color: "#0e4d65", marginBottom: 5, fontSize: "24px", fontWeight: "800"}}>YOU WON! 🎉</h2>
                <p style={{marginBottom: 20, color: "#666", fontSize: "14px"}}>You've unlocked a mystery reward!</p>
                
                <div style={{ position: "relative", zIndex: 10 }}>
                <ScratchCard 
                    reward={scratchCard?.rewardText} 
                    isScratched={scratchCard?.status !== 'CREATED'}
                    onReveal={() => {
                        setIsRevealed(true);
                        // Save reveal status only after 50% scratch is complete
                        if (scratchCard?.status === 'CREATED') {
                            axios.patch(`${import.meta.env.VITE_API_URL}/scratchcards/${scratchCard?._id}/reveal`, {}, {
                                headers: { Authorization: `Bearer ${token}` }
                            }).then(res => {
                                if (res.data.success) setScratchCard(res.data.card);
                            }).catch(console.error);
                        }
                    }} 
                />
                </div>

                {isRevealed && !isClaimed && !scratchCard?.rewardText?.toLowerCase().includes("luck") && (
                    <button onClick={handleClaim} style={{marginTop: 25, padding: "12px 30px", background: "#0e4d65", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "600", width: "100%", boxShadow: "0 4px 15px rgba(14, 77, 101, 0.3)"}}>
                        Claim Coupon
                    </button>
                )}

                {isClaimed && (
                   <button  style={{marginTop: 25, padding: "12px 30px", background: "#27ae60", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "600", width: "100%", boxShadow: "0 4px 15px rgba(14, 77, 101, 0.3)"}}>
                        ✓ Claimed Successfully!
                    </button>
                    // <div style={{marginTop: 20, color: "#27ae60", fontWeight: "700"}}>
                    //     ✓ Claimed Successfully!
                    // </div>
                )}
                
                {!isRevealed && (
                    <p style={{marginTop: 15, color: "#999", fontSize: "13px"}}>Scratch the card to reveal your reward!</p>
                )}

                <button onClick={finishOrder} style={{marginTop: 15, background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "14px", textDecoration: "underline"}}>
                    Skip for now
                </button>
            </div>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.checkoutHeaderContent}>
          <div className={styles.checkoutLogo}>
            <svg viewBox="0 0 500 80" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{ height: "50px", width: "auto" }}>
              <path d="M30 20 L40 35 L50 20 L40 28 L30 20 Z" fill="#244B64" />
              <path d="M22 28 L40 45 L58 28 L40 36 L22 28 Z" fill="#2C5F7C" />
              <path d="M15 36 L40 57 L65 36 L40 46 L15 36 Z" fill="#387C9D" />
              <text x="85" y="52" fill="#2C5F7C" fontSize="55" fontWeight="800" fontFamily="Poppins, sans-serif" letterSpacing="1px">Cake Forest</text>
            </svg>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.trustBadges}>
              <div className={styles.badgeItem}>
                <img src="https://bkassets.bakingo.com/bakingo-checkout-geo/static/media/payment.3d900b85.svg" alt="Payment" className={styles.badgeIcon} />
                <span className={styles.badgeText}>100% Payment <br /> Protection</span>
              </div>
              <div className={styles.badgeItem}>
                <img src="https://bkassets.bakingo.com/bakingo-checkout-geo/static/media/smiles.ba440372.svg" alt="Smiles" className={styles.badgeIcon} />
                <span className={styles.badgeText}>2 Million Smiles <br /> Delivered</span>
              </div>
              <a href="tel:8882553333" className={styles.badgeItem} style={{ textDecoration: "none" }}>
                <img src="https://bkassets.bakingo.com/bakingo-checkout-geo/static/media/need-assitance.dc31866a.svg" alt="Assistance" className={styles.badgeIcon} />
                <span className={styles.badgeText}>Need Assistance <br /> +91 8882553333</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <form onSubmit={handleSubmit}>
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                <User size={18} color="#0e4d65" />
                <span>Customer Information</span>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Full Name <span style={{ color: "#ff6161" }}>*</span></label>
                    <div className={styles.inputWrapper}>
                      <User size={16} className={styles.icon} />
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={styles.input} placeholder="Enter your full name" />
                    </div>
                    {errors.fullName && <p className={styles.errorMsg}>{errors.fullName}</p>}
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Email Address</label>
                    <div className={styles.inputWrapper}>
                      <Mail size={16} className={styles.icon} />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} placeholder="example@email.com" />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Delivery Number <span style={{ color: "#ff6161" }}>*</span></label>
                    <div className={styles.inputWrapper}>
                      <Phone size={16} className={styles.icon} />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} placeholder="10-digit mobile number" maxLength={10} />
                    </div>
                    {errors.phone && <p className={styles.errorMsg}>{errors.phone}</p>}
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>WhatsApp Number</label>
                    <div className={styles.inputWrapper}>
                      <MessageCircle size={16} className={styles.icon} />
                      <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={styles.input} placeholder="Optional" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Delivery Details Section */}
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                <Cake size={18} color="#0e4d65" />
                <span>Delivery Details</span>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Delivery Date <span style={{ color: "#ff6161" }}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <Calendar size={16} className={styles.icon} />
                      <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        className={styles.input}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    {errors.deliveryDate && <p className={styles.errorMsg}>{errors.deliveryDate}</p>}
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Delivery Time <span style={{ color: "#ff6161" }}>*</span>
                    </label>
                    <div className={styles.inputWrapper} style={{ border: 'none', padding: 0 }}>
                      

<TimePicker
  value={
    formData.deliveryTime
      ? dayjs(formData.deliveryTime, format)
      : null
  }
  format={format}
  use12Hours   // ✅ IMPORTANT
  onChange={(time, timeString) => {
    setFormData((prev) => ({
      ...prev,
      deliveryTime: timeString, // eg: "02:30 PM"
    }));
  }}
  className={styles.input}
  style={{
    width: "100%",
    height: "45px",
    borderRadius: "10px",
  }}
  allowClear={false}
/>
                    </div>
                    {errors.deliveryTime && <p className={styles.errorMsg}>{errors.deliveryTime}</p>}
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Wishes on the Cake</label>
                <div className={styles.inputWrapper}>
                  <Cake size={16} className={styles.icon} />
                  <input
                    type="text"
                    name="wishesOnCake"
                    value={formData.wishesOnCake}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g., Happy Birthday Sarah!"
                    maxLength={50}
                  />
                </div>
                {errors.wishesOnCake && <p className={styles.errorMsg}>{errors.wishesOnCake}</p>}
                <p className={styles.helperText}>
                  {formData.wishesOnCake.length}/50 characters
                </p>
              </div>
            </section>

            {/* 3. Delivery Address Section */}
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                <MapPin size={18} color="#0e4d65" />
                <span>Delivery Address</span>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Flat / Door No <span style={{ color: "#ff6161" }}>*</span></label>
                    <div className={styles.inputWrapper}>
                      <Building size={16} className={styles.icon} />
                      <input type="text" name="flatNo" value={formData.flatNo} onChange={handleChange} className={styles.input} placeholder="House/Flat No." />
                    </div>
                    {errors.flatNo && <p className={styles.errorMsg}>{errors.flatNo}</p>}
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Pincode <span style={{ color: "#ff6161" }}>*</span></label>
                    <div className={styles.inputWrapper}>
                      <Flag size={16} className={styles.icon} />
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={styles.input} placeholder="6-digit pincode" maxLength={6} />
                    </div>
                    {errors.pincode && <p className={styles.errorMsg}>{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Street Address <span style={{ color: "#ff6161" }}>*</span></label>
                <div className={styles.inputWrapper}>
                  <Navigation size={16} className={styles.icon} />
                  <input type="text" name="street" value={formData.street} onChange={handleChange} className={styles.input} placeholder="Street, Area, Colony" />
                </div>
                {errors.street && <p className={styles.errorMsg}>{errors.street}</p>}
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>City <span style={{ color: "#ff6161" }}>*</span></label>
                    <div className={styles.inputWrapper}>
                      <MapPin size={16} className={styles.icon} />
                      <input type="text" name="city" value={formData.city} onChange={handleChange} className={styles.input} placeholder="City/Town" />
                    </div>
                    {errors.city && <p className={styles.errorMsg}>{errors.city}</p>}
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Landmark</label>
                    <div className={styles.inputWrapper}>
                      <MapPin size={16} className={styles.icon} />
                      <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className={styles.input} placeholder="Nearby landmark" />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Delivery Instructions</label>
                <textarea name="instructions" value={formData.instructions} onChange={handleChange} className={`${styles.input} ${styles.textarea}`} placeholder="Any special delivery instructions..." style={{ paddingLeft: "12px" }} />
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                <CreditCard size={18} color="#0e4d65" />
                <span>Payment Method</span>
              </div>
 

              <label className={`${styles.paymentOption} ${formData.paymentMethod === "cod" ? styles.selected : ""}`}>
                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} className={styles.radio} />
                <span className={styles.paymentLabel}>Cash on Delivery</span>
                <CheckCircle size={18} color={formData.paymentMethod === "cod" ? "#0e4d65" : "#aaa"} />
              </label>
            </section>
          </form>
        </div>

        <div className={styles.sideSection}>
          <div className={styles.stickyOrderSummary}>
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                <ShoppingBag size={18} color="#0e4d65" />
                <span>Price Details</span>
              </div>

              <div>
       

                <div className={styles.orderCard}>
  {orderDetails.items.map((item, index) => (
    <div key={index} style={{ marginBottom: "12px" }}>
      
      <div className={styles.orderItem}>
        <span className={styles.orderLabel}>Cake Name</span>
        <span className={styles.orderValue}>{item.cakeName}</span>
      </div>

      <div className={styles.orderItem}>
        <span className={styles.orderLabel}>Weight</span>
        <span className={styles.orderValue}>{item.weight}</span>
      </div>

      <div className={styles.orderItem}>
        <span className={styles.orderLabel}>Quantity</span>
        <span className={styles.orderValue}>{item.quantity}</span>
      </div>

      <div className={styles.orderItem}>
        <span className={styles.orderLabel}>Add-ons</span>
        <span className={styles.orderValue}>
          {item.addons?.length || 0}
        </span>
      </div>

 <hr />
      <div className={styles.orderItem}>
        <span className={styles.orderLabel}>Item Price</span>
        <span className={styles.orderValue}>₹{item.price}</span>
      </div>

     
    </div>
  ))}

  {/* DELIVERY */}
  <div className={styles.orderItem}>
    <span className={styles.orderLabel}>Delivery Charges</span>
    <span className={styles.orderValue}>
      ₹{orderDetails.deliveryCharge}
    </span>
  </div>

  <CouponSection
    subtotal={subtotal}
    onCouponApplied={(data) => setAppliedCoupon(data)}
  />

  <div className={styles.totalRow}>
    <div className={styles.totalAmount}>
      <span>Total Amount</span>
      <span>₹{totalAmount}</span>
    </div>
  </div>
</div>


                 
              </div>
            </section>
          </div>
        </div>


      </div>

      <footer className={styles.footer}>
        

        <Popconfirm
                        description={ "Are you sure order this cake?"}
                        onConfirm={handleSubmit}
                        // onCancel={() => showToast("error", "Save cancelled")}
                        okText="Yes"
                        cancelText="No"
                        icon={null}
                        placement="top"
                        okButtonProps={{
                          style: {
                            backgroundColor: "#2C5F7C", // Dark Blue (your form icons color)
                            color: "white",
                            borderRadius: "6px",
                            padding: "4px 15px",
        
                            border: "none",
                          },
                        }}
                        descriptionProps={{
                          style: {
                            fontSize: "16px",
                          },
                        }}
                        cancelButtonProps={{
                          style: {
                            backgroundColor: "#e0e0e0",
                            color: "#444",
                            borderRadius: "6px",
                            padding: "4px 15px",
        
                            border: "none",
                          },
                        }}
                      >
                      <button type="button"  className={styles.submitBtn} disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
                      </Popconfirm>
      </footer>
    </div>
  );
};

export default CustomerDetails;
