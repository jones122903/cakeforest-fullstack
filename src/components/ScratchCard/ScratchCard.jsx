import React, { useRef, useEffect, useState } from "react";
import confetti from 'canvas-confetti';

const ScratchCard = ({ reward, onReveal, isScratched = false }) => {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(isScratched);

  useEffect(() => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Cover with Silver layer
    ctx.fillStyle = "#164e65ff";
    ctx.fillRect(0, 0, width, height);
    
    // Add text instructions
    ctx.fillStyle = "#ffffffff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Scratch Here!", width / 2, height / 2);

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
        
        // Trigger FULL SCREEN confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 10001, // Higher than modal (9999)
            colors: ['#FFD700', '#0e4d65', '#27ae60', '#f1c40f', '#ff0000']
        });

        if(onReveal) onReveal();
      }
    };

    const start = () => isDrawing = true;
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
    <div style={{ position: "relative", width: 280, height: 280, margin: "0 auto", borderRadius: 12, overflow: "visible", userSelect: "none" }}>
        {/* Reward Layer (Underneath) */}
        <div style={{ 
            position: "absolute", 
            inset:0, 
            background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)", 
            display: "flex", 
            flexDirection:"column", 
            alignItems:"center", 
            justifyContent:"center", 
            padding:20, 
            textAlign:"center",
            border: "4px solid #FFD700" 
        }}>
            <h4 style={{margin:0, color:"#555", fontSize:"18px"}}>CONGRATULATIONS!</h4>
            <h2 style={{color: "#0e4d65", fontSize: "32px", margin: "15px 0", fontWeight:"800"}}>{reward}</h2>
            <p style={{fontSize:13, color:"#777"}}>Reward applied to your account</p>
        </div>
        
        {/* Scratch Layer (Canvas) */}
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
                    cursor: "pointer" 
                }} 
            />
        )}
    </div>
  );
};

export default ScratchCard;