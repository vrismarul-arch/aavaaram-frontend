import "./Testimonials.css";
import { useRef, useEffect } from "react";

export default function Testimonials() {
  const sliderRef = useRef(null);

  const scroll = (dir) => {
    const cardWidth = 392; // card + gap
    sliderRef.current.scrollLeft += dir === "left" ? -cardWidth : cardWidth;
  };

  /* 🔥 AUTO SCROLL */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current) return;

      const slider = sliderRef.current;
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft >= maxScroll) {
        slider.scrollLeft = 0; // 🔥 Reset to start
      } else {
        slider.scrollLeft += 392;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const reviews = [
    {
      text: "Everything I ordered on 21-12-24, all the items both sweets and karams are exceedingly good. Fresh, delicious.",
      name: "Jayaraman Arumugadoss",
    },
    {
      text: "For the past 2 years I am buying Sattur mittai kadai products for every occasion. Very tasty and delicious. Packing also so good.",
      name: "Mangaiyarkarasi Ravirajan",
    },
    {
      text: "Prompt delivery. Tasty items. Wish to have an outlet at Medahalli in Bengaluru.",
      name: "Shanmugiah Arumugam",
    },
    {
      text: "Quality maintained for generations. Taste remains unchanged.",
      name: "Lakshmi Narayanan",
    },
  ];

  return (
    <section className="testimonials">
      <h2>Our Customer Love Us</h2>
      <p>Your feedback helps us improve – we’d love to hear from you!</p>

      <div className="slider-wrapper">
        <button className="nav left" onClick={() => scroll("left")}>‹</button>

        <div className="slider" ref={sliderRef}>
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