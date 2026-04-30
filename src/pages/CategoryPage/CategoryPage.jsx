  import { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import API from "../../services/api";
  import { useCart } from "../../context/CartContext";
  import "./CategoryPage.css";

  const isCombo = (product) => {
    const name = (product.name || "").toLowerCase();
    return name.includes("combo") || product.isCombo === true;
  };

  export default function CategoryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchProducts();
    }, [id]);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/category/${id}`);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const handleAddToCart = (product) => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      } else {
        addToCart(product);
      }
    };

    const comboProducts = products.filter(isCombo);
    const normalProducts = products.filter((p) => !isCombo(p));

    // If combo exists in this category → hide price & button on normal cards
    const hasCombo = comboProducts.length > 0;

    if (loading) {
      return (
        <div className="cp-page">
          <div className="cp-loading">Loading products...</div>
        </div>
      );
    }

    return (
      <div className="cp-page">
        <h2 className="cp-page-title">Category Products</h2>

        {/* ══════════════════════════════════════
            COMBO HERO — image | title + desc
            No price, No Add to Cart
        ══════════════════════════════════════ */}
      {comboProducts.map((p) => (
          <div className="combo-hero" key={p._id}>

            {/* LEFT 50% — image */}
            <div
              className="combo-left"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              <img src={p.image} alt={p.name} className="combo-hero-img" />
            </div>

            {/* RIGHT 50% — details */}
            <div className="combo-right">
              <span className="combo-badge">Combo Pack</span>

              <h2
                className="combo-name"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                {p.name}
              </h2>

              <p className="combo-price">₹ {p.price}</p>

              {p.description && (
                <p className="combo-desc">{p.description}</p>
              )}

              <button
                className="combo-cart-btn"
                onClick={() => handleAddToCart(p)}
              >
                🛒 &nbsp;Add To Cart
              </button>
            </div>
          </div>
        ))}

        {/* ══════════════════════════════════════
            NORMAL PRODUCT GRID

            hasCombo = true  → image + title only
            hasCombo = false → image + title + price + button
        ══════════════════════════════════════ */}
        {normalProducts.length > 0 && (
          <>
            {hasCombo && (
              <p className="cp-section-label">Included Products</p>
            )}
            <div className="cp-grid">
              {normalProducts.map((p) => (
                <div
                  className={`cp-card ${hasCombo ? "cp-card--slim" : ""}`}
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  {/* Image */}
                  <div className="cp-card-img-wrap">
                    <img src={p.image} alt={p.name} className="cp-card-img" />
                  </div>

                  {/* Title — always shown */}
                  <h3 className="cp-card-name">{p.name}</h3>

                  {/* Price + Button — only when NO combo in category */}
                  {!hasCombo && (
                    <>
                      <p className="cp-card-price">₹{p.price}</p>
                      <button
                        className="cp-card-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(p);
                        }}
                      >
                        Add to Cart
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {products.length === 0 && !loading && (
          <div className="cp-empty">No products found in this category.</div>
        )}
      </div>
    );
  }