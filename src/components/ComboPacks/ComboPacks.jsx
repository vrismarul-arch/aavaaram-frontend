import React, { useEffect, useRef, useState, useCallback } from 'react';
import './ComboPacks.css';
import first from './1.png';
import two from './2.png';
import three from './3.png';
import four from './4.png';
import five from './5.png';
import six from './6.png';
import seven from './7.png';
import eight from './8.png';
import nine from './9.png';

// Map image filenames to imported images
const imageMap = {
  '1.png': first,
  '2.png': two,
  '3.png': three,
  '4.png': four,
  '5.png': five,
  '6.png': six,
  '7.png': seven,
  '8.png': eight,
  '9.png': nine,
};

const products = [
  {
    "id": 1,
    "name": "Sleep & Relax Wellness",
    "tag": "Ashwagandha / Brahmi / Moringa / Shallaki",
    "price": "₹250",
    "image": "5.png"
  },
  {
    "id": 2,
    "name": "ENERJ+ (Ortho & Mobility Care)",
    "tag": "Pirandai / Shallaki / Turmeric / Moringa",
    "price": "₹1,050",
    "image": "6.png"
  },
  {
    "id": 3,
    "name": "Vitality & Daily Energy (ENERGY+)",
    "tag": "Shilajit / Ashwagandha / Spirulina / Moringa",
    "price": "₹850",
    "image": "3.png"
  },
  {
    "id": 4,
    "name": "Liver Cleansing Combo",
    "tag": "Bhumi Amla / Triphala / Turmeric / Wheatgrass",
    "price": "₹1,380 (50% off from ₹2,100)",
    "image": "4.png"
  },
  {
    "id": 5,
    "name": "Diabetic Care",
    "tag": "Aavaaram / Fenugreek / Neem / Turmeric",
    "price": "Not specified",
    "image": "1.png"
  },
  {
    "id": 6,
    "name": "ENERJ+ (Liver Care)",
    "tag": "Citrullus / Kolakottai / Aminoglucose / Turmeric",
    "price": "Not specified",
    "image": "8.png"
  }
];

const GAP = 16; // must match CSS gap

const getVisibleCols = () => {
  if (window.innerWidth <= 768)  return 1;
  if (window.innerWidth <= 1024) return 2;
  return 4;
};

const ComboPacks = () => {
  const total        = products.length;
  const [cols, setCols]               = useState(getVisibleCols());
  const [currentIndex, setCurrentIndex] = useState(0);   // card index (not step)
  const [translateX, setTranslateX]   = useState(0);
  const [animating, setAnimating]     = useState(false);

  const viewportRef  = useRef(null);
  const timerRef     = useRef(null);

  /* ── responsive cols ── */
  useEffect(() => {
    const onResize = () => {
      setCols(getVisibleCols());
      setCurrentIndex(0);
      setTranslateX(0);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── compute pixel offset ── */
  const computeOffset = useCallback((index) => {
    if (!viewportRef.current) return 0;
    const vw        = viewportRef.current.offsetWidth;
    const cardWidth = (vw - GAP * (cols - 1)) / cols;
    return index * (cardWidth + GAP);
  }, [cols]);

  /* ── navigate ── */
  const goTo = useCallback((index) => {
    if (animating) return;
    const maxIndex = total - cols;
    const safe     = Math.max(0, Math.min(index, maxIndex));
    setAnimating(true);
    setCurrentIndex(safe);
    setTranslateX(computeOffset(safe));
    setTimeout(() => setAnimating(false), 500);
  }, [animating, cols, total, computeOffset]);

  /* ── auto-play ── */
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex  = total - cols;
        const nextIndex = prev >= maxIndex ? 0 : prev + cols;
        setTranslateX(computeOffset(nextIndex));
        return nextIndex;
      });
    }, 3200);
  }, [cols, total, computeOffset]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  /* ── cursor spotlight per card ── */
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width)  * 100}%`);
    e.currentTarget.style.setProperty('--y', `${((e.clientY - rect.top)  / rect.height) * 100}%`);
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.setProperty('--x', '50%');
    e.currentTarget.style.setProperty('--y', '50%');
  };

  /* ── dots ── */
  const steps       = Math.ceil(total / cols);
  const currentStep = Math.round(currentIndex / cols);

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < total - cols;

  return (
    <div className="enj-container">

      {/* ── Header ── */}
      <div className="enj-header">
        <span className="enj-sub">Designed for Real Indian Lifestyles</span>
        <h3>
          Each ENERJ<sup>+</sup> combo is built to solve a specific health need 
          so you don't have to figure it out yourself.
        </h3>
      </div>

      {/* ── Slider ── */}
      <div className="enj-slider-wrap">

        {/* Prev */}
        <button
          className="enj-nav-btn enj-prev"
          onClick={() => { goTo(currentIndex - cols); resetTimer(); }}
          disabled={!canPrev || animating}
          aria-label="Previous"
        >
          ‹
        </button>

        {/* Viewport */}
        <div className="enj-viewport" ref={viewportRef}>
          <div
            className="enj-track"
            style={{ transform: `translateX(-${translateX}px)` }}
          >
            {products.map((item) => (
              <div
                key={item.id}
                className="enj-card"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img 
                  src={imageMap[item.image]} 
                  alt={item.name} 
                  className="enj-card-img" 
                />
                {/* <span className="enj-badge">ENERJ+</span> */}
                {/* <div className="enj-overlay">
                  <p className="enj-card-title">{item.name}</p>
                  <p className="enj-card-sub">{item.tag}</p>
                  
                </div> */}
              </div>
            ))}
          </div>
        </div>

        {/* Next */}
        <button
          className="enj-nav-btn enj-next"
          onClick={() => { goTo(currentIndex + cols); resetTimer(); }}
          disabled={!canNext || animating}
          aria-label="Next"
        >
          ›
        </button>

      </div>

      {/* ── Dots ── */}
      <div className="enj-dots">
        {Array.from({ length: steps }).map((_, i) => (
          <button
            key={i}
            className={`enj-dot${i === currentStep ? ' active' : ''}`}
            onClick={() => { goTo(i * cols); resetTimer(); }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default ComboPacks;