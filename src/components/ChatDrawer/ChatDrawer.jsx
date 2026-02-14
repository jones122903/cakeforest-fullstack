import { Drawer, Input } from "antd";
import { CloseOutlined, SendOutlined } from "@ant-design/icons";
import { useS } from "use-s-react";
import { useState } from "react";

const ChatDrawer = () => {
  const [openChat, setOpenChat] = useS({
    value: false,
    key: "chat-open"
  });

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hi! 👋 Welcome to our CakeForest! I'm here to help you find the perfect cake. What are you looking for today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      type: "user",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInputText("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        type: "ai",
        text: getAIResponse(inputText),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Simple AI response logic (you can replace this with actual API call)
  const getAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("birthday") || input.includes("bday")) {
      return "🎂 Great choice! We have amazing birthday cakes. Would you like chocolate, vanilla, or strawberry flavor? We can also customize it with your favorite design!";
    } else if (input.includes("price") || input.includes("cost")) {
      return "💰 Our cakes start from ₹500 for basic designs. Premium cakes range from ₹1000-₹3000 depending on size and customization. What's your budget?";
    } else if (input.includes("delivery")) {
      return "🚚 We offer same-day delivery within city limits! Just place your order before 2 PM. Which area are you located in?";
    } else if (input.includes("chocolate")) {
      return "🍫 Chocolate lovers unite! We have Dark Chocolate Truffle, Chocolate Fudge, and our special Chocolate Overload cake. Which one sounds good?";
    } else if (input.includes("thank")) {
      return "You're welcome! 😊 Feel free to ask if you need anything else. Happy to help!";
    } else {
      return "I'd love to help you with that! 🎂 You can browse our collection by flavor, price, or occasion. Would you like me to recommend something specific?";
    }
  };

  return (
    <Drawer
      placement="right"
      open={openChat}
      onClose={() => setOpenChat(false)}
      width={420}
      height="100vh"
      zIndex={10000}
      closable={false}
      bodyStyle={{
        padding: 0,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #fef6f9 0%, #fff5f7 100%)",
      }}
    >
      {/* ===== FIXED HEADER ===== */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)",
          padding: "20px",
          borderBottom: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            🎂
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 700,
                color: "white",
              }}
            >
              Cake Assistant
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Online • Here to help
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenChat(false)}
          style={{
            background: "rgba(255,255,255,0.3)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            fontSize: "16px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.5)"}
          onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
        >
          <CloseOutlined />
        </button>
      </div>

      {/* ===== CHAT MESSAGES ===== */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          scrollbarWidth: "thin",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
              animation: "fadeIn 0.3s ease-in",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div
                style={{
                  background: msg.type === "user" 
                    ? "linear-gradient(135deg, rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)"
                    : "white",
                  color: msg.type === "user" ? "white" : "#333",
                  padding: "12px 16px",
                  borderRadius: msg.type === "user" 
                    ? "20px 20px 4px 20px"
                    : "20px 20px 20px 4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  wordWrap: "break-word",
                }}
              >
                {msg.text}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: "#999",
                  alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                  paddingLeft: msg.type === "user" ? "0" : "8px",
                  paddingRight: msg.type === "user" ? "8px" : "0",
                }}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== INPUT AREA ===== */}
      <div
        style={{
          padding: "16px",
          background: "white",
          borderTop: "1px solid #f0f0f0",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            background: "#f8f9fa",
            borderRadius: "25px",
            padding: "8px 16px",
            border: "2px solid transparent",
            transition: "all 0.3s",
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = "rgba(238, 174, 202, 0.5)"}
          onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
        >
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPressEnter={handleSend}
            placeholder="Ask about cakes, flavors, prices..."
            style={{
              border: "none",
              background: "transparent",
              fontSize: "14px",
              outline: "none",
            }}
            suffix={null}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            style={{
              background: inputText.trim() 
                ? "linear-gradient(135deg, rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)"
                : "#e0e0e0",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: inputText.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
              color: "white",
              fontSize: "16px",
            }}
          >
            <SendOutlined />
          </button>
        </div>
        
        {/* Quick Suggestions */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "12px",
            flexWrap: "wrap",
          }}
        >
          {["Birthday Cakes 🎂", "Prices 💰", "Delivery 🚚"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputText(suggestion)}
              style={{
                background: "white",
                border: "1px solid rgba(238, 174, 202, 0.3)",
                borderRadius: "16px",
                padding: "6px 12px",
                fontSize: "12px",
                cursor: "pointer",
                color: "#666",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(238, 174, 202, 0.1)";
                e.target.style.borderColor = "rgba(238, 174, 202, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
                e.target.style.borderColor = "rgba(238, 174, 202, 0.3)";
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Drawer>
  );
};

export default ChatDrawer;