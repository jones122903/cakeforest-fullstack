import { Drawer, Input } from "antd";
import { CloseOutlined, SendOutlined } from "@ant-design/icons";
import { useS } from "use-s-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatDrawer = () => {

  const navigate = useNavigate();

  const [openChat, setOpenChat] = useS({
    value: false,
    key: "chat-open"
  });

  const initialMessages = [
    {
      type: "ai",
      text: "Hi! 👋 Welcome to our CakeForest! I'm here to help you find the perfect cake. What are you looking for today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];


  const [messages, setMessages] = useState(initialMessages);

  const [inputText, setInputText] = useState("");

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      type: "user",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    /* ADD thinking message */
    const thinkingMessage = {
      type: "ai",
      text: "wait panu macha soldra...",
      loading: true
    };

    setMessages(prev => [...prev, thinkingMessage]);

    try {

      const res = await axios.post("http://localhost:5000/api/chatbot", {
        input: userMessage.text
      });

      const data = res.data;

      let reply = data.message;

      /* replace thinking message */
      setMessages(prev =>
        prev.map(msg =>
          msg.loading
            ? {
              ...msg,
              text: reply,
              loading: false,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              orderLink: data.orderLink || null,  // Store orderLink from backend
              products: data.products || null      // Store products if needed
            }
            : msg
        )
      );

    } catch (err) {
      console.log(err);
      setMessages(prev =>
        prev.map(msg =>
          msg.loading
            ? {
              ...msg,
              text: "Sorry, something went wrong. Please try again.",
              loading: false,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            : msg
        )
      );

    }
  };





  return (
    <Drawer
      placement="right"
      open={openChat}
      onClose={() => { setOpenChat(false); setMessages(initialMessages); }}
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
          onClick={() => { setOpenChat(false); setMessages(initialMessages); }}
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
                  whiteSpace: "pre-line"
                }}
              >
                {msg.text.includes("BuyNow") && msg.orderLink ? (
                  <>
                    {msg.text.replace("BuyNow", "")}
                    <a
                      onClick={() => {
                        // Extract ID from orderLink or use products array
                        const cakeId = msg.products?.[0]?._id || msg.orderLink.split('/').pop();
                        navigate(`/buypage/${cakeId}`);
                        setOpenChat(false);
                        setMessages(initialMessages);
                      }}
                      style={{ color: "#1890ff", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                    >
                      BuyNow
                    </a>
                  </>
                ) : (
                  msg.text
                )}
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
        {/* <div
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
        </div> */}
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