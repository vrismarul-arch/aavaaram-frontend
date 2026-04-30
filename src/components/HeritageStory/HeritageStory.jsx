import "./HeritageStory.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// Ant Design Icons
import { 
  GiftOutlined,           // for legacy/ heritage
  FieldTimeOutlined,      // for time/years
  TeamOutlined,           // for generations
  ShopOutlined,           // for products
  GoldOutlined,           // for quality
  ExperimentOutlined,     // for research
  SafetyOutlined,         // for trust/safety
  StarOutlined,           // for excellence
  ThunderboltOutlined,    // for energy/purity
  EnvironmentOutlined,    // for sourcing
  BookOutlined,           // for knowledge
  MedicineBoxOutlined,    // for wellness
  ArrowRightOutlined,     // for arrow
  CloseOutlined,          // for close (if needed)
  CheckOutlined,          // for check marks
  FireOutlined,           // for passion
  HeartOutlined           // for care
} from '@ant-design/icons';

export default function HeritageStory() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="heritage" ref={sectionRef}>
      {/* Decorative Background Elements */}
      <div className="heritage-bg">
        <div className="bg-ornament ornament-1"></div>
        <div className="bg-ornament ornament-2"></div>
        <div className="bg-ornament ornament-3"></div>
        <div className="bg-pattern"></div>
      </div>

      <div className="heritage-inner">
        {/* LEFT IMAGE WITH GOLD FRAME */}
        <div className={`heritage-image-wrapper ${isVisible ? 'animate' : ''}`}>
          <div className="gold-frame">
            <div className="frame-corner corner-tl"></div>
            <div className="frame-corner corner-tr"></div>
            <div className="frame-corner corner-bl"></div>
            <div className="frame-corner corner-br"></div>
            
            <div className="image-container">
              <img
                src="https://images.unsplash.com/photo-1526817575615-368f3b68f6f3?q=80&w=600"
                alt="Founder"
                className="heritage-image"
              />
              <div className="image-overlay"></div>
            </div>

            <div className="frame-decoration">
              <span className="decoration-icon"><GiftOutlined /></span>
              <span className="decoration-icon"><GoldOutlined /></span>
              <span className="decoration-icon"><StarOutlined /></span>
            </div>

            <div className="since-badge">
              <span className="since-year">Since</span>
              <span className="year-number">1914</span>
            </div>
          </div>

          <div className="heritage-stats">
            <div className="stat-item">
              <span className="stat-icon"><FieldTimeOutlined /></span>
              <span className="stat-value">109+</span>
              <span className="stat-label">Years</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon"><TeamOutlined /></span>
              <span className="stat-value">4</span>
              <span className="stat-label">Generations</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon"><ShopOutlined /></span>
              <span className="stat-value">50+</span>
              <span className="stat-label">Products</span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className={`heritage-content ${isVisible ? 'animate' : ''}`}>
          <div className="content-badge">
            <span className="badge-line"></span>
            <span className="badge-text">OUR LEGACY</span>
            <span className="badge-line"></span>
          </div>

          <h2 className="heritage-title">
            <span className="title-script">A Legacy of Quality,</span>
            <span className="title-bold"> Carried Forward with Care</span>
          </h2>

          <div className="heritage-description">
            <p className="main-text">
              For generations, we have believed in the healing power of nature. 
              Today, we continue that legacy with advanced research, ethical sourcing, 
              and uncompromising quality standards.
            </p>
            
            <div className="highlight-box">
              <span className="quote-icon"><HeartOutlined /></span>
              <p className="quote-text">
                Every product reflects our dedication to authenticity, 
                purity, and trust.
              </p>
            </div>

            <div className="feature-list">
              <div className="feature">
                <span className="feature-icon"><EnvironmentOutlined /></span>
                <div className="feature-text">
                  <h4>Ethical Sourcing</h4>
                  <p>From trusted farmers</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon"><ExperimentOutlined /></span>
                <div className="feature-text">
                  <h4>Advanced Research</h4>
                  <p>Modern validation</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon"><SafetyOutlined /></span>
                <div className="feature-text">
                  <h4>Pure Quality</h4>
                  <p>Uncompromising standards</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <button className="story-btn" onClick={() => navigate("/about")}>
              <span>Discover Our Journey</span>
              <span className="btn-arrow"><ArrowRightOutlined /></span>
            </button>

            <div className="trust-indicators">
              <div className="trust-indicator">
                <span className="indicator-icon"><CheckOutlined /></span>
                <span>100% Natural</span>
              </div>
              <div className="trust-indicator">
                <span className="indicator-icon"><CheckOutlined /></span>
                <span>GMP Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}