import React, { useState } from "react";
import styles from "./Cart.module.css";
import "./Cartuialert.css";
import { HiDocumentCurrencyRupee } from "react-icons/hi2";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginModal from "./LoginModal";
import Topbar from "../topbar/topbar";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Minus, Trash2 } from "lucide-react";




const OrderSummary = () => {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Global style to ensure SweetAlert appears above Topbar
  const globalStyles = `
    .swal2-container {
      z-index: 9999999999 !important;
    }
    div:where(.swal2-container) {
      z-index: 9999999999 !important;
    }
  `;

  const navigate = useNavigate();
  const { state } = useLocation();
  const product = state?.product;
  console.log("product ",product.variants)
  const { token } = useSelector((state) => state.auth);

  


  const [addons, setAddons] = useState(
    product?.variants?.map((v) => ({ ...v, qty: 1 })) || []
  );

  // ➕ Increase
  const increaseQty = (index) => {
    const updated = [...addons];
    updated[index].qty += 1;
    setAddons(updated);
  };

  // ➖ Decrease
  const decreaseQty = (index) => {
    const updated = [...addons];
    if (updated[index].qty > 0) {
      updated[index].qty -= 1;
      setAddons(updated);
    }
  };

  // ✅ Selected addons only (qty > 0)



  // 🗑 Remove addon
  const removeAddon = (index) => {
    const updated = addons.filter((_, i) => i !== index);
    setAddons(updated);
  };

  const handlePlaceOrder = () => {
  if (token) {
    navigate("/details", {
      state: {
        orderDetails: {
          // 🧁 Product details
          productId: product._id,
          productName: product.cakeName,
          price: product.price,
          quantity,

          // ➕ Add-ons full details
          addons: selectedAddons.map((a) => ({
            addonId: a._id,
            name: a.name,
            price: a.price,
            qty: a.qty,
            total: a.price * a.qty,
          })),

          // 💰 Amounts
          productTotal: totalPrice,
          addonsTotal,
          grandTotal: finalTotal,
        },
      },
    });
  } else {
    setShowModal(true);
  }
};

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
    
    // Toast outside the setter to avoid double fire in Strict Mode
    toast.custom(
      (t) => (
        <div
          className={`re-bk-toast-wrapper ${
           t.visible ? "slide-in" : "slide-out"

          }`}
          style={{ zIndex: 99999999 }}
        >
          <div className="re-bk-toast">
            <img
              src="https://bkassets.bakingo.com/bakingo-ssr/static/media/check.adfc0424.svg"
              alt="check mark"
            />
            <span className="re-bk-text-toast">
              Quantity updated to {quantity + 1}
            </span>
          </div>

          {/* progress bar */}
          <div className="re-bk-progress" />
        </div>
      ),
      {
        duration: 2000,
        position: "top-right",
      }
    );
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);

      toast.custom(
        (t) => (
          <div
          
            className={`re-bk-toast-wrapper ${
             t.visible ? "slide-in" : "slide-out"

            }`}
            style={{ zIndex: 99999999, }}
          >
            <div className="re-bk-toast">
              <img
                src="https://bkassets.bakingo.com/bakingo-ssr/static/media/check.adfc0424.svg"
                alt="check mark"
              />
              <span className="re-bk-text-toast">
                Quantity updated to {quantity - 1}
              </span>
            </div>

            {/* progress bar */}
            <div className="re-bk-progress" />
          </div>
        ),
        {
          duration: 2000,
          position: "top-right",
          
          
        }
      );
    }
  };

  /* Using passed product price or fallback */
  const itemPrice = product?.price || 775;
  const totalPrice = itemPrice * quantity;

  const selectedAddons = addons.filter((a) => a.qty > 0);

// ✅ Addons total
const addonsTotal = selectedAddons.reduce(
  (sum, a) => sum + a.price * a.qty,
  0
);

// ✅ Final total
const finalTotal = totalPrice + addonsTotal;

  return (
    <div>
      <style>{globalStyles}</style>
      <Toaster
        containerStyle={{
          zIndex: 99999999,
          top: 80,
          right: 30
        }}
      />
      <Topbar />
      <div className={`${styles.container}  my-5`}>
        <div className={styles.mainLayout}>
          {/* Delivery Section */}
          <div className={styles.deliverySection}>
            <div className={styles.deliveryHeader}>
              <h2 className={styles.deliveryTitle}>Express Delivery</h2>
              <div className={styles.sameDayBadge}>
                <span className={styles.lightningIcon}>⚡</span>
                <span>Same Day</span>
              </div>
            </div>

            <div className={styles.productCard}>
              <img
                src={
                  product?.image ||
                  "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=200&h=200&fit=crop"
                }
                alt={product?.cakeName || "Cake"}
                className={styles.productImage}
              />

              <div className={styles.productDetails}>
                <div className={styles.productHeader}>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>
                      {product?.cakeName || "Red Velvet Crumb Birthday Cake"}
                    </h3>
                    <p className={styles.productPrice}>₹ {itemPrice}</p>
                    <p className={styles.productWeight}>
                      Weight: {product?.weight || "0.5 Kg"}
                    </p>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "Do you want to remove this item?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire(
                            "Deleted!",
                            "Your item has been removed.",
                            "success"
                          ).then(() => {
                            // Navigate to home logic
                            navigate("/");
                          });
                        }
                      });
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0b4b62"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>

                <div className={styles.productFooter}>
                  {/* <a href="#" className={styles.messageLink}>
                    <span>+ Write your message</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </a> */}

                  <div className={`${styles.quantityControl} ms-auto`}>
                    <button
                      className={styles.quantityButton}
                      onClick={handleDecrement}
                    >
                      −
                    </button>
                    <div className={styles.quantityDisplay}>{quantity}</div>
                    <button
                      className={styles.quantityButton}
                      onClick={handleIncrement}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

              <div className={`${styles.productCard2} mt-3`}>
      {addons.length > 0 && (
        <div className={styles.addonsSection}>
          <p className={styles.addonsTitle}>Add-ons</p>

          {addons.map((v, i) => (
            <div key={i} className={styles.addonItem}>
              <img src={v.image} alt={v.name} />

              <div className={styles.addonInfo}>
                <span className={styles.addonName}>{v.name}</span>
                <span className={styles.addonPrice}>₹ {v.price}</span>
              </div>

              <div className={styles.quantityControl}>
                    <button
                      className={styles.quantityButton}
                      onClick={()=>decreaseQty(i)}
                    >
                      −
                    </button>
                    <div className={styles.quantityDisplay}>{v.qty}</div>
                    <button
                      className={styles.quantityButton}
                      onClick={()=>increaseQty(i)}
                    >
                      +
                    </button>
                  </div>

              {/* <div className={styles.qtyControl}>
                <button onClick={() => decreaseQty(i)}>
                  <Minus size={16} />
                </button>

                <span>{v.qty}</span>

                <button onClick={() => increaseQty(i)}>
                  <Plus size={16} />
                </button>
              </div> */}

              <button
                    className={styles.deleteButton}
                     onClick={()=>removeAddon(i)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0b4b62"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
            </div>
          ))}
        </div>
      )}
    </div>


          

          </div>

          {/* Bill Summary Section */}
          <div className={styles.billSection}>
  <div className={styles.billHeader}>
    <h2 className={styles.billTitle}>Bill Summary</h2>
    <span className={styles.itemCount}>{quantity} Item</span>
  </div>

  {/* 🧾 Order Total */}
  <div className={styles.billDetails}>
    <div className={styles.billRow}>
      <span className={styles.billLabel}>
        <HiDocumentCurrencyRupee className={styles.billIcon} />
        Cake Price
      </span>
      <span className={styles.billAmount}>₹ {totalPrice}</span>
    </div>

    {/* ➕ Add-ons Section */}
    {selectedAddons.length > 0 && (
      <>
        <p className={styles.addonTitle}>Add-ons</p>

        {selectedAddons.map((addon, index) => (
          <div key={index} className={styles.billRow}>
            <span className={styles.billLabel}>
              {addon.name} × {addon.qty}
            </span>
            <span className={styles.billAmount}>
              ₹ {addon.price * addon.qty}
            </span>
          </div>
        ))}

        <div className={`${styles.billRow} ${styles.addonTotal}`}>
          <span className={styles.billLabel}>Add-ons Total</span>
          <span className={styles.billAmount}>₹ {addonsTotal}</span>
        </div>
      </>
    )}
  </div>

  {/* 💰 Grand Total */}
  <div className={styles.grandTotal}>
    <h3 className={styles.grandTotalLabel}>Grand Total</h3>
    <span className={styles.grandTotalAmount}>₹ {finalTotal}</span>
  </div>

  <button
    className={`btn-buy ${styles.placeOrderButton}`}
    onClick={handlePlaceOrder}
  >
    PLACE ORDER
  </button>
</div>


          {/* Login Modal */}
          <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
