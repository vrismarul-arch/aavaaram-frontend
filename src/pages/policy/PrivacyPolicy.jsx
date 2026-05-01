import React from "react";
import "./PrivacyPolicy.css";

const Privacypolicy = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-content">

        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: April 2026</p>

        <section>
          <h2>About Us</h2>
          <p>
            <strong>SRG Super Foods India Private Limited</strong> is a leading
            manufacturer of super foods and herbal products. Through our
            “Aavaaram” product range, we aim to promote a healthier lifestyle
            with the philosophy “Produced by nature and delivered by us”.
          </p>
        </section>

        <section>
          <h2>Objective, Scope and Applicability</h2>
          <p>
            We respect your privacy and are committed to protecting your personal
            information. This policy explains how we collect, use, and safeguard
            your data when you use our website or services.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <ul>
            <li>Name, email address, phone number</li>
            <li>Shipping and billing address</li>
            <li>Payment details (via secure third-party providers)</li>
            <li>Device and browsing data (cookies, IP address)</li>
            <li>Preferences, feedback, and reviews</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>Process orders and deliver products</li>
            <li>Improve customer experience</li>
            <li>Send updates and promotional offers</li>
            <li>Customer support and communication</li>
            <li>Ensure legal compliance and fraud prevention</li>
          </ul>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We use industry-standard security measures including encryption,
            secure servers, and restricted access to protect your personal data.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            We use cookies to enhance your browsing experience and analyze site
            traffic. You can disable cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <ul>
            <li>Access and update your personal data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request deletion of your data</li>
          </ul>
        </section>

        {/* COMPANY DETAILS */}

        <section>
          <h2>Contact Us</h2>

          <div className="contact-box">
            <p><strong>SRG Super Foods India Pvt Ltd</strong></p>

            <p>
              No.152B, Pillaiyar Koil Street,<br />
              Mogappair East,<br />
              Chennai - 600037,<br />
              Tamil Nadu, India
            </p>

            <p><strong>Email:</strong> feedback@aavaaram.com</p>
            <p><strong>Phone:</strong> +91 98846 57975 | 044 4285 5055</p>
          </div>
        </section>

        <section>
          <h2>Factory</h2>
          <p>
            E4–E5, SIPCOT Industrial Park,<br />
            Dindigul–Madurai Highway,<br />
            Pallapatti, Nilakottai – 624201
          </p>
        </section>

        {/* COMPANY INFO */}

        <section>
          <h2>Vision</h2>
          <p>
            To inspire generations towards a healthy lifestyle by leading the
            super food industry with high standards, sustainability, and ethics.
          </p>
        </section>

        <section>
          <h2>Mission</h2>
          <p>
            To be a reliable agro food organization known for quality, ethical
            practices, sustainability, and respect for natural resources.
          </p>
        </section>

        <section>
          <h2>Our Values</h2>
          <ul>
            <li><strong>Quality Excellence:</strong> Finest natural ingredients ensuring purity.</li>
            <li><strong>Sustainability:</strong> Supporting eco-friendly farming practices.</li>
            <li><strong>Innovation for Wellness:</strong> Creating healthy and tasty food products.</li>
            <li><strong>Consumer Education:</strong> Promoting awareness of healthy choices.</li>
          </ul>
        </section>

        <section>
          <h2>Our Farm</h2>
          <p>
            We work with certified organic farms across South India, especially
            in regions like Sivagiri, Dindigul, and Kodaikanal, near the Western
            Ghats known for rich biodiversity.
          </p>
        </section>

        <section>
          <h2>Our Factory</h2>
          <p>
            Our modern manufacturing facility is located at SIPCOT Industrial
            Park, Nilakottai, Dindigul, built with international standards
            within Tamil Nadu Food Park.
          </p>
        </section>

        <section>
          <h2>Research & Development</h2>
          <p>
            Our R&D team develops innovative agro and bio-based products under
            the concept of “Food as Medicine and Medicine as Food”. Experts from
            leading institutions contribute to continuous innovation in food
            science and nutraceuticals.
          </p>
        </section>

        <section className="warning-box">
          <h2>⚠️ Important Notice</h2>
          <p>
            Beware of fraudulent offers and scams. Please verify authenticity
            before making any payments or purchases.
          </p>
        </section>

      </div>
    </div>
  );
};

export default Privacypolicy;
