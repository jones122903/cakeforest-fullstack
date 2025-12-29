import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Clock, CheckCircle, AlertCircle, Sparkles, User, ShoppingCart } from "lucide-react";
import Topbar from "../components/topbar/topbar";
import ScratchCard from "../components/ScratchCard/ScratchCard";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

const RewardsPage = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'expired'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest'
  const { user, token } = useSelector((state) => state.auth);
  const API_URL = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    if (user) {
      fetchUserRewards();
    }
  }, [user]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [cards, filter, sortBy]);

  const applyFiltersAndSort = () => {
    let filtered = [...cards];

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter(card => new Date(card.expiryDate) > new Date() && card.status !== 'EXPIRED');
    } else if (filter === 'expired') {
      filtered = filtered.filter(card => new Date(card.expiryDate) <= new Date() || card.status === 'EXPIRED');
    }

    // Apply sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredCards(filtered);
  };

  const fetchUserRewards = async () => {
    try {
      const userId = user?._id || user?.id;
      const response = await axios.get(`${API_URL}/scratchcards/user/${userId}?t=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCards(response.data.cards);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
      // toast.error("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = async (cardId) => {
    try {
      const response = await axios.patch(`${API_URL}/scratchcards/${cardId}/reveal`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.card) {
        // Update the cards state with the revealed card data (including rewardText)
        setCards(prevCards => prevCards.map(card => 
          card._id === cardId ? { ...card, ...response.data.card } : card
        ));
      }
    } catch (error) {
      console.error("Error marking as revealed:", error);
      toast.error("Failed to reveal reward. Please try again.");
    }
  };

  const handleClaim = async (cardId) => {
    try {
      const response = await axios.patch(`${API_URL}/scratchcards/${cardId}/claim`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success("Reward Claimed! It will be available at checkout.");
        fetchUserRewards(); // Refresh to show claimed status
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to claim reward");
    }
  };

  if (!user) {
    return (
      <div style={{ background: "#fdf8f5", minHeight: "100vh" }}>
        <Topbar />
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "60px 20px",
          textAlign: "center"
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "white",
              padding: "50px 30px",
              borderRadius: "30px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
              maxWidth: "500px",
              width: "100%",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Background Decoration */}
            <div style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "100px",
              height: "100px",
              background: "#0e4d6510",
              borderRadius: "50%",
              zIndex: 0
            }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                style={{ marginBottom: "30px" }}
              >
                <div style={{
                  width: "100px",
                  height: "100px",
                  background: "#0e4d65",
                  borderRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  boxShadow: "0 15px 30px rgba(14, 77, 101, 0.3)"
                }}>
                  <Gift size={50} color="white" />
                </div>
              </motion.div>

              <h2 style={{ 
                fontSize: "28px", 
                fontWeight: "800", 
                color: "#0e4d65",
                marginBottom: "15px"
              }}>
                Unlock Your Exclusive Rewards
              </h2>
              
              <p style={{ 
                color: "#666", 
                fontSize: "16px", 
                lineHeight: "1.6",
                marginBottom: "35px",
                padding: "0 10px"
              }}>
                Login to view your earned scratch cards, reveal surprise gifts, and claim exciting discounts on your favorite cakes!
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                style={{
                  padding: "16px 40px",
                  background: "#0e4d65",
                  color: "white",
                  border: "none",
                  borderRadius: "18px",
                  fontSize: "18px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  margin: "0 auto",
                  boxShadow: "0 10px 25px rgba(14, 77, 101, 0.2)"
                }}
              >
                <User size={20} />
                Login Now
              </motion.button>
              
              <div style={{ 
                marginTop: "25px", 
                display: "flex", 
                justifyContent: "center", 
                gap: "15px",
                opacity: 0.6
              }}>
                <Sparkles size={16} color="#0e4d65" />
                <Sparkles size={16} color="#0e4d65" />
                <Sparkles size={16} color="#0e4d65" />
              </div>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: "30px", color: "#888", fontSize: "14px" }}
          >
            New to Cake Forest? <span 
              onClick={() => navigate("/login")} 
              style={{ color: "#0e4d65", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
            >
              Join us today
            </span>
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fdf8f5", minHeight: "100vh" }}>
      <Topbar />
      
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 20px" }}>
        {cards.length > 0
        
        && (
        <header style={{ textAlign: "center", marginBottom: "30px" }}>
          <motion.div
                           animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
          >
            <Gift size={60} color="#0e4d65" style={{ marginBottom: "5px" }} />
          </motion.div>
         
          <h1 style={{ 
            fontSize: "clamp(1.8rem, 5vw, 2.5rem)", 
            fontWeight: "800", 
            color: "#0e4d65", 
            margin: 0 
          }}>My Rewards</h1>
          <p style={{ color: "#666", marginTop: "10px" }}>Scratch, Reveal & Claim your exclusive gifts!</p>
        </header>
       )}

        {/* Filters and Sort */}
        {!loading && cards.length > 0 && (
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "30px",
            gap: "15px",
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: "10px 20px",
                  border: filter === 'all' ? "2px solid #0e4d65" : "2px solid #ddd",
                  background: filter === 'all' ? "#0e4d65" : "white",
                  color: filter === 'all' ? "white" : "#666",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                All ({cards.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                style={{
                  padding: "10px 20px",
                  border: filter === 'active' ? "2px solid #48bb78" : "2px solid #ddd",
                  background: filter === 'active' ? "#48bb78" : "white",
                  color: filter === 'active' ? "white" : "#666",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('expired')}
                style={{
                  padding: "10px 20px",
                  border: filter === 'expired' ? "2px solid #e53e3e" : "2px solid #ddd",
                  background: filter === 'expired' ? "#e53e3e" : "white",
                  color: filter === 'expired' ? "white" : "#666",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Expired
              </button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "10px 15px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                background: "white"
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>Loading your rewards...</div>
        ) : filteredCards.length === 0 && filter !== 'all' ? (
          <div style={{ textAlign: "center", padding: "50px", background: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <AlertCircle size={48} color="#ccc" style={{ marginBottom: "15px" }} />
            <h3 style={{ color: "#888" }}>No {filter} rewards found</h3>
            <p style={{ color: "#999" }}>Try selecting a different filter</p>
          </div>
        ) : cards.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              textAlign: "center", 
              padding: "80px 20px", 
              background: "white", 
              borderRadius: "32px", 
              boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
              border: "1px solid #f0f0f0",
              maxWidth: "600px",
              margin: "40px auto"
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              style={{ 
                width: "120px",
                height: "120px",
                background: "#fdf8f5",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 30px"
              }}
            >
              <div style={{ position: "relative" }}>
                <Gift size={60} color="#0e4d65" strokeWidth={1.5} />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    color: "#0e4d65"
                  }}
                >
                  <Sparkles size={24} />
                </motion.div>
              </div>
            </motion.div>

            <h3 style={{ 
              fontSize: "24px", 
              fontWeight: "800", 
              color: "#0e4d65",
              marginBottom: "15px" 
            }}>Your Treasure Chest is Empty!</h3>
            
            <p style={{ 
              color: "#666", 
              fontSize: "16px", 
              maxWidth: "400px", 
              margin: "0 auto 35px",
              lineHeight: "1.6"
            }}>
              Don't miss out on the magic! Place your first order today and win guaranteed scratch cards with surprise rewards.
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(14, 77, 101, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              style={{
                padding: "16px 35px",
                background: "#0e4d65",
                color: "white",
                border: "none",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 8px 20px rgba(14, 77, 101, 0.2)"
              }}
            >
              <ShoppingCart size={18} />
              Start Shopping Now
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", 
            gap: "20px" 
          }}>
            <AnimatePresence>
              {filteredCards.map((card) => (
                <RewardCard 
                  key={card._id} 
                  card={card} 
                  onReveal={() => handleReveal(card._id)} 
                  onClaim={() => handleClaim(card._id)} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const RewardCard = ({ card, onReveal, onScratchStart, onClaim }) => {
  const isScratched = card.status === 'REVEALED' || card.status === 'CLAIMED';
  const [revealed, setRevealed] = useState(isScratched);

  useEffect(() => {
    setRevealed(isScratched);
  }, [isScratched]);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        background: "white",
        borderRadius: "24px",
        padding: "20px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
        textAlign: "center",
        border: "1px solid #eee",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {card.status === 'CLAIMED' && (
        <div style={{ 
          position: "absolute", 
          top: 15, 
          right: 15, 
          background: "#e6f8ef", 
          color: "#27ae60", 
          padding: "5px 12px", 
          borderRadius: "12px", 
          fontSize: "12px", 
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          zIndex: 10
        }}>
          <CheckCircle size={14} /> CLAIMED
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <ScratchCard 
          reward={card.rewardText} 
          isScratched={isScratched}
          onScratchStart={onScratchStart}
          onReveal={() => {
            setRevealed(true);
            onReveal();
          }} 
        />
      </div>

      <div style={{ padding: "0 10px" }}>
        {revealed && card.status !== 'CLAIMED' && !card.rewardText?.toLowerCase().includes("luck") && !card.rewardText?.toLowerCase().includes("next time") && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClaim}
            style={{
              width: "100%",
              padding: "14px",
              background: "#0e4d65",
              color: "white",
              border: "none",
              borderRadius: "15px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "16px",
              boxShadow: "0 8px 20px rgba(14, 77, 101, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <Sparkles size={18} /> Claim Coupon
          </motion.button>
        )}

        {!revealed && (
          <div style={{ color: "#999", fontSize: "14px", fontWeight: "600" }}>
            Scratch to reveal your gift!
          </div>
        )}

        {card.status === 'CLAIMED' && (
          <div 
            disabled 
            style={{
              width: "100%",
              padding: "14px",
              background: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "15px",
              fontWeight: "700",
              fontSize: "16px",
              boxShadow: "0 8px 20px rgba(39, 174, 96, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "default"
            }}
          >
            ✓ Claimed Successfully!
          </div>
        )}

        <div style={{ 
          marginTop: "15px", 
          paddingTop: "15px", 
          borderTop: "1px dashed #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          color: "#aaa",
          fontSize: "12px"
        }}>
          <Clock size={12} /> Valid until: {new Date(card.expiryDate).toLocaleDateString()}
        </div>
        {card.couponId?.minOrderValue > 0 && (
          <div style={{ marginTop: "8px", fontSize: "11px", color: "#e53e3e", fontWeight: "600" }}>
            Min Order required: ₹{card.couponId.minOrderValue}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RewardsPage;
