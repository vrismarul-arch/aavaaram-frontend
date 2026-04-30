import { useCart } from "../../context/CartContext";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CartPage() {
  const {
    cart,
    increase,
    decrease,
    removeItem,
    total,
  } = useCart();

  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  
  // Calculate total savings (example: 10% discount on each item)
  const totalSavings = cart.reduce((acc, item) => {
    const productData = item.product || item;
    const productPrice = productData.price || item.price;
    const originalPrice = productData.originalPrice || productPrice * 1.1;
    const saving = (originalPrice - productPrice) * (item.qty || 1);
    return acc + (saving > 0 ? saving : 0);
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <div>
            <h1 className="cart-title">
              Shopping Cart
              <span className="cart-items-count">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            </h1>
          </div>
         
        </div>

        <div className="cart-layout">
          {/* LEFT - ITEMS SECTION */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <span>Product Details</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => {
                // Handle nested product data structure
                const productData = item.product || item;
                const productId = productData._id || item._id;
                const productName = productData.name || item.name;
                const productPrice = productData.price || item.price;
                const productImage = productData.image || item.image;
                const productBestSeller = productData.bestSeller || item.bestSeller;
                const productCategory = productData.category || item.category;
                const itemQty = item.qty || 1;
                
                // Calculate item total and savings
                const itemTotal = productPrice * itemQty;
                const originalPrice = productData.originalPrice || productPrice * 1.1;
                const itemSavings = (originalPrice - productPrice) * itemQty;

                return (
                  <div 
                    key={productId} 
                    className="cart-item"
                    onMouseEnter={() => setHoveredItem(productId)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="cart-item-content">
                      <div className="cart-item-image-wrapper">
                        {productImage && (
                          <img 
                            src={productImage} 
                            alt={productName} 
                            className="cart-item-image" 
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/100x100?text=Product";
                            }}
                          />
                        )}
                        {productBestSeller && (
                          <span className="best-seller-tag">⭐ Best Seller</span>
                        )}
                      </div>

                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{productName}</h4>
                        
                        <div className="cart-item-category">
                         
                          <span className="in-stock-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 6L9 17L4 12" />
                            </svg>
                            In Stock
                          </span>
                        </div>

                        <div className="cart-item-price-section">
                          <span className="current-price">₹{productPrice}</span>
                          {originalPrice > productPrice && (
                            <>
                              <span className="original-price">₹{originalPrice.toFixed(0)}</span>
                              <span className="discount-badge">
                                {Math.round(((originalPrice - productPrice) / originalPrice) * 100)}% off
                              </span>
                            </>
                          )}
                        </div>

                        <div className="cart-item-actions">
                          <div className="quantity-selector">
                            <button 
                              className={`qty-btn ${itemQty === 1 ? 'disabled' : ''}`}
                              onClick={() => decrease(productId)}
                              disabled={itemQty === 1}
                            >
                              -
                            </button>
                            <span className="qty-value">{itemQty}</span>
                            <button className="qty-btn" onClick={() => increase(productId)}>
                              +
                            </button>
                          </div>
                          <button
                            className="remove-item-btn"
                            onClick={() => removeItem(productId)}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-total">
                        <span className="total-price">₹{itemTotal}</span>
                        {itemSavings > 0 && (
                          <div className="saving-info">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            <span>Save ₹{itemSavings.toFixed(0)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="continue-shopping">
              <button className="continue-btn" onClick={() => navigate("/")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19L5 12L12 5" />
                </svg>
                Continue Shopping
              </button>
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className="order-summary-section">
            <div className="order-summary-card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span>₹{total}</span>
                </div>
                
                {totalSavings > 0 && (
                  <div className="summary-row savings-row">
                    <span>Total Savings</span>
                    <span>- ₹{totalSavings.toFixed(0)}</span>
                  </div>
                )}

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Total Amount</span>
                  <span className="total-amount">₹{total}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="tax-info">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="green">
                      <path d="M20 6L9 17L4 12" stroke="green" strokeWidth="2" />
                    </svg>
                    <span>You saved ₹{totalSavings.toFixed(0)} on this order</span>
                  </div>
                )}

                <div className="tax-info">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#4CAF50" />
                    <path d="M12 6v6l4 2" stroke="white" strokeWidth="1.5" />
                  </svg>
                  <span>Inclusive of all taxes</span>
                </div>
              </div>

              <button
                className="checkout-button"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12H19M12 5L19 12L12 19" />
                </svg>
              </button>

              <div className="secure-checkout-info">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L3 7L12 12L21 7L12 2Z" />
                  <path d="M3 12L12 17L21 12" />
                  <path d="M3 17L12 22L21 17" />
                </svg>
                <span>Secure Checkout • 100% Protected</span>
              </div>
            </div>

            <div className="payment-methods">
              <span>Secure payment with</span>
              <div className="payment-icons">
                <span>Visa</span>
                <span>Mastercard</span>
                <span>UPI</span>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}