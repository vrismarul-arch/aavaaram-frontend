// TimelessDelights.jsx
import "./TimelessDelights.css";
import { useState, useEffect, useRef } from "react";

// Import your image - replace with your actual image path
import hughImage from "./2.png"; // Make sure this path is correct

export default function TimelessDelights() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hugh-section" ref={sectionRef}>
      <div className="hugh-container">
        {/* LEFT CONTENT - TEXT */}
        <div className={`hugh-left ${isVisible ? 'animate' : ''}`}>
  
  <h1 className="hugh-title">
    The Natural Power of <br />
    <span className="hugh-title-highlight">Aavaaram Superfoods</span>
  </h1>

  <p className="hugh-subtitle">
    Nourish your body with powerful herbs and natural ingredients. 
    <span className="hugh-subtitle-accent">
      Farm-fresh superfoods crafted to support your daily wellness.
    </span>
  </p>

  <div className="hugh-cta">
  

    <button className="hugh-btn-secondary">
      Explore Our Superfoods
    </button>
  </div>

  <div className="hugh-disclaimer">
    *Aavaaram products are made with natural ingredients sourced from our farms 
    and carefully processed to preserve their nutritional value. These products 
    are intended to support a healthy lifestyle and are not meant to replace 
    medical advice or treatment.
  </div>

</div>


        {/* RIGHT CONTENT - FULL SIZE IMAGE */}
        <div className={`hugh-right ${isVisible ? 'animate' : ''}`}>
          <div className="image-wrapper">
            <img 
              src={hughImage} 
              alt="Hugh Jackman with AG1 daily health drink" 
              className="hugh-image"
            />
            
            {/* Optional overlay badge */}
           

            {/* Optional gradient overlay for better text readability if needed */}
            <div className="image-gradient"></div>
          </div>
        </div>
      </div>
    </section>
  );
}