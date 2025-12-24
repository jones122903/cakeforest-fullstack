import React, { useRef, useEffect, useState } from "react";
import confetti from 'canvas-confetti';

const ScratchCard = ({ reward, onReveal, onScratchStart, isScratched = false }) => {
  const canvasRef = useRef(null);
  const isStartedRef = useRef(false);
  const [isRevealed, setIsRevealed] = useState(isScratched);

  // Sync internal state with prop
  useEffect(() => {
    if (isScratched) {
      setIsRevealed(true);
    }
  }, [isScratched]);

  useEffect(() => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Create metallic silver gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0e4d65');
    gradient.addColorStop(0.5, '#0e4d65');
    gradient.addColorStop(1, '#0e4d65');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add subtle shine effect
    const shineGradient = ctx.createLinearGradient(0, 0, width, 0);
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shineGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add text instructions with shadow
    ctx.fillStyle = "#ffffffff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText("Scratch Here!", width / 2, height / 2);
    ctx.shadowColor = "transparent";

    let isDrawing = false;

    const getBrushPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const scratch = (x, y) => {
      if (isRevealed) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();
      checkReveal();
    };

    const checkReveal = () => {
      if (isRevealed) return;
      
      const imageData = ctx.getImageData(0, 0, width, height);
      let scratchedPixels = 0;
      
      // Optimization: Check every 10th pixel to speed up
      for (let i = 0; i < imageData.data.length; i += 40) {
        if (imageData.data[i + 3] === 0) scratchedPixels++;
      }
      
      const totalPixelsToCheck = imageData.data.length / 40;
      
      if ((scratchedPixels / totalPixelsToCheck) * 100 > 40) {
        setIsRevealed(true);
        canvas.style.transition = "opacity 0.5s ease-out";
        canvas.style.opacity = 0; // Fade out the minimal scratch
        
        // Trigger ENHANCED confetti animation
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10001 };

        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          
          // Burst from left
          confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#FFD700', '#FFA500', '#FF6347', '#0e4d65', '#27ae60']
          }));
          
          // Burst from right
          confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#FFD700', '#FFA500', '#FF6347', '#0e4d65', '#27ae60']
          }));
        }, 250);

        if(onReveal) onReveal();
      }
    };

    const start = () => {
      isDrawing = true;
      if (!isStartedRef.current && onScratchStart) {
        onScratchStart();
        isStartedRef.current = true;
      }
    };
    const end = () => isDrawing = false;
    const move = (e) => { 
        if (isDrawing) {
            e.preventDefault(); // Prevent scrolling on touch
            const { x, y } = getBrushPos(e);
            scratch(x, y); 
        }
    };

    canvas.addEventListener("mousedown", start);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("mousemove", move);
    
    canvas.addEventListener("touchstart", start);
    canvas.addEventListener("touchend", end);
    canvas.addEventListener("touchmove", move);

    return () => {
      canvas.removeEventListener("mousedown", start);
      window.removeEventListener("mouseup", end);
      canvas.removeEventListener("mousemove", move);
      
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchend", end);
      canvas.removeEventListener("touchmove", move);
    };
  }, [isRevealed]);

  return (
    <div style={{ 
      position: "relative", 
      width: 280, 
      height: 280, 
      margin: "0 auto", 
      borderRadius: 16, 
      overflow: "visible", 
      userSelect: "none",
      filter: isRevealed ? "drop-shadow(0 10px 30px rgba(255, 215, 0, 0.3))" : "none",
      transition: "filter 0.5s ease"
    }}>
        {/* Reward Layer (Underneath) */}
        <div style={{ 
            position: "absolute", 
            inset: 0, 
            background: "linear-gradient(135deg, #fff5e6 0%, #fffbf0 50%, #fff5e6 100%)", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: 20, 
            textAlign: "center",
            border: reward && reward.toLowerCase().includes("luck") ? "4px solid #ccc" : "4px solid #FFD700",
            borderRadius: 16,
            boxShadow: reward && reward.toLowerCase().includes("luck") 
              ? "0 4px 15px rgba(0,0,0,0.1)" 
              : "0 8px 25px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.1)",
            animation: isRevealed && !reward?.toLowerCase().includes("luck") ? "goldPulse 2s infinite" : "none"
        }}>
            <style>{`
              @keyframes goldPulse {
                0%, 100% { box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.1); }
                50% { box-shadow: 0 8px 35px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2); }
              }
            `}</style>
            <h4 style={{
              margin: 0, 
              color: reward && reward.toLowerCase().includes("luck") ? "#999" : "#d4af37", 
              fontSize: "16px",
              fontWeight: "800",
              letterSpacing: "1px"
            }}>
              {reward && reward.toLowerCase().includes("luck") ? "OH NO!" : "🎉 WINNER! 🎉"}
            </h4>
            <h2 style={{
              color: reward && reward.toLowerCase().includes("luck") ? "#666" : "#0e4d65", 
              fontSize: reward && reward.toLowerCase().includes("luck") ? "24px" : "28px", 
              margin: "15px 0", 
              fontWeight: "800",
              textShadow: reward && reward.toLowerCase().includes("luck") ? "none" : "2px 2px 4px rgba(0,0,0,0.1)"
            }}>
              {reward}
            </h2>
            <p style={{
              fontSize: 12, 
              color: reward && reward.toLowerCase().includes("luck") ? "#999" : "#48bb78",
              fontWeight: "600"
            }}>
              {reward && reward.toLowerCase().includes("luck") 
                ? "Try again on your next order!" 
                : "Reward applied to your account"}
            </p>
        </div>
        
        {!isRevealed && (
            <canvas 
                ref={canvasRef} 
                width={280} 
                height={280} 
                style={{ 
                    position: "absolute", 
                    top: 0, 
                    left: 0, 
                    zIndex: 2,
                    cursor: "pointer",
                    borderRadius: 16
                }} 
            />
        )}
    </div>
  );
};

export default ScratchCard;