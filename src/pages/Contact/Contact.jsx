import "./Contact.css";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined
} from '@ant-design/icons';

export default function Contact() {
  return (
    <section className="contact-wrapper">

      {/* HERO SECTION */}
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Reach out to us anytime!</p>
      </div>

      {/* CONTACT CARD */}
      <div className="contact-card">

        {/* LEFT PANEL */}
        <div className="contact-left">
          <div className="left-header">
            <h3>Contact Information</h3>
            <p>Say something to start a live chat!</p>
          </div>

          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon">
                <EnvironmentOutlined />
              </div>
              <div className="info-text">
                <strong>Registered Office</strong>
                <p>SRG SUPER FOODS INDIA PVT LTD</p>
                <p>No.152B, Pillaiyar Koil Street</p>
                <p>Mogappair East, Chennai - 600037</p>
              </div>
              
            </div>
             <div className="info-item">
              <div className="info-icon">
                <EnvironmentOutlined />
              </div>
              <div className="info-text">
                <strong>Factory </strong>
                <p>E4–E5, SIPCOT Industrial Park</p>
                <p>Dindigul–Madurai Highway</p>
                <p>Pallapatti, Nilakottai – 624201</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <MailOutlined />
              </div>
              <div className="info-text">
                <strong>Email Us</strong>
                <p>feedback@aavaaram.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <PhoneOutlined />
              </div>
              <div className="info-text">
                <strong>Phone Numbers</strong>
                <p>+91 98846 57975</p>
                <p>044 4285 5055</p>
              </div>
            </div>
           
          </div>

          {/* WhatsApp Button */}
          <div className="whatsapp-button-container">
            <a
              href="https://wa.me/919884657975"
              className="whatsapp-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="whatsapp-icon"
              />
              Chat with us on WhatsApp
            </a>
          </div>

          {/* Social Links */}
          <div className="social-links">
            <a href="#" className="social-icon">
              <FacebookOutlined />
            </a>
            <a href="#" className="social-icon">
              <TwitterOutlined />
            </a>
            <a href="#" className="social-icon">
              <InstagramOutlined />
            </a>
            <a href="#" className="social-icon">
              <LinkedinOutlined />
            </a>
          </div>
        </div>

        {/* RIGHT PANEL - WhatsApp Only */}
        <div className="contact-right">
          <div className="right-header">
            <h2>Chat With Us</h2>
            <p>Click the button below to start a WhatsApp conversation</p>
          </div>

          <div className="whatsapp-large">
            <a
              href="https://wa.me/919884657975?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20your%20products."
              className="whatsapp-main-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="whatsapp-main-icon"
              />
              <div className="whatsapp-text">
                <strong>Chat on WhatsApp</strong>
                <span>Click to chat with our team</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* MAP SECTION */}
      {/* <div className="map-section">
        <div className="map-card">
          <h4>
            <EnvironmentOutlined /> Registered Office Location
          </h4>
          <iframe
            title="Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.2177276809934!2d80.17589107505292!3d13.085383212373511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526677ff5d45c9%3A0x92a247144a4595cd!2sAavaaram%20Office!5e0!3m2!1sen!2sin!4v1771828899731!5m2!1sen!2sin"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        <div className="map-card">
          <h4>
            <GlobalOutlined /> Factory Location
          </h4>
          <iframe
            title="Factory Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.470604799866!2d77.93390537502!3d10.142348270569189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00b3e93c678d07%3A0x562300d0135daae9!2sSRG%20SUPER%20FOODS%20INDIA%20PVT%20LTD%20(FACTORY)!5e0!3m2!1sen!2sin!4v1771829243367!5m2!1sen!2sin"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div> */}

    </section>
  );
}