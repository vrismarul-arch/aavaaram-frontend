// src/components/Footer/Footer.jsx
import "./Footer.css";
import { Link } from "react-router-dom";

import {
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
  PhoneFilled,
  MailFilled,
  EnvironmentFilled,
} from "@ant-design/icons";

export default function Footer() {
    const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-top">

        {/* BRAND */}
        <div className="footer-col footer-brand">
          <img src="/logo/logow.png" alt="Aavaaram Logo" className="footer-logo" />

          <p className="footer-desc">
            Bringing authentic taste and tradition to your home.
            Crafted with purity, quality, and generations of expertise.
          </p>

          <div className="social-icons">
            <FacebookFilled />
            <InstagramFilled />
            <YoutubeFilled />
          </div>
        </div>

        {/* INFORMATION */}
       <div className="footer-col">
  <h4>Information</h4>
  <ul className="footer-links">
    <li><Link to="/">Home</Link></li>
    <li><Link to="/about">About Us</Link></li>
    <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
    <li><Link to="/shipping">Delivery & Shipping</Link></li>
  </ul>
</div>
        {/* FACTORY - with proper icon alignment */}
        <div className="footer-col">
          <h4>Factory</h4>
          <div className="factory-address">
            <EnvironmentFilled className="icons" />
            <span className="address-text">
              E4–E5, SIPCOT Industrial Park
              <br />
              Dindigul–Madurai Highway
              <br />
              Pallapatti, Nilakottai – 624201
            </span>
          </div>
         
        </div>

        {/* CONTACT - with proper icon alignment */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <h5 className="white">SRG SUPER FOODS INDIA PVT LTD</h5>
          <div className="factory-address">
            <EnvironmentFilled className="icons" />
            <span className="address-text">
              No.152B, Pillaiyar Koil Street,
              <br />
              Mogappair East,
              <br />
              Chennai - 600037,
              <br />
              Tamil Nadu, India.
            </span>
          </div>
          <div className="contact-line">
            <MailFilled className="icons" />
            <span>feedback@aavaaram.com</span>
          </div>
          <div className="contact-line">
            <PhoneFilled className="icons" />
            <span>+91 98846 57975 | 044 4285 5055</span>
          </div>
        </div>

      </div>

      {/* Floating Buttons */}
      <div className="floating-buttons">
        {/* WhatsApp */}
        <a
          href="https://wa.me/919884657975?text=Hi%20I%20need%20help"
          target="_blank"
          rel="noopener noreferrer"
          className="float-btn whatsapp"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
            alt="WhatsApp"
          />
        </a>
      </div>

      <div className="footer-bottom">
        {/* Dynamic current year */}
        <p>© {currentYear} Aavaaram. All rights reserved.</p>
        <p>
          Designed & Developed by <strong>Vrism</strong>
        </p>
      </div>
    </footer>
  );
}