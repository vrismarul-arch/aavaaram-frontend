import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import API from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ IMPORTANT
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const fetchProducts = async () => {
    try {
      const res = await API.get(`/products/category/${id}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="category-page">
      <h2 className="category-title">Category Products</h2>

      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p._id}>

            <div
              className={`wishlist-btn ${
                isInWishlist(p._id) ? "active" : ""
              }`}
              onClick={() => toggleWishlist(p)}
            >
              <FiHeart />
            </div>

            {/* ✅ IMAGE CLICK → DETAILS PAGE */}
            <img
              src={p.image}
              alt={p.name}
              className="product-image-click"
              onClick={() => navigate(`/product/${p._id}`)}
            />

            {/* ✅ TITLE CLICK → DETAILS PAGE */}
            <h3
              onClick={() => navigate(`/product/${p._id}`)}
              style={{ cursor: "pointer" }}
            >
              {p.name}
            </h3>

            <p className="price">₹ {p.price}</p>

            <button
              className="cart-btn"
              onClick={() => addToCart(p)}
            >
              Add To Cart
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}