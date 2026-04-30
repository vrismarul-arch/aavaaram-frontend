import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Check, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  X,
  ThumbsUp,
  Shield,
  Truck,
  RefreshCw
} from "lucide-react";
import API from "../../services/api";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./ProductDetails.css";

// Fallback image constant
const FALLBACK_IMAGE = "/placeholder-image.png"; // Update with your actual placeholder path

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [tab, setTab] = useState("description");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageGallery, setImageGallery] = useState([]);

  // Helper function to get valid image URL
  const getImageUrl = (img) => {
    if (!img || img.trim() === "") return FALLBACK_IMAGE;
    return img;
  };

  // Compute display images (always have at least one)
  const displayImages = useMemo(() => {
    if (imageGallery.length > 0) return imageGallery;
    if (product?.image) return [product.image];
    if (product?.mainImage) return [product.mainImage];
    return [FALLBACK_IMAGE];
  }, [imageGallery, product]);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
      
      // FIX: Properly handle allImages from API response
      if (res.data.allImages && res.data.allImages.length > 0) {
        setImageGallery(res.data.allImages);
      } else if (res.data.image) {
        setImageGallery([res.data.image]);
      } else if (res.data.mainImage) {
        setImageGallery([res.data.mainImage]);
      } else {
        // Try to extract subImages if they exist
        const subImages = res.data.subImages || [];
        const mainImage = res.data.image || res.data.mainImage;
        if (mainImage) {
          setImageGallery([mainImage, ...subImages]);
        } else if (subImages.length > 0) {
          setImageGallery(subImages);
        } else {
          setImageGallery([]);
        }
      }

      if (res.data?.category?._id) {
        const relatedRes = await API.get(
          `/products/category/${res.data.category._id}`
        );
        setRelated(relatedRes.data.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.log("Error fetching product:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    try {
      await API.post(`/products/${id}/review`, {
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      });

      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
      fetchProduct();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, qty });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div 
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <motion.div 
        className="not-found"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="product-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ===== PRODUCT TOP SECTION ===== */}
      <div className="product-top">
        {/* IMAGE GALLERY */}
        <motion.div 
          className="product-image-sticky"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="image-gallery-container">
            {/* Thumbnail Strip */}
            {displayImages.length > 1 && (
              <div className="thumbnail-strip">
                {displayImages.map((img, index) => (
                  <motion.div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={getImageUrl(img)} 
                      alt={`${product.name} ${index + 1}`}
                      onError={handleImageError}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="main-image-container">
              <motion.img 
                key={selectedImage}
                src={getImageUrl(displayImages[selectedImage])}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onError={handleImageError}
              />

              {/* Image Navigation Buttons */}
              <div className="image-actions">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1))}
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedImage((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0))}
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE - PRODUCT INFO */}
        <motion.div 
          className="product-info-scroll"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp} className="product-badges">
            <span className="stock-badge">
              <Check size={14} />
              IN STOCK
            </span>
            {product.discount && (
              <span className="discount-badge">-{product.discount}%</span>
            )}
          </motion.div>

          <motion.h1 variants={fadeInUp}>{product.name}</motion.h1>
          
          {/* Rating */}
          <motion.div variants={fadeInUp} className="product-rating">
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={star <= Math.round(product.averageRating || 0) ? 'filled' : ''}
                />
              ))}
            </div>
            <span className="rating-text">
              {product.averageRating?.toFixed(1) || 0}/5
              <span className="review-count">({product.reviews?.length || 0} reviews)</span>
            </span>
          </motion.div>

          {/* Price */}
          <motion.div variants={fadeInUp} className="price-section">
            <p className="current-price">₹ {product.price}</p>
            {product.originalPrice && (
              <>
                <p className="original-price">₹ {product.originalPrice}</p>
                <span className="save-badge">
                  Save ₹ {product.originalPrice - product.price}
                </span>
              </>
            )}
          </motion.div>

          {/* Short Description */}
          {product.shortDescription && (
            <motion.p variants={fadeInUp} className="short-desc">
              {product.shortDescription}
            </motion.p>
          )}

          {/* Cart Row */}
          <motion.div variants={fadeInUp} className="cart-row">
            <div className="quantity-selector">
              <button 
                onClick={() => qty > 1 && setQty(qty - 1)}
                disabled={qty <= 1}
              >
                -
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>

            <motion.button
              className={`add-cart-btn ${addedToCart ? 'added' : ''}`}
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {addedToCart ? (
                <>
                  <Check size={20} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  ADD TO CART
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Action Buttons Row */}
          <motion.div variants={fadeInUp} className="action-row">
            <div className="share-container">
              <motion.button
                className="share-btn"
                onClick={() => setShowShareOptions(!showShareOptions)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={20} />
                Share
              </motion.button>
              
              <AnimatePresence>
                {showShareOptions && (
                  <motion.div 
                    className="share-options"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <button>Facebook</button>
                    <button>Twitter</button>
                    <button>WhatsApp</button>
                    <button>Copy Link</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Delivery Info */}
          <motion.div variants={fadeInUp} className="delivery-info">
            <div className="info-item">
              <Truck size={18} />
              <span>Free delivery on orders above ₹500</span>
            </div>
            <div className="info-item">
              <RefreshCw size={18} />
              <span>30-day easy returns</span>
            </div>
            <div className="info-item">
              <Shield size={18} />
              <span>1 year warranty</span>
            </div>
          </motion.div>

          {/* Category */}
          <motion.div variants={fadeInUp} className="meta">
            <p><strong>Category:</strong> {product.category?.name}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* TABS SECTION */}
      <motion.div 
        className="tabs-section"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="tabs">
          {['description', 'info', 'reviews'].map((tabName) => (
            <motion.button
              key={tabName}
              className={tab === tabName ? 'active' : ''}
              onClick={() => setTab(tabName)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
              {tabName === 'reviews' && (
                <span className="tab-count">{product.reviews?.length || 0}</span>
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={tab}
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "description" && (
              <div className="description-box">
                {product.description && (
                  <>
                    <h4>Product Description</h4>
                    <p>{product.description}</p>
                  </>
                )}
                {product.ingredients && (
                  <>
                    <h4>Ingredients</h4>
                    <p>{product.ingredients}</p>
                  </>
                )}
                {product.usage && (
                  <>
                    <h4>Recommended Usage</h4>
                    <p>{product.usage}</p>
                  </>
                )}
                {product.disclaimer && (
                  <>
                    <h4>Disclaimer</h4>
                    <p className="disclaimer-text">{product.disclaimer}</p>
                  </>
                )}
              </div>
            )}

            {tab === "info" && (
              <table className="info-table">
                <tbody>
                  {product.weight && (
                    <tr>
                      <td>Weight</td>
                      <td>{product.weight}</td>
                    </tr>
                  )}
                  {product.dimensions && (
                    <tr>
                      <td>Dimensions</td>
                      <td>{product.dimensions}</td>
                    </tr>
                  )}
                  {product.category && (
                    <tr>
                      <td>Category</td>
                      <td>{product.category?.name}</td>
                    </tr>
                  )}
                  <tr>
                    <td>Country of Origin</td>
                    <td>India</td>
                  </tr>
                  <tr>
                    <td>Warranty</td>
                    <td>1 Year</td>
                  </tr>
                  <tr>
                    <td>Delivery</td>
                    <td>Free (3-5 business days)</td>
                  </tr>
                </tbody>
              </table>
            )}

            {tab === "reviews" && (
              <div className="reviews-tab-content">
                {/* Reviews content from review-section */}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* FOUNDATION SECTION */}
      <motion.div 
        className="foundation-section"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="foundation-sub">Our foundation</p>
        <h2>Innovation meets integrity</h2>

        <div className="foundation-grid">
          {[
            { number: "No. 1", text: "Nutritionist Recommended Brand" },
            { number: "5 Million", text: "Satisfied Global Customers" },
            { number: "20+", text: "Clinical Studies" },
            { number: "100%", text: "Natural & Organic" },
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3>{item.number}</h3>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* REVIEW SECTION */}
      <motion.div 
        className="review-section"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="review-title">Customer Reviews</h2>

        <div className="review-summary">
          {/* Average Rating */}
          <motion.div 
            className="review-average-box"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="average-number">
              {product.averageRating?.toFixed(2) || "0.00"}
            </div>
            <div className="average-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={star <= Math.round(product.averageRating || 0) ? 'filled' : ''}
                />
              ))}
            </div>
            <p>Based on {product.reviews?.length || 0} reviews</p>
          </motion.div>

          {/* Rating Breakdown */}
          <div className="review-breakdown-box">
            {[5, 4, 3, 2, 1].map((star) => {
              const total = product.reviews?.length || 0;
              const count = product.reviews?.filter(r => r.rating === star).length || 0;
              const percent = total ? (count / total) * 100 : 0;

              return (
                <motion.div 
                  key={star} 
                  className="breakdown-row"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (5 - star) * 0.1 }}
                >
                  <span>{star} <Star size={12} className="star-icon" /></span>
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="rating-count">{count}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Write Review Button */}
          <motion.div 
            className="review-action"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              className="write-review-btn"
              onClick={() => document.getElementById("review-form").scrollIntoView({ 
                behavior: "smooth" 
              })}
            >
              Write A Review
            </button>
          </motion.div>
        </div>

        {/* Review Form */}
        <motion.div 
          className="review-form" 
          id="review-form"
          initial={{ height: 0, opacity: 0 }}
          whileInView={{ height: "auto", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3>Write Your Review</h3>
          
          <motion.input
            whileFocus={{ scale: 1.02 }}
            placeholder="Your name"
            value={reviewName}
            onChange={(e) => setReviewName(e.target.value)}
          />

          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={reviewRating}
            onChange={(e) => setReviewRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{n} Star</option>
            ))}
          </motion.select>

          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            placeholder="Write your review..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />

          <motion.button 
            onClick={submitReview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Review
          </motion.button>
        </motion.div>

        {/* Review List */}
        <div className="review-list">
          <AnimatePresence>
            {(product.reviews || []).map((r, index) => (
              <motion.div 
                key={index}
                className="review-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <div className="review-avatar">
                  {r.name?.charAt(0)}
                </div>
                <div className="review-content">
                  <div className="review-header-row">
                    <strong>{r.name}</strong>
                    <span className="verified-badge">
                      <Check size={12} />
                      Verified
                    </span>
                  </div>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= r.rating ? 'filled' : ''}
                      />
                    ))}
                  </div>
                  <p>{r.comment}</p>
                  <div className="review-helpful">
                    <button>
                      <ThumbsUp size={14} />
                      Helpful
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <motion.div 
          className="related-section"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>You might also like</h2>
          <div className="related-grid">
            {related.slice(0, 4).map((p, index) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}