import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FaHeart, FaStar } from "react-icons/fa";
import "./ProductCard.css";

export default function ProductCard({ product }) {

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const liked = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    addToCart(product);
  };

  return (

    <div
      className="glass-card"
      onClick={() => navigate(`/product/${product._id}`)}
    >

      {/* PRODUCT IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        className="product-img"
      />

      {/* WISHLIST */}
      {/* <FaHeart
        className={`wishlist-icon ${liked ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
      /> */}

      {/* PRODUCT INFO */}
      <div className="glass-info">

        {/* RATING */}
        <div className="rating-row">
          <FaStar className="star" />
          <span>{product.averageRating?.toFixed(1) || "4.8"}</span>
          {/* <small>({product.reviews?.length || 0})</small> */}
        </div>

        {/* TITLE */}
        <h3 className="product-title">
          {product.name}
        </h3>

        {/* PRICE */}
        <div className="price-row">
          <span className="new-price">₹{product.price}</span>
          <span className="old-price">₹{product.price + 100}</span>
                    <span className="save-badge">5% OFF</span>

        </div>

        {/* BUTTON */}
        <button
          className="cart-btn"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

      </div>

    </div>

  );
}
