import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowRight,
  AlertCircle,
  Star,
  Eye,
  Check
} from "lucide-react";
import { useState } from "react";
import "./WishlistPage.css";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, loading, error, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(null);
  const [removing, setRemoving] = useState(null);

  const handleAddToCart = async (item) => {
    setAddingToCart(item._id);
    await addToCart(item);
    setTimeout(() => setAddingToCart(null), 1000);
  };

  const handleRemoveFromWishlist = async (productId) => {
    setRemoving(productId);
    await removeFromWishlist(productId);
    setRemoving(null);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      await clearWishlist();
    }
  };

  if (loading) {
    return (
      <div className="wishlist-loading">
        <div className="loading-spinner"></div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-error">
        <AlertCircle size={48} />
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <motion.div 
      className="wishlist-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="wishlist-container">
        {/* Header */}
        <div className="wishlist-header">
          <h1 className="wishlist-title">
            <Heart size={32} fill="#17422" stroke="#17422" />
            My Wishlist
          </h1>
          <p className="wishlist-subtitle">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            className="empty-wishlist"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Heart size={80} strokeWidth={1} />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist and come back to them later.</p>
            <motion.button 
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue Shopping
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="wishlist-grid">
              <AnimatePresence mode="popLayout">
                {wishlist.map((item, index) => (
                  <motion.div 
                    className="wishlist-card"
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    {/* Discount Badge */}
                    {item.discount && (
                      <span className="discount-badge">-{item.discount}%</span>
                    )}

                    {/* Product Image */}
                    <div className="card-image">
                      <img src={item.image} alt={item.name} />
                      <div className="image-overlay">
                        <button 
                          className="quick-view"
                          onClick={() => handleViewProduct(item._id)}
                        >
                          <Eye size={16} />
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="card-content">
                      <h3>{item.name}</h3>
                      <p className="category">{item.category?.name || "Premium Product"}</p>
                      
                      {/* Rating */}
                      <div className="rating">
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= Math.round(item.averageRating || 0) ? 'filled' : ''}
                            />
                          ))}
                        </div>
                        <span>({item.reviews?.length || 0})</span>
                      </div>

                      {/* Price */}
                      <div className="price-section">
                        <span className="current-price">₹{item.price}</span>
                        {item.originalPrice && (
                          <>
                            <span className="original-price">₹{item.originalPrice}</span>
                            <span className="saved">
                              Save ₹{item.originalPrice - item.price}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Stock Status */}
                     

                      {/* Action Buttons */}
                      <div className="card-actions">
                        <motion.button
                          className={`add-to-cart-btn ${addingToCart === item._id ? 'added' : ''}`}
                          onClick={() => handleAddToCart(item)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={item.stock === 0 || addingToCart === item._id}
                        >
                          {addingToCart === item._id ? (
                            <>
                              <Check size={16} />
                              Added!
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={16} />
                              Add to Cart
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          className={`remove-btn ${removing === item._id ? 'removing' : ''}`}
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={removing === item._id}
                        >
                          <Trash2 size={16} />
                          {removing === item._id ? 'Removing...' : 'Remove'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <div className="wishlist-footer">
              <button className="continue-shopping" onClick={() => navigate("/")}>
                Continue Shopping
              </button>
              {wishlist.length > 0 && (
                <button className="clear-all" onClick={handleClearAll}>
                  Clear All ({wishlist.length})
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}