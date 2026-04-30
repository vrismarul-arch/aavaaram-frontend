import React from "react";
import "./PrivacyPolicy.css"; // reuse same CSS

const Shipping = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-content">

        <h1>Orders & Shipping</h1>
        <p className="last-updated">Last Updated: April 2026</p>

        <section>
          <h2>Order Confirmation</h2>
          <p>
            Once your order is placed, you will receive an email confirming
            receipt of your order. A second email will be sent once your order
            is dispatched.
          </p>
          <p>
            For Cash on Delivery (COD) orders, your order will only be processed
            after confirmation via email or mobile.
          </p>
        </section>

        <section>
          <h2>Order Processing</h2>
          <ul>
            <li>Orders are usually dispatched within 2 business days.</li>
            <li>Dispatch may vary depending on product availability.</li>
            <li>Multiple products may be shipped separately.</li>
            <li>All products are inspected and securely packed before shipping.</li>
          </ul>
        </section>

        <section>
          <h2>Delivery Information</h2>
          <p>
            Our trusted delivery partners will deliver your package as soon as possible.
          </p>
          <ul>
            <li>If delivery fails, the courier will contact you.</li>
            <li>Estimated delivery time: 5 to 8 business days.</li>
          </ul>
        </section>

        <section>
          <h2>Shipping Charges</h2>
          <ul>
            <li>Free shipping on orders above ₹499.</li>
            <li>₹50 shipping charge for orders below ₹499.</li>
          </ul>
        </section>

        <section>
          <h2>Shipping Locations</h2>
          <p>
            We currently ship only within India. International shipping is not available.
          </p>
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

      </div>
    </div>
  );
};

export default Shipping;
