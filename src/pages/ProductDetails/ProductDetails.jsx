import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [tab, setTab] = useState("description");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const res = await API.get(`/products/${id}`);
    setProduct(res.data);

    const relatedRes = await API.get(
      `/products/category/${res.data.category._id}`
    );

    setRelated(
      relatedRes.data.filter((p) => p._id !== id)
    );
  };

  if (!product) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div className="product-page">

      <div className="product-top">

        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info">
          <span className="stock">IN STOCK</span>

          <h1>{product.name}</h1>

          <p className="price">₹ {product.price}</p>

          <p className="short-desc">
            {product.description}
          </p>

          {/* QUANTITY + CART */}
          <div className="cart-row">

            <div className="qty-box">
              <button onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>

            <button
              className="add-cart-btn"
              onClick={() => addToCart({ ...product, qty })}
            >
              ADD TO CART
            </button>

          </div>

          {/* ✅ FIXED WISHLIST */}
          <div
            className={`wishlist ${isInWishlist(product._id) ? "active" : ""}`}
            onClick={() => toggleWishlist(product)}
          >
            {isInWishlist(product._id)
              ? "❤️ Added to wishlist"
              : "♡ Add to wishlist"}
          </div>

          <div className="meta">
            <p><strong>Category:</strong> {product.category?.name}</p>
          </div>
        </div>

      </div>

      {/* TABS */}
      <div className="tabs-section">

        <div className="tabs">
          <button
            className={tab === "description" ? "active" : ""}
            onClick={() => setTab("description")}
          >
            Description
          </button>

          <button
            className={tab === "info" ? "active" : ""}
            onClick={() => setTab("info")}
          >
            Additional Information
          </button>
        </div>

        <div className="tab-content">

          {tab === "description" && (
            <div className="description-box">

              <h4>Ingredients</h4>
              <p>{product.ingredients}</p>

              <h4>Recommended Usage</h4>
              <p>{product.usage}</p>

            </div>
          )}

          {tab === "info" && (
            <table className="info-table">
              <tbody>
                <tr>
                  <td>Weight</td>
                  <td>{product.weight}</td>
                </tr>
                <tr>
                  <td>Dimensions</td>
                  <td>{product.dimensions}</td>
                </tr>
              </tbody>
            </table>
          )}

        </div>

      </div>

      {/* RELATED */}
      <div className="related-section">
        <h2>Related products</h2>

        <div className="related-grid">
          {related.slice(0, 4).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>

    </div>
  );
}