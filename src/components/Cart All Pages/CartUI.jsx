import React, { useState } from 'react';
import styles from './Cart.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderSummary = () => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const itemPrice = 595;
  const totalPrice = itemPrice * quantity;

  return (
    <div className={styles.container}>
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
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop" 
              alt="Chocolate Truffle Cake" 
              className={styles.productImage}
            />
            
            <div className={styles.productDetails}>
              <div className={styles.productHeader}>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>Chocolate Truffle Cake</h3>
                  <p className={styles.productPrice}>₹ {itemPrice}</p>
                  <p className={styles.productWeight}>Weight: 0.5 Kg</p>
                </div>
                <button className={styles.deleteButton}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>

              <div className={styles.productFooter}>
                <a href="#" className={styles.messageLink}>
                  <span>+ Write your message</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </a>

                <div className={styles.quantityControl}>
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
        </div>

        {/* Bill Summary Section */}
        <div className={styles.billSection}>
          <div className={styles.billHeader}>
            <h2 className={styles.billTitle}>Bill Summary</h2>
            <span className={styles.itemCount}>{quantity} Item</span>
          </div>

          <div className={styles.billDetails}>
            <div className={styles.billRow}>
              <span className={styles.billLabel}>
                <span className={styles.billIcon}>🧾</span>
                Order Total
              </span>
              <span className={styles.billAmount}>₹ {totalPrice}</span>
            </div>
          </div>

          <div className={styles.grandTotal}>
            <h3 className={styles.grandTotalLabel}>Grand Total</h3>
            <span className={styles.grandTotalAmount}>₹ {totalPrice}</span>
          </div>

          <button className={styles.placeOrderButton}>
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;