import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FaHeart } from "react-icons/fa";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const liked = isInWishlist(product._id);

  return (
    <div className="modern-card">

      {/* IMAGE SECTION */}
      <div
        className="modern-img"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img src={product.image} alt={product.name} />

        {/* ❤️ HEART MOVED HERE */}
        <FaHeart
          className="wishlist-icon"
          onClick={(e) => {
            e.stopPropagation();   // prevent image click
            toggleWishlist(product);
          }}
          color={liked ? "red" : "#888"}
        />
      </div>

      {/* INFO SECTION */}
      <div className="modern-info">
        <h3>{product.name}</h3>
        <p className="price">₹ {product.price}</p>

        <div className="modern-actions">
          <button onClick={() => addToCart(product)}>
            Add To Cart
          </button>
        </div>
      </div>

    </div>
  );
}