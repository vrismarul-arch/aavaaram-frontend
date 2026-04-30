import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Banner.css";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const API = import.meta.env.VITE_API_URL;

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        // ✅ Use the existing GET endpoint (no /active)
        const response = await fetch(`${API}/api/banners`);
        const data = await response.json();
        
        console.log("API Response:", data); // Debug log
        
        // Handle both response formats
        let bannersData = [];
        if (data.success) {
          bannersData = data.data;
        } else if (Array.isArray(data)) {
          bannersData = data;
        } else {
          bannersData = [];
        }
        
        // ✅ Filter only active banners on frontend
        const activeBanners = bannersData.filter(banner => banner.isActive === true);
        setBanners(activeBanners);
      } catch (error) {
        console.error("Error loading banners:", error);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [API]);

  // Track window resize for responsive images
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get appropriate image based on screen size
  const getBannerImage = (banner) => {
    const isMobile = windowWidth < 768;
    if (isMobile && banner.mobileImage) {
      return banner.mobileImage;
    }
    return banner.desktopImage || banner.image; // Fallback to image field if exists
  };

  // Loading state
  if (loading) {
    return (
      <div className="banner-container">
        <div className="banner-loading">
          <div className="loading-skeleton"></div>
        </div>
      </div>
    );
  }

  // No banners state
  if (!banners.length) {
    return null;
  }

  return (
    <div className="banner-container">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        navigation={false}
        pagination={{ clickable: true, dynamicBullets: true }}
        speed={800}
        className="home-banner"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner._id || index}>
            <div className="banner-slide">
              {/* Banner Image */}
              <img
                src={getBannerImage(banner)}
                alt={banner.title || "Banner"}
                className="banner-image"
                loading={index === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  console.error("Image failed to load:", getBannerImage(banner));
                  e.target.style.display = "none";
                }}
              />
              
              {/* Content Overlay - Only show if there's content */}
              {(banner.title || banner.subtitle || banner.link) && (
                <div className="banner-overlay">
                  <div className="banner-content">
                    {banner.title && (
                      <h1 className="banner-title">{banner.title}</h1>
                    )}
                    {banner.subtitle && (
                      <p className="banner-subtitle">{banner.subtitle}</p>
                    )}
                    {banner.link && (
                      <a 
                        href={banner.link} 
                        className="banner-cta"
                        target={banner.link.startsWith('http') ? "_blank" : "_self"}
                        rel={banner.link.startsWith('http') ? "noopener noreferrer" : ""}
                      >
                        Shop Now
                        <svg className="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}