    import React from "react";
import "./PrivacyPolicy.css"; // reuse same CSS

const TermsConditions = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-content">

        <h1>Terms & Conditions</h1>
        <p className="last-updated">Last Updated: April 2026</p>

        <section>
          <h2>Introduction</h2>
          <p>
            This document is an electronic record in terms of the Information
            Technology Act, 2000. By accessing or using our website, you agree
            to be bound by these Terms & Conditions.
          </p>
        </section>

        {/* ABOUT COMPANY */}

        <section>
          <h2>About the Company</h2>
          <p>
            <strong>SRG Super Foods India Private Limited</strong> is a leading
            manufacturer of super foods and herbal products. Through our
            "Aavaaram" product range, we aim to promote healthy living with the
            philosophy “Produced by nature and delivered by us”.
          </p>
        </section>

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
            <li><strong>Sustainability:</strong> Eco-friendly farming practices.</li>
            <li><strong>Innovation:</strong> Creating healthy and tasty products.</li>
            <li><strong>Consumer Awareness:</strong> Educating healthy lifestyle choices.</li>
          </ul>
        </section>

        {/* PRODUCT TERMS */}

        <section>
          <h2>Product Usage</h2>
          <ul>
            <li>Products are for adults above 18 years unless prescribed.</li>
            <li>Do not exceed recommended dosage.</li>
            <li>Store in a cool, dry place.</li>
            <li>Keep out of reach of children.</li>
          </ul>
        </section>

        <section>
          <h2>Medical Disclaimer</h2>
          <p>
            Our products are not intended to diagnose, treat, cure, or prevent
            any disease. Always consult a healthcare professional before use,
            especially if pregnant, under medication, or having medical conditions.
          </p>
        </section>

        {/* WEBSITE TERMS */}

        <section>
          <h2>Website Usage</h2>
          <ul>
            <li>Use the website only for lawful purposes.</li>
            <li>Do not misuse, hack, or disrupt services.</li>
            <li>Do not copy or resell website content or products.</li>
          </ul>
        </section>

        <section>
          <h2>Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account
            and password. Any activity under your account is your responsibility.
          </p>
        </section>

        {/* ORDER TERMS */}

        <section>
          <h2>Pricing & Orders</h2>
          <ul>
            <li>Prices are subject to change without notice.</li>
            <li>Orders may be cancelled due to product unavailability.</li>
            <li>Delivery may take 5–7 business days.</li>
          </ul>
        </section>

        <section>
          <h2>Payment Methods</h2>
          <p>
            We accept Credit Card, Debit Card, UPI, Net Banking, Wallets, and COD.
          </p>
        </section>

        {/* LIABILITY */}

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            We are not liable for any direct or indirect damages arising from the
            use of our website or products.
          </p>
        </section>

        <section>
          <h2>Termination</h2>
          <p>
            We reserve the right to terminate access to the website if Terms are violated.
          </p>
        </section>

        {/* FARM & FACTORY */}

        <section>
          <h2>Our Farm</h2>
          <p>
            We work with certified organic farms in South India, including
            Sivagiri, Dindigul, and Kodaikanal near the Western Ghats.
          </p>
        </section>

        <section>
          <h2>Factory</h2>
          <p>
            E4–E5, SIPCOT Industrial Park,<br />
            Dindigul–Madurai Highway,<br />
            Pallapatti, Nilakottai – 624201
          </p>
        </section>

        <section>
          <h2>Research & Development</h2>
          <p>
            Our R&D team develops innovative products under the concept
            “Food as Medicine and Medicine as Food” with experts from leading institutions.
          </p>
        </section>

        {/* CONTACT */}

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

        {/* WARNING */}

        <section className="warning-box">
          <h2>⚠️ Scam Alert</h2>
          <p>
            Beware of fake offers and fraud. Always verify authenticity before
            making payments. Contact us if you receive suspicious offers.
          </p>
        </section>

      </div>
    </div>
  );
};

export default TermsConditions;
