import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartDrawer.css";
import { useState } from "react";

export default function CartDrawer() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    total,
    isOpen,
    closeCart,
  } = useCart();

  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!isOpen) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const shippingFee = total > 499 ? 0 : 40;
  const grandTotal = total + shippingFee;

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <div className="cart-drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-header-left">
            <h3 className="cart-drawer-title">Shopping Cart</h3>
            <span className="cart-drawer-item-count">
              ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button className="cart-drawer-close-btn" onClick={closeCart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-drawer-empty">
            <div className="cart-drawer-empty-icon">🛒</div>
            <p className="cart-drawer-empty-text">Your cart is empty</p>
            <button 
              className="cart-drawer-shop-btn"
              onClick={() => {
                closeCart();
                navigate("/");
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* FREE DELIVERY BANNER */}
            
            {/* ITEMS SECTION */}
            <div className="cart-drawer-items-list">
              {cart.map((item) => (
                <div 
                  key={item._id} 
                  className={`cart-drawer-item ${hoveredItem === item._id ? 'cart-drawer-item-hovered' : ''}`}
                  onMouseEnter={() => setHoveredItem(item._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="cart-drawer-item-image-wrapper">
                    <img 
                      src={item.product?.image || "/placeholder-image.jpg"} 
                      alt={item.product?.name || "Product"} 
                      className="cart-drawer-item-image"
                    />
                    {item.product?.bestSeller && (
                      <span className="cart-drawer-badge">Best Seller</span>
                    )}
                  </div>

                  <div className="cart-drawer-item-info">
                    <h4 className="cart-drawer-item-name">
                      {item.product?.name || "Product Name"}
                    </h4>
                    
                    <div className="cart-drawer-item-meta">
                      <span className="cart-drawer-instock">✓ In Stock</span>
                      <span className="cart-drawer-prime">
                        <svg width="40" height="14" viewBox="0 0 48 16" fill="none">
                          <rect width="48" height="16" fill="#00A8E1" rx="2"/>
                          <text x="8" y="12" fill="white" fontSize="10" fontWeight="bold">PRIME</text>
                        </svg>
                      </span>
                    </div>

                    <div className="cart-drawer-price-section">
                      <span className="cart-drawer-current-price">₹{item.product?.price}</span>
                      {item.product?.originalPrice && (
                        <>
                          <span className="cart-drawer-original-price">₹{item.product.originalPrice}</span>
                          <span className="cart-drawer-discount">
                            Save {Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>

                    <div className="cart-drawer-quantity-section">
                      <div className="cart-drawer-qty-controls">
                        <button 
                          className={`cart-drawer-qty-btn ${item.qty === 1 ? 'cart-drawer-qty-disabled' : ''}`}
                          onClick={() => decreaseQuantity(item.product?._id)}
                          disabled={item.qty === 1}
                        >
                          -
                        </button>
                        <span className="cart-drawer-qty-value">{item.qty}</span>
                        <button 
                          className="cart-drawer-qty-btn"
                          onClick={() => increaseQuantity(item.product?._id)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="cart-drawer-remove-btn"
                        onClick={() => removeItem(item.product?._id)}
                      >
                        Delete
                      </button>
                    </div>

                    <div className="cart-drawer-item-subtotal">
                      Subtotal: ₹ {(item.product?.price || 0) * item.qty}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="cart-drawer-summary">
              <div className="cart-drawer-summary-header">
                <h4 className="cart-drawer-summary-title">Order Summary</h4>
              </div>
              
              <div className="cart-drawer-summary-details">
                <div className="cart-drawer-summary-row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{total}</span>
                </div>
               
                <div className="cart-drawer-summary-divider"></div>
                <div className="cart-drawer-summary-row cart-drawer-summary-total">
                  <span>Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                className="cart-drawer-checkout-btn"
                onClick={() => {
                  closeCart();
                  navigate("/checkout");
                }}
              >
                Proceed to Buy ({totalItems} items)
              </button>

              <button
                className="cart-drawer-viewcart-btn"
                onClick={() => {
                  closeCart();
                  navigate("/cart");
                }}
              >
                View Full Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}