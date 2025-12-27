import React, { useEffect, useState } from "react";
import { Drawer, Empty, Spin } from "antd";
import { CloseOutlined, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "./cartDrawer.module.css";
import { useNavigate } from "react-router-dom";
import { showHotToast } from "../../../admin/utils/showToast";


const CartDrawer = ({ open, setOpen }) => {
  const [cartItems, setcartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const { user, token } = useSelector((state) => state.auth);
  const api_url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();


  const getAddonTotal = (addons = []) =>
    addons.reduce((sum, a) => sum + a.price, 0);

  const getItemTotal = (item) => {
    const cakeTotal = item.price * item.quantity;
    const addonsTotal = getAddonTotal(item.addons) * item.quantity;
    return cakeTotal + addonsTotal;
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
    
    const total = subtotal ;
    
    return { subtotal, total };
  };

  const increaseQty = (itemId) => {
    setcartItems((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (itemId) => {
    setcartItems((prev) =>
      prev.map((item) =>
        item._id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const fetchcartItems = async () => {
    if (!user || !token) return;
    setLoading(true);

    try {
      const res = await axios.get(`${api_url}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && res.data.cart) {
        setcartItems(res.data.cart.items || []);
      }
    } catch (err) {
      console.error("FETCH CART ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchcartItems();
  }, [open]);

  const confirmDelete = async (itemId) => {
    try {
      const res = await axios.delete(
        `${api_url}/cart/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setcartItems((prev) =>
          prev.filter((item) => item._id !== itemId)
        );
        toast.success("Item removed");
      }
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    toast.success("Proceeding to checkout...");
    // Add your checkout logic here
  };

  const { subtotal, total } = calculateTotals();

const handlePlaceOrder = () => {
  if (cartItems.length === 0) {
    showHotToast("Cart is empty");
    return;
  }

  const orderDetails = {
    items: cartItems.map((item) => {
      const addonsTotal = item.addons.reduce(
        (sum, a) => sum + a.price,
        0
      );

      return {
        // 🧁 Cake details
        productId: item.product._id,
        productName: item.product.cakeName,
        image: item.product.images?.[0],
        weight: item.weight,
        quantity: item.quantity,

        // 💰 Prices
        cakePrice: item.price, // already weight-applied
        addons: item.addons.map((a) => ({
          name: a.name,
          price: a.price,
          total:a.price,
          quantity:a.quantity
        })),
        addonsTotal,
        itemTotal:
          (item.price + addonsTotal) * item.quantity,
      };
    }),

    // 💵 Cart totals
    subtotal: cartItems.reduce(
      (sum, item) =>
        sum +
        (item.price +
          item.addons.reduce((s, a) => s + a.price, 0)) *
          item.quantity,
      0
    ),
 
  };

  orderDetails.grandTotal =
    orderDetails.subtotal;

  // 👉 Navigate to details page
  navigate("/details", {
    state: { orderDetails },
  });
};


  return (
    <Drawer
      placement="right"
      open={open}
      onClose={() => setOpen(false)}
      width={420}
      height="100vh"
      zIndex={10000}
      closable={false}
      bodyStyle={{
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ===== FIXED HEADER ===== */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10001,
        //   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        background:"#0B4B62",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ShoppingCartOutlined style={{ fontSize: "20px", color: "white" }} />
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 600,
              color: "white",
            }}
          >
            My Cart {cartItems.length > 0 && `(${cartItems.length})`}
          </h3>
        </div>

        <button
          onClick={() => setOpen(false)}
          style={{
            border: "none",
            background: "rgba(255,255,255,0.2)",
            cursor: "pointer",
            fontSize: "18px",
            color: "white",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
          onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
        >
          <CloseOutlined />
        </button>
      </div>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e0 #f7fafc",
        }}
      >
        <div
          className={styles.drawerContent}
          style={{
            padding: "20px",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", marginTop: 60 }}>
              <Spin size="large" />
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 60 }}>
              <Empty 
                description={
                  <span style={{ color: "#6b7280", fontSize: "15px" }}>
                    Your cart is empty
                  </span>
                }
              />
            </div>
          ) : (
            cartItems.map((item) => {
              const itemTotal = getItemTotal(item);
               

              return (
                <div 
                  key={item._id} 
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    border: "1px solid #f3f4f6",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"}
                  onMouseOut={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"}
                >
                  <div style={{ display: "flex", gap: "14px" }}>
                    {/* IMAGE */}
                    <div style={{ position: "relative" }}>
                      <img
                        src={item.product.images[0]}
                        alt={item.product.cakeName}
                        style={{
                          width: "85px",
                          height: "85px",
                          borderRadius: "10px",
                          objectFit: "cover",
                          border: "2px solid #f3f4f6",
                        }}
                      />
                    </div>

                    {/* DETAILS */}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: 0, 
                        fontSize: "15px", 
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "6px",
                      }}>
                        {item.product.cakeName}
                      </h4>

                      <p style={{ 
                        fontSize: "13px", 
                        color: "#6b7280",
                        margin: "0 0 8px 0",
                      }}>
                        Weight: <strong>{item.weight} kg</strong>
                      </p>

                      {/* ADDONS */}
                      {item.addons?.length > 0 && (
                        <div style={{ 
                          fontSize: "12px", 
                          color: "#555",
                          background: "#f9fafb",
                          padding: "8px",
                          borderRadius: "6px",
                          marginBottom: "10px",
                        }}>
                          {item.addons.map((a, i) => (
                            <div key={i} style={{ marginBottom: "2px" }}>
                              ➕ {a.name} – ₹{a.price}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* QUANTITY CONTROL */}
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "#f3f4f6",
                          borderRadius: "8px",
                          padding: "4px",
                        }}>
                          <button
                            onClick={() => decreaseQty(item._id)}
                            style={{
                              width: "28px",
                              height: "28px",
                              border: "none",
                              background: "white",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#667eea",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            −
                          </button>
                          <div style={{
                            minWidth: "32px",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: 600,
                          }}>
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => increaseQty(item._id)}
                            style={{
                              width: "28px",
                              height: "28px",
                              border: "none",
                              background: "white",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#667eea",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            +
                          </button>
                        </div>

                        <p style={{ 
                          margin: 0, 
                          fontWeight: 700,
                          fontSize: "16px",
                        //   color: "#667eea",
                          color:"#0B4B62",
                        }}>
                          ₹{itemTotal}
                        </p>
                      </div>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => confirmDelete(item._id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#ef4444",
                        fontSize: "18px",
                        cursor: "pointer",
                        padding: "4px",
                        height: "fit-content",
                      }}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ===== FIXED FOOTER ===== */}
      {cartItems.length > 0 && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 10001,
            background: "white",
            borderTop: "1px solid #e5e7eb",
            padding: "16px 20px",
            boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {/* PRICE BREAKDOWN */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "8px",
              fontSize: "14px",
              color: "#6b7280",
            }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {/* <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "8px",
              fontSize: "14px",
              color: "#6b7280",
            }}>
              <span> Delivery fee</span>
              <span>₹{tax.toFixed(2)}</span>
            </div> */}
            {/* <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "12px",
              fontSize: "14px",
              color: "#6b7280",
            }}>
              <span>Delivery</span>
              <span style={{ color: deliveryFee === 0 ? "#10b981" : "#6b7280" }}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div> */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              paddingTop: "12px",
              borderTop: "2px solid #e5e7eb",
              fontSize: "18px",
              fontWeight: 700,
              color: "#111827",
            }}>
              <span>Total</span>
              <span style={{ color: "#667eea" }}>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* CHECKOUT BUTTON */}
          <button
            onClick={handlePlaceOrder}
            style={{
              width: "100%",
              padding: "14px",
            //   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            background:"#0B4B62",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.5)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
            }}
          >
            <ShoppingCartOutlined style={{ fontSize: "18px" }} />
            Proceed to Checkout
          </button>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;