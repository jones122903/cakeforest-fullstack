import React, { useState } from "react";
import styles from "./customerDetails.module.css";

import {
  User,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Navigation,
  Building,
  Flag,
  CreditCard,
  CheckCircle,
  ShoppingBag,
  AlignRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";
import CouponSection from "../../admin/pages/Coupons/CouponSection";

const CustomerDetails = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    whatsapp: "",
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
  // console.log("fklasdjfjklasjdfklasajdflkajsdkfjasdklfjkl",user._id)
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Please Login",
        text: "You need to login first to place an order",
      });
      navigate("/");
    }
  }, [token, navigate]);

  // Mock Order Data (would come from props/context in real app)
  /* Retrieving passed order details */
  const location = useLocation();
  const incomingOrderDetails = location.state?.orderDetails;

  const orderDetails = {
    _id: incomingOrderDetails?._id, // Capture ID
    cakeName: incomingOrderDetails?.cakeName || "Red Velvet Bliss",
    variant: incomingOrderDetails?.variant || "Heart Shape",
    weight: incomingOrderDetails?.weight || "1 kg",
    price: incomingOrderDetails?.price || 1200,
    nameOnCake: incomingOrderDetails?.nameOnCake || "Happy Birthday",
    deliveryDate: new Date().toISOString().split("T")[0], // Default to today
    deliveryTime: "Standard Delivery",
    deliveryCharge: 50,
    quantity: incomingOrderDetails?.quantity || 1,
  };

  const subtotal = (orderDetails?.price || 0) * (orderDetails?.quantity || 1);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = user?._id || user?.id;
      if (!userId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/details/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success && response.data.details) {
          // Pre-fill form with saved data
          setFormData({
            fullName: response.data.details.fullName || "",
            phone: response.data.details.phone || "",
            email: response.data.details.email || user.email || "",
            whatsapp: response.data.details.whatsapp || "",
            flatNo: response.data.details.flatNo || "",
            street: response.data.details.street || "",
            landmark: response.data.details.landmark || "",
            city: response.data.details.city || "",
            pincode: response.data.details.pincode || "",
            instructions: response.data.details.instructions || "",
            paymentMethod: response.data.details.paymentMethod || "online",
          });
        }
      } catch (error) {
        // Details இல்லனா empty form காட்டும் (first time user)
        console.log("No saved details found - New user");
      }
    };

    fetchUserDetails();
  }, [user, token]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit number";

    if (!formData.flatNo.trim())
      newErrors.flatNo = "Flat / Door No is required";
    if (!formData.street.trim())
      newErrors.street = "Street Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const payment = (num) => {
    if (num === " ") {
      alert("no value");
    } else {
      const options = {
        key: " ",
        amount: num,
        currency: "INN",
        name: "CakeForest Shop",
        description: "Order Payment",
        handler: async function (response) {
          const verify = await axios.post(
            "http://localhost:5000/api/payment/verify-payment",
            response
          );
          if (verify.data.success) {
            alert("Payment Successful!");
          } else {
            alert("Payment Failed!");
          }
        },
        prefill: {
          name: "Pravin",
          email: "pravinjoshua2@gmail.com",
          contact: "8870985683",
        },
        notes: {
          address: "releitect",
        },
        theme: {
          color: "#0e4d65",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const userId = user?._id || user?.id;

      // Step 1: Save user details
      await axios.post(
        `${import.meta.env.VITE_API_URL}/details`,
        {
          userId: userId,
          ...formData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 2: Place order
      const orderPayload = {
        userId: userId,
        cartItems: [
          {
            productId: orderDetails._id, // API might need this
            cakeName: orderDetails.cakeName,
            variant: orderDetails.variant,
            weight: orderDetails.weight,
            price: orderDetails.price,
            nameOnCake: orderDetails.nameOnCake,
            quantity: orderDetails.quantity,
          },
        ],
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
        deliveryDate: orderDetails.deliveryDate,
        deliveryTime: orderDetails.deliveryTime,
        paymentMethod: formData.paymentMethod,
        totalAmount: totalAmount,
        deliveryCharge: orderDetails.deliveryCharge,
      };

      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (orderResponse.data.success) {
        // Success message
        await Swal.fire({
          icon: "success",
          title: "Order Placed Successfully!",
          text: `Order ID: ${orderResponse.data.orderId}`,
          confirmButtonColor: "#0e4d65",
        });

        // Handle payment
        if (formData.paymentMethod === "online") {
          payment(totalAmount * 100); // Razorpay expects amount in paise
        } else {
          // COD - Navigate to order confirmation
          navigate("/"); // Or navigate to orders page
        }
      }
    } catch (error) {
      console.error("Order placement error:", error);

      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#0e4d65",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = subtotal + orderDetails.deliveryCharge - discount;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.checkoutHeaderContent}>
          {/* Logo Section - Matching Topbar Theme */}
          <div className={styles.checkoutLogo}>
            <svg
              viewBox="0 0 500 80"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "50px", width: "auto" }}
            >
              <path d="M30 20 L40 35 L50 20 L40 28 L30 20 Z" fill="#244B64" />
              <path d="M22 28 L40 45 L58 28 L40 36 L22 28 Z" fill="#2C5F7C" />
              <path d="M15 36 L40 57 L65 36 L40 46 L15 36 Z" fill="#387C9D" />

              <text
                x="85"
                y="52"
                fill="#2C5F7C"
                fontSize="55"
                fontWeight="800"
                fontFamily="Poppins, sans-serif"
                letterSpacing="1px"
                // width= "100px"
              >
                Cake Forest
              </text>
            </svg>
          </div>

          {/* Right Section - Trust Badges & Support */}
          <div className={styles.headerRight}>
            <div className={styles.trustBadges}>
              <div className={styles.badgeItem}>
                <img
                  src="https://bkassets.bakingo.com/bakingo-checkout-geo/static/media/payment.3d900b85.svg"
                  alt="Payment"
                  className={styles.badgeIcon}
                />
                <span className={styles.badgeText}>
                  100% Payment <br /> Protection
                </span>
              </div>
              <div className={styles.badgeItem}>
                <img
                  src="https://bkassets.bakingo.com/bakingo-checkout-geo/static/media/smiles.ba440372.svg"
                  alt="Smiles"
                  className={styles.badgeIcon}
                />
                <span className={styles.badgeText}>
                  2 Million Smiles <br /> Delivered
                </span>
              </div>
              <a
                href="tel:8882553333"
                className={styles.badgeItem}
                style={{ textDecoration: "none" }}
              >
                <img
                  src="https://bkassets.bakingo.com/bakingo-checkout-geo/static/media/need-assitance.dc31866a.svg"
                  alt="Assistance"
                  className={styles.badgeIcon}
                />
                <span className={styles.badgeText}>
                  Need Assistance <br /> +91 8882553333
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {/* Left Column - Form */}
        <div className={styles.mainSection}>
          <form onSubmit={handleSubmit}>
            {/* Customer Info Section */}
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                <User size={18} color="#0e4d65" />
                <span>Customer Information</span>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Full Name <span style={{ color: "#ff6161" }}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <User size={16} className={styles.icon} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && (
                  <p className={styles.errorMsg}>{errors.fullName}</p>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Delivery Number{" "}
                      <span style={{ color: "#ff6161" }}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <Phone size={16} className={styles.icon} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                    {errors.phone && (
                      <p className={styles.errorMsg}>{errors.phone}</p>
                    )}
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>WhatsApp Number</label>
                    <div className={styles.inputWrapper}>
                      <MessageCircle size={16} className={styles.icon} />
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.icon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </section>

            {/* Delivery Address Section */}
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                <MapPin size={18} color="#0e4d65" />
                <span>Delivery Address</span>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Flat / Door No <span style={{ color: "#ff6161" }}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <Building size={16} className={styles.icon} />
                      <input
                        type="text"
                        name="flatNo"
                        value={formData.flatNo}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="House/Flat No."
                      />
                    </div>
                    {errors.flatNo && (
                      <p className={styles.errorMsg}>{errors.flatNo}</p>
                    )}
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Pincode <span style={{ color: "#ff6161" }}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <Flag size={16} className={styles.icon} />
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                    </div>
                    {errors.pincode && (
                      <p className={styles.errorMsg}>{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Street Address <span style={{ color: "#ff6161" }}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Navigation size={16} className={styles.icon} />
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Street, Area, Colony"
                  />
                </div>
                {errors.street && (
                  <p className={styles.errorMsg}>{errors.street}</p>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      City <span style={{ color: "#ff6161" }}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <MapPin size={16} className={styles.icon} />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="City/Town"
                      />
                    </div>
                    {errors.city && (
                      <p className={styles.errorMsg}>{errors.city}</p>
                    )}
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Landmark</label>
                    <div className={styles.inputWrapper}>
                      <MapPin size={16} className={styles.icon} />
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Nearby landmark"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Delivery Instructions</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Any special delivery instructions..."
                  style={{ paddingLeft: "12px" }}
                />
              </div>
            </section>

            {/* Payment Options Section */}
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                <CreditCard size={18} color="#0e4d65" />
                <span>Payment Method</span>
              </div>

              <label
                className={`${styles.paymentOption} ${
                  formData.paymentMethod === "online" ? styles.selected : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === "online"}
                  onChange={handleChange}
                  className={styles.radio}
                />
                <span className={styles.paymentLabel}>
                  Pay Online (UPI / Card / NetBanking)
                </span>
                <CreditCard size={18} color="#67a6b1" />
              </label>

              <label
                className={`${styles.paymentOption} ${
                  formData.paymentMethod === "cod" ? styles.selected : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className={styles.radio}
                />
                <span className={styles.paymentLabel}>Cash on Delivery</span>
                <CheckCircle
                  size={18}
                  color={formData.paymentMethod === "cod" ? "#0e4d65" : "#aaa"}
                />
              </label>
            </section>
          </form>
        </div>

        {/* Right Column - Order Summary (Sticky on Desktop) */}
        <div className={styles.sideSection}>
          <div className={styles.stickyOrderSummary}>
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                <ShoppingBag size={18} color="#0e4d65" />
                <span>Price Details</span>
              </div>

              <div className={styles.orderCard}>
                <div className={styles.orderItem}>
                  <span className={styles.orderLabel}>Cake Name</span>
                  <span className={styles.orderValue}>
                    {orderDetails.cakeName}
                  </span>
                </div>
                <div className={styles.orderItem}>
                  <span className={styles.orderLabel}>Variant</span>
                  <span className={styles.orderValue}>
                    {orderDetails.variant}
                  </span>
                </div>
                <div className={styles.orderItem}>
                  <span className={styles.orderLabel}>Weight</span>
                  <span className={styles.orderValue}>
                    {orderDetails.weight}
                  </span>
                </div>
                <div className={styles.orderItem}>
                  <span className={styles.orderLabel}>Name on Cake</span>
                  <span className={styles.orderValue}>
                    {orderDetails.nameOnCake}
                  </span>
                </div>
                <div className={styles.orderItem}>
                  <span className={styles.orderLabel}>Delivery Date</span>
                  <span className={styles.orderValue}>
                    {orderDetails.deliveryDate}
                  </span>
                </div>
                <div className={styles.orderItem}>
                  <span className={styles.orderLabel}>Time Slot</span>
                  <span className={styles.orderValue}>
                    {orderDetails.deliveryTime}
                  </span>
                </div>

                <div className={styles.priceSummary}>
                  <div className={styles.orderItem}>
                    <span className={styles.orderLabel}>Price</span>
                    <span className={styles.orderValue}>
                      ₹{orderDetails.price}
                    </span>
                  </div>
                  <div className={styles.orderItem}>
                    <span className={styles.orderLabel}>Delivery Charges</span>
                    <span className={styles.orderValue}>
                      ₹{orderDetails.deliveryCharge}
                    </span>
                  </div>
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
            </section>
          </div>
        </div>
      </div>

      {/* Sticky Footer Button */}
      <footer className={styles.footer}>
        <button
          type="button"
          onClick={handleSubmit}
          className={styles.submitBtn}
          disabled={loading} // ← Add this
        >
          {loading ? "Placing Order..." : "Place Order"} {/* ← Update text */}
        </button>
      </footer>
    </div>
  );
};

export default CustomerDetails;
