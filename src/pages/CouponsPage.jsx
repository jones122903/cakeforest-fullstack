import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Tag, Clock, Copy, CheckCircle } from "lucide-react";
import { MdCheck } from "react-icons/md";

import toast from "react-hot-toast";
import Topbar from "../components/topbar/topbar";
const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  // Replace with your actual backend URL
  //   const API_URL = 'http://localhost:5000/api/coupons';


  useEffect(() => {
    fetchCoupons();
  }, []);


  const fetchCoupons = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/active`
      );
      setCoupons(response.data);
    } catch (error) {
      console.error("Error fetching coupons", error);
    } finally {
      setLoading(false);
    }
  };


  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon ${code} Copied!`);
  };

  if (loading)
    return <div className="text-center p-5">Loading amazing offers...</div>;

  
  return (
    <>
    <Topbar/>
    <div
      style={{ minHeight: "80vh", padding: "40px 20px", background: "#f8f9fa" }}
    >

      
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#333" }}>
            Exclusive <span style={{ color: "#ff5e00" }}>Offers</span> For You
          </h1>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            Grab the best deals on our delicious cakes!
          </p>
        </motion.div>
        {/* Coupons Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "25px",
          }}
        >
          {coupons.map((coupon, index) => (
            <CouponCard
              key={coupon._id}
              coupon={coupon}
              index={index}
              onCopy={copyToClipboard}
            />
          ))}
        </div>
        {coupons.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
            style={{ 
              padding: "2rem 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa"
            }}
          >
             <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              style={{ marginBottom: "20px" }}
             >
                {/* Large Empty Icon */}
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "#f9be9cff" }}
                >
                  <path d="M21 5v14H3V5h18z" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M15 15h2" />
                  <path d="M7 15h2" />
                  <path d="M7 11h2" />
                  <path d="M15 11h2" />
                  <path d="M11 7v10" />
                </svg>
             </motion.div>
             
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#4a5568", marginBottom: "10px" }}>
              No Active Coupons Found
            </h2>
            <p style={{ color: "#718096", maxWidth: "400px", margin: "0 auto" }}>
              It seems all the cakes have been eaten! Check back later for fresh batches of discount codes.
            </p>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
};
// Individual Coupon Card Component
const CouponCard = ({ coupon, index, onCopy }) => {

  const [copied, setCopied] = useState(false);


  const handleCopy = () => {
  onCopy(coupon.code);
  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 3000);
};



  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      style={{
        background: "white",
        borderRadius: "15px",
        overflow: "hidden",
        border: "1px solid #eee",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Decoration */}
      <div
        style={{
          height: "6px",
          background: "linear-gradient(90deg, #ff5e00, #ff9068)",
          width: "100%",
        }}
      />
      <div style={{ padding: "20px", flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              background: "#fff0e6",
              color: "#ff5e00",
              padding: "5px 10px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Tag size={14} />{" "}
            {coupon.discountType === "PERCENTAGE"
              ? `${coupon.discountValue}% OFF`
              : `₹${coupon.discountValue} FLAT OFF`}
          </div>
        </div>
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            margin: "10px 0",
            color: "#2d3748",
          }}
        >
          {coupon.code}
        </h3>

        <p
          style={{ color: "#718096", fontSize: "0.9rem", marginBottom: "15px" }}
        >
          Get{" "}
          {coupon.discountType === "PERCENTAGE"
            ? `${coupon.discountValue}% discount`
            : `flat ₹${coupon.discountValue} off`}{" "}
          on orders above ₹{coupon.minOrderValue}.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#a0aec0",
            fontSize: "0.85rem",
          }}
        >
          <Clock size={14} /> Expires:{" "}
          {new Date(coupon.expiryDate).toLocaleDateString()}
        </div>
      </div>
      {/* Dashed Line Divider */}
      <div
        style={{
          borderTop: "2px dashed #e2e8f0",
          position: "relative",
          margin: "0 20px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "-26px",
            top: "-10px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#f8f9fa",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-26px",
            top: "-10px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#f8f9fa",
          }}
        />
      </div>
      {/* Action Footer */}
      <div style={{ padding: "20px" }}>
        <button
  onClick={handleCopy}
  disabled={copied}
  style={{
    width: "100%",
    padding: "12px",
    background: copied ? "#d1fae5" : "#edf2f7",
    color: copied ? "#065f46" : "#4a5568",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: copied ? "default" : "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.2s",
  }}
  onMouseOver={(e) => {
    if (!copied) e.currentTarget.style.background = "#e2e8f0";
  }}
  onMouseOut={(e) => {
    if (!copied) e.currentTarget.style.background = "#edf2f7";
  }}
>
  {copied ? (
    <>
      <CheckCircle size={16} /> COPIED
    </>
  ) : (
    <>
      <Copy size={16} /> COPY CODE
    </>
  )}
</button>

      </div>
    </motion.div>
  );
};
export default CouponsPage;
