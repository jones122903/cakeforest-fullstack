import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Clock, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import Topbar from "../components/topbar/topbar";
import ScratchCard from "../components/ScratchCard/ScratchCard";
import toast from "react-hot-toast";

const RewardsPage = () => {
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
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Topbar />
        <h2>Please Login to see your rewards</h2>
      </div>
    );
  }

  return (
    <div style={{ background: "#fdf8f5", minHeight: "100vh" }}>
      <Topbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <header style={{ textAlign: "center", marginBottom: "30px" }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Gift size={60} color="#0e4d65" style={{ marginBottom: "15px" }} />
          </motion.div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#0e4d65", margin: 0 }}>My Rewards</h1>
          <p style={{ color: "#666", marginTop: "10px" }}>Scratch, Reveal & Claim your exclusive gifts!</p>
        </header>

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
            <div style={{ display: "flex", gap: "10px" }}>
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
          <div style={{ textAlign: "center", padding: "50px", background: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <AlertCircle size={48} color="#ccc" style={{ marginBottom: "15px" }} />
            <h3 style={{ color: "#888" }}>No Rewards Yet</h3>
            <p style={{ color: "#999" }}>Place an order to win exciting scratch cards!</p>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "30px" 
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
        padding: "25px",
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
          <button 
            disabled 
            style={{
              width: "100%",
              padding: "14px",
              background: "#0e4d65",
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
          </button>
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
