import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Categories.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Autoplay, Navigation } from "swiper/modules";

// Icons
import {
  SearchOutlined,
  ThunderboltOutlined,
  FireOutlined,
  MedicineBoxOutlined,
  CloseOutlined,
  CheckOutlined,
  RightOutlined,
  LeftOutlined
} from "@ant-design/icons";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

// 🎯 ICON MAPPING
const getCategoryIcon = (name) => {
  const n = name?.toLowerCase() || "";
  if (n.includes("sleep")) return <MedicineBoxOutlined />;
  if (n.includes("energy") || n.includes("combo")) return <FireOutlined />;
  if (n.includes("health")) return <ThunderboltOutlined />;
  return <SearchOutlined />;
};

export default function Categories() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const swiperRef = useRef(null);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  // 🔥 FETCH PRODUCTS + REMOVE "INDIVIDUAL PRODUCTS"
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await API.get("/products");
      const data = Array.isArray(res.data) ? res.data : [];

      // ❌ REMOVE unwanted category products
      const cleanedData = data.filter((product) =>
        !product.categories?.some(
          (cat) => cat.name?.toLowerCase().trim() === "individual products"
        )
      );

      setProducts(cleanedData);
      setFiltered(cleanedData);

    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
      setFiltered([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 🔥 FILTER OPTIONS (CLEAN)
  const filterOptions = useMemo(() => {
    const map = new Map();

    products.forEach((p) => {
      p.categories?.forEach((cat) => {
        // ❌ Skip unwanted category
        if (cat.name?.toLowerCase().trim() === "individual products") return;

        if (!map.has(cat._id)) {
          map.set(cat._id, {
            id: cat._id,
            name: cat.name,
            icon: getCategoryIcon(cat.name),
          });
        }
      });
    });

    return [
      { id: "all", name: "All", icon: <SearchOutlined /> },
      ...Array.from(map.values()),
    ];
  }, [products]);

  // 🔥 FILTER CLICK
  const handleFilterClick = (id) => {
    setActiveFilter(id);

    if (id === "all") {
      setFiltered(products);
    } else {
      const filteredData = products.filter((p) =>
        p.categories?.some(
          (c) =>
            c._id === id &&
            c.name?.toLowerCase().trim() !== "individual products"
        )
      );
      setFiltered(filteredData);
    }

    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
    }
  };

  // 🔥 SCROLL ANIMATION
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(
      ".categories-header, .filter-pills-wrapper, .category-slider-wrapper, .clear-filter-btn"
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filtered]);

  // 🔥 SWIPER BREAKPOINTS
  const breakpoints = {
    320: { slidesPerView: 1.2, spaceBetween: 12 },
    480: { slidesPerView: 1.8, spaceBetween: 16 },
    768: { slidesPerView: 2.5, spaceBetween: 20 },
    1024: { slidesPerView: 3.5, spaceBetween: 24 },
    1280: { slidesPerView: 4.5, spaceBetween: 28 },
  };

  // 🔄 LOADING
  if (isLoading) {
    return (
      <div className="categories-loading">
        <div className="loader"></div>
        <h2>Loading amazing products...</h2>
      </div>
    );
  }

  return (
    <section className="home-categories" ref={sectionRef}>

      {/* HEADER */}
      <div className="categories-header animate-on-scroll">
        <div className="header-left">
          <span className="sub-title">✦ CURATED COLLECTION</span>
          <h2 className="main-title">Products</h2>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filter-pills-wrapper animate-on-scroll">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            className={`filter-pill ${activeFilter === f.id ? "active" : ""}`}
            onClick={() => handleFilterClick(f.id)}
          >
            <span className="filter-icon">{f.icon}</span>
            <span className="filter-name">{f.name}</span>
            {activeFilter === f.id && <CheckOutlined className="active-check" />}
          </button>
        ))}
      </div>

      {/* CLEAR */}
      {activeFilter !== "all" && (
        <div className="clear-filter-btn animate-on-scroll">
          <button
            className="clear-all-btn"
            onClick={() => handleFilterClick("all")}
          >
            <CloseOutlined /> Clear all filters
          </button>
        </div>
      )}

      {/* SWIPER SLIDER */}
      <div className="category-slider-wrapper animate-on-scroll">
        <Swiper
          ref={swiperRef}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[FreeMode, Mousewheel, Autoplay, Navigation]}
          autoplay={{ 
            delay: 4000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          }}
          freeMode={{ 
            enabled: true, 
            momentum: true, 
            momentumBounce: false,
            sticky: false
          }}
          mousewheel={{ 
            forceToAxis: true, 
            sensitivity: 1,
            releaseOnEdges: true 
          }}
          navigation={{
            nextEl: ".next-btn",
            prevEl: ".prev-btn",
            clickable: true,
          }}
          speed={800}
          breakpoints={breakpoints}
          grabCursor={true}
          className="category-swiper"
        >
          {filtered.map((p, idx) => (
            <SwiperSlide key={p._id}>
              <div
                className="category-card"
                onClick={() => navigate(`/product/${p._id}`)}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="card-image-wrapper">
                  <img
                    src={p.mainImage || p.image}
                    alt={p.name}
                    loading="lazy"
                  />
                  <div className="overlay"></div>
                </div>

                <div className="card-content">
                  <p className="category-name">{p.name}</p>

                  {p.categories?.[0] && (
                    <span className="category-tag">
                      {p.categories[0].name}
                    </span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ✅ LEFT NAVIGATION BUTTON (OVERLAID) */}
        <button
          className="nav-btn prev-btn nav-btn-left"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous products"
          title="Previous"
        >
          <LeftOutlined />
        </button>

        {/* ✅ RIGHT NAVIGATION BUTTON (OVERLAID) */}
        <button
          className="nav-btn next-btn nav-btn-right"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next products"
          title="Next"
        >
          <RightOutlined />
        </button>

        {filtered.length === 0 && (
          <div className="no-results">
            <p>No products found in this category.</p>
            <button 
              onClick={() => handleFilterClick("all")} 
              className="reset-btn"
            >
              View all products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}