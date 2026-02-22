import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div className="about-page">

      {/* HERO SECTION */}
      <div className="about-hero">
        <div className="hero-content">
          <h1>About Aavaaram</h1>
          <p>Produced by Nature. Delivered by Us.</p>
        </div>
      </div>

      {/* COMPANY SECTION */}
      <section className="about-section">
        <h2>SRG SUPER FOODS INDIA PRIVATE LIMITED</h2>
        <p>
          SRG Super Foods India Private Limited is dedicated to creating impactful value
          in the superfoods industry. Through our series of Aavaaram products,
          we aim to create a healthy lifestyle using sustainable concepts.
        </p>
      </section>

      {/* VISION */}
      <section className="about-section">
        <h3>Vision</h3>
        <p>
          To inspire generations towards a healthy lifestyle by leading from the
          forefront of the superfood industry with the highest standards,
          quality and sustainability.
        </p>
      </section>

      {/* MISSION */}
      <section className="about-section">
        <h3>Mission</h3>
        <p>
          To be a leader in reliable agro-food organization known for quality,
          ethical practices and respect for natural resources.
        </p>
      </section>

      {/* VALUES */}
      <section className="about-section">
        <h3>Our Values</h3>
        <ul>
          <li><b>Quality Excellence</b> – Finest natural ingredients.</li>
          <li><b>Sustainability</b> – Eco-friendly farming practices.</li>
          <li><b>Innovation</b> – Continuous product development.</li>
          <li><b>Consumer Education</b> – Empower informed choices.</li>
        </ul>
      </section>

      {/* FARM SECTION */}
      <section className="image-section">
        <img src="/images/farm.jpg" alt="Farm" />
        <div>
          <h3>Our Farm</h3>
          <p>
            We work with certified organic farms in South India blessed with
            rich biodiversity and natural resources.
          </p>
        </div>
      </section>

      {/* FACTORY SECTION */}
      <section className="image-section reverse">
        <img src="/images/factory.jpg" alt="Factory" />
        <div>
          <h3>Our Factory</h3>
          <p>
            A modern manufacturing facility with international standards
            located in Tamil Nadu Food Park.
          </p>
        </div>
      </section>

      {/* R&D */}
      <section className="image-section">
        <img src="/images/research.jpg" alt="Research" />
        <div>
          <h3>Research & Development</h3>
          <p>
            Our R&D team develops innovative agro and bio-based products
            through scientific research and modern food technology.
          </p>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="team-section">
        <h2>Team Aavaaram</h2>

        <div className="team-grid">
          <div className="team-card">
            <h4>Dr. Natchimuthu M</h4>
            <p>Managing Director</p>
          </div>

          <div className="team-card">
            <h4>Dr. K R Radhik</h4>
            <p>Consultant - Nutraceuticals</p>
          </div>

          <div className="team-card">
            <h4>Dr. Priyadarshini M S</h4>
            <p>Consultant - Functional Foods</p>
          </div>

          <div className="team-card">
            <h4>Mr. Hitesh G Shaw</h4>
            <p>Marketing & Sales</p>
          </div>

          <div className="team-card">
            <h4>Mr. T Jalendran</h4>
            <p>R & D and NPD</p>
          </div>

          <div className="team-card">
            <h4>Ms. Senthurkani</h4>
            <p>Admin & HR</p>
          </div>

          <div className="team-card">
            <h4>Mrs. Nikasini S</h4>
            <p>Sourcing & Production</p>
          </div>
        </div>
      </section>

    </div>
  );
}