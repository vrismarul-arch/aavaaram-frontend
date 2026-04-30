import "./Testimonials.css";
import { useRef, useEffect, useState } from "react";

export default function Testimonials() {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const cardWidth = 392;

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollLeft += dir === "left" ? -cardWidth : cardWidth;
  };

  /* 🔥 AUTO SCROLL WITH PAUSE ON HOVER */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current || isHovered) return;

      const slider = sliderRef.current;
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft >= maxScroll - 5) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  const reviews = [
    {
      text: "Excellent quality supplements. I’ve noticed real improvement in digestion and energy levels. Highly recommended!",
      name: "Jayaraman Arumugadoss",
    },
    {
      text: "Nice products good for health.",
      name: "Satheesh Kumar",
    },
    {
      text: "Prompt delivery and premium packaging. The herbal formulations feel authentic and effective.",
      name: "Shanmugiah Arumugam",
    },
    {
      text: "Consistent quality and trustworthy brand. Aavaaram has become part of my daily routine.",
      name: "Lakshmi Narayanan",
    },
  ];

  return (
    <section className="testimonials">
      <h2>Real Results... Real Reviews</h2>
      <p>Real experiences. Genuine results. Trusted wellness.</p>

      <div className="slider-wrapper">
        <button className="nav left" onClick={() => scroll("left")}>‹</button>

        <div
          className="slider"
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {reviews.map((r, i) => (
            <div className="testimonial-card" key={i}>
              <div className="quote">“</div>
              <p>{r.text}</p>
              <div className="stars">★★★★★</div>
              <h4>{r.name}</h4>
            </div>
          ))}
        </div>

        <button className="nav right" onClick={() => scroll("right")}>›</button>
      </div>
    </section>
  );
}
