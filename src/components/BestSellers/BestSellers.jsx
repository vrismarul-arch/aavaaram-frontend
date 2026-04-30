import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import API from "../../services/api";
import ProductCard from "../../components/ProductCard";
import "./BestSellers.css";

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [itemWidth, setItemWidth] = useState(0);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const best = res.data.filter((p) => p.bestSeller === true);
        setProducts(best);
      })
      .catch((err) => console.log(err));
  }, []);

  // Calculate item width dynamically based on wrapper size
  useEffect(() => {
    const updateWidth = () => {
      if (wrapperRef.current) {
        const wrapperWidth = wrapperRef.current.offsetWidth;
        const gap = 24;
        const cols = window.innerWidth <= 480 ? 1
                   : window.innerWidth <= 768 ? 2
                   : window.innerWidth <= 1024 ? 3
                   : 4;
        setItemWidth((wrapperWidth - gap * (cols - 1)) / cols + gap);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const getVisibleCols = () => {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 1024) return 3;
    return 4;
  };

  const handlePrev = () => {
    if (isAnimating || currentIndex === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => Math.max(0, prev - getVisibleCols()));
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleNext = () => {
    const cols = getVisibleCols();
    if (isAnimating || currentIndex + cols >= products.length) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => Math.min(products.length - cols, prev + cols));
    setTimeout(() => setIsAnimating(false), 400);
  };

  const cols = getVisibleCols();

  return (
    <section className="bs2-section">
      <div className="bs2-header">
        <h2 className="bs2-title">Enerj<sup>+</sup> Choices</h2>
        <button className="bs2-view-btn" onClick={() => navigate("/best-sellers")}>
          View More
        </button>
      </div>

      <div className="bs2-subheader">
        <p>Real results. Real routines. Loved by hundreds of customers.</p>
      </div>

      <div className="bs2-slider-container">
        {/* Prev button overlays cards */}
        <button
          className="bs2-nav-btn bs2-prev-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0 || isAnimating}
        >
          <FaArrowLeft />
        </button>

        <div className="bs2-products-wrapper" ref={wrapperRef}>
          <div
            className="bs2-products-track"
            style={{
              transform: `translateX(-${currentIndex * itemWidth}px)`,
            }}
          >
            {products.map((p) => (
              <div key={p._id} className="bs2-product-item">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>

        {/* Next button overlays cards */}
        <button
          className="bs2-nav-btn bs2-next-btn"
          onClick={handleNext}
          disabled={currentIndex + cols >= products.length || isAnimating}
        >
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
}