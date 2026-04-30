import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div className="au-page">

      {/* ── FULL-WIDTH HERO ── */}
      <div className="au-hero">
        <div className="au-hero-content">
          
            
        </div>
      </div>

      {/* ── REST OF PAGE (contained) ── */}
      <div className="au-inner">

        {/* COMPANY */}
        <section className="au-section">
          <h2>SRG SUPER FOODS INDIA PRIVATE LIMITED</h2>
          <p>
            SRG Super Foods India Private Limited, one of the forerunner organizations
            dedicated for creating impactful value chain in super foods industry and
            providing the need of the hour products to the world of our esteemed
            customers. We, through our series of "aavaaram" products, aim to create
            adoption of super foods in the lifestyle of every one with a sustainability
            concept of <em>"Produced by nature and delivered by us"</em>.
          </p>
        </section>

        {/* VISION & MISSION */}
        <div className="au-vm-grid">
          <div className="au-vm-box au-vision">
            <span className="au-vm-icon">🌿</span>
            <h3>Vision</h3>
            <p>
              Aim to inspire the generations towards the healthy lifestyle by leading
              from the forefront of the super food industry with the highest standards,
              quality, sustainability of all stake holders and ethical values.
            </p>
          </div>
          <div className="au-vm-box au-mission">
            <span className="au-vm-icon">🎯</span>
            <h3>Mission</h3>
            <p>
              To be a leader and reliable agro food organization for its quality,
              ethical practices, value chain, eco system and respect for natural resources.
            </p>
          </div>
        </div>

        {/* VALUES */}
        <section className="au-section">
          <h3>Our Values</h3>
          <ul className="au-values-list">
            <li>
              <span className="au-val-icon">✦</span>
              <div>
                <b>Quality Excellence</b>
                <p>We precisely select and process the finest natural ingredients so that every product is a symbol of purity and taste.</p>
              </div>
            </li>
            <li>
              <span className="au-val-icon">✦</span>
              <div>
                <b>Sustainability</b>
                <p>We support sustainable farming practices, free from pesticides, minimizing our environmental impact at every stage.</p>
              </div>
            </li>
            <li>
              <span className="au-val-icon">✦</span>
              <div>
                <b>Innovation for Wellness</b>
                <p>We continuously innovate to develop food products that meet nutritional needs and delight taste buds.</p>
              </div>
            </li>
            <li>
              <span className="au-val-icon">✦</span>
              <div>
                <b>Consumer Education</b>
                <p>We empower consumers with knowledge about the benefits of our products and the importance of conscious, informed choices.</p>
              </div>
            </li>
          </ul>
        </section>

        {/* FARM */}
        <section className="au-img-section">
          <div className="au-img-wrap">
            <img src="/images/farm.jpg" alt="Farm" />
          </div>
          <div className="au-img-text">
            <h3>Our Farm</h3>
            <p>
              We are proud of working with one of the largest certified organic farms
              in South India. Our farms are bestowed with greatness of the Western Ghats 
              the world's hottest biodiversity hotspot, known for its rich and unique flora
              and fauna. Farms in Sivagiri, Dindigul and Kodaikanal are the testimonials
              for our tireless efforts in reviving ancient agro knowledge and techniques.
            </p>
          </div>
        </section>

        {/* FACTORY */}
        <section className="au-img-section au-reverse">
          <div className="au-img-wrap">
            <img src="/images/factory.jpg" alt="Factory" />
          </div>
          <div className="au-img-text">
            <h3>Our Factory</h3>
            <p>
              A modern factory with international standards is being established for our
              manufacturing facility at Sipcot Nilakottai, Dindigul within the campus of
              Tamil Nadu Food Park.
            </p>
          </div>
        </section>

        {/* R&D */}
        <section className="au-img-section">
          <div className="au-img-wrap">
            <img src="/images/research.jpg" alt="Research" />
          </div>
          <div className="au-img-text">
            <h3>Research &amp; Development</h3>
            <p>
              The R&amp;D Team has successfully brought a range of agro and bio-based
              holistic healthy products under the concept of <em>"Food as Medicine and
              Medicine as Food"</em>. Scientists involved are from premier organizations
              like Indian Institute of Food Processing, Tamil Nadu Agriculture University,
              Gandhigram Trust, and Loyola College Chennai.
            </p>
          </div>
        </section>

      </div>{/* /au-inner */}
    </div>
  );
}