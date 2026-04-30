import React, { useRef, useEffect, useState } from "react";
import "./IngredientsSection.css";

const ingredients = [
  {
    name: "Ashwagandha",
    title: "Ashwagandha ",
    desc: "Stress & strength.",
    image:
      "https://naturalpoland.com/wp-content/uploads/Ekstrakt-z-ashwagandhy-510x510.jpg.webp"
  },
  {
    name: "Shilajit ",
    title: "Shilajit ",
    desc: "Energy & stamina.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv463_ROOXqqaIi0QQwltnyV-m2CG8C7BMgA&s"
  },
  {
    name: "Moringa ",
    title: "Moringa ",
    desc: "Daily nutrition",
    image:
      "https://images.medicinenet.com/images/article/main_image/what-does-moringa-do-for-your-body.jpg?output-quality=75"
  },
  {
    name: "Turmeric ",
    title: "Turmeric",
    desc: "Inflammation support",
    image:
      "https://www.viralspices.com/wp-content/uploads/2022/01/Evaluating-the-Differences-between-Fresh-and-Dried-Turmeric-624x312.jpg"
  },
  {
    name: "Triphala",
    title: "Triphala",
    desc: "Gut balance",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsEN02Eo5iQ0DrpPimXkjqc6nsg0CjywLTjg&s"
  }
];

// Duplicate ingredients for infinite effect
const duplicatedIngredients = [...ingredients, ...ingredients, ...ingredients];

const IngredientsSection = () => {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    let scrollInterval;
    
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isHovered && slider) {
          // Get current scroll position
          const currentScroll = slider.scrollLeft;
          // Calculate next scroll position (scroll by 1px smoothly)
          const nextScroll = currentScroll + 1;
          
          // Check if we've reached the end
          if (nextScroll >= slider.scrollWidth - slider.clientWidth) {
            // Reset to beginning
            slider.scrollLeft = 0;
          } else {
            slider.scrollLeft = nextScroll;
          }
        }
      }, 20); // Adjust this value for speed (lower = faster)
    };
    
    startAutoScroll();
    
    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [isHovered]);

  return (
    <section className="ingredients-section">
      <div className="ingredients-header">
        <h3 className="ingtitle">Top Quality Ingredients Optimised for Wellness Impact</h3>
        {/* <div className="header-buttons">
          <button className="btn-light">View All Ingredients</button>
          <button className="btn-outline">Supplement Facts</button>
        </div> */}
      </div>

      <div 
        className="ingredients-slider" 
        ref={sliderRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {duplicatedIngredients.map((item, index) => (
          <div className="ingredient-card" key={`${item.name}-${index}`}>
            <img src={item.image} alt={item.title} loading="lazy" />
            <div className="card-overlay">
              <span className="ingredient-name">{item.name}</span>
              <div className="glass-box">
                <h3 className="titile-71">{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IngredientsSection;