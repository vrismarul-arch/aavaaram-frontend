import React from "react";
import "./SweetLegacy.css";

import rightFullImage from './right.png'; // Add your full-size image here
import { FaArrowRight, FaWhatsapp } from "react-icons/fa";

export default function SupportLifestyle() {
  // Phone numbers for WhatsApp
  const phoneNumber1 = "919884657975"; // +91 98846 57975
  const phoneNumber2 = "914442855055"; // 044 4285 5055

  // Default message for WhatsApp
  const defaultMessage = "Hello! I'm interested in ENERJ+ and would like to know more about your herbal wellness system.";

  // Function to handle WhatsApp click - opens chat with primary number
  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber1}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Optional: Function to show number selection dropdown
  const handleGetStartedClick = () => {
    // You can either:
    // Option 1: Directly open WhatsApp with primary number
    handleWhatsAppClick();
    
    // Option 2: Show a modal/popup to choose between the two numbers
    // Uncomment the code below if you want a selection option
    /*
    const userChoice = window.confirm(
      "Connect with us on WhatsApp!\n\nClick OK for +91 98846 57975\nCancel for 044 4285 5055"
    );
    
    if (userChoice) {
      window.open(`https://wa.me/${phoneNumber1}?text=${encodeURIComponent(defaultMessage)}`, "_blank");
    } else {
      window.open(`https://wa.me/${phoneNumber2}?text=${encodeURIComponent(defaultMessage)}`, "_blank");
    }
    */
  };

  return (
    <section className="support-section">

      {/* LEFT CONTENT */}
      <div className="support-left">
        <h2 className="support-title">
          Rooted in Nature, <br />
          Built for Your Lifestyle
        </h2>

        <p className="support-desc">
          For generations, Tamil households relied on herbs for healing.
          Aavaaram brings that wisdom into your daily routine through <br /> ENERJ+
          a structured herbal system designed for modern life.
          No mixing powders.
          No complicated routines.
          No guesswork.
          Just simple, effective herbal support  every day.
        </p>

        <ul className="support-list">
          <li>   Supports energy, immunity and detox naturally</li>
          <li>   Built using time-tested herbal formulations</li>
          <li>   Easy-to-follow daily capsule routine</li>
          <li>   Made for real, busy lifestyles</li>
        </ul>

        <div>
          <button className="support-btn" onClick={handleGetStartedClick}>
            <FaWhatsapp className="whatsapp-icon" /> Get Started on WhatsApp <FaArrowRight />
          </button>
        </div>

        {/* Optional: Display contact info */}
       
      </div>

      {/* RIGHT FULL-SIZE IMAGE */}
      <div className="support-right-full">
        <img src={rightFullImage} alt="Full size lifestyle" className="full-image" />
      </div>

    </section>
  );
}