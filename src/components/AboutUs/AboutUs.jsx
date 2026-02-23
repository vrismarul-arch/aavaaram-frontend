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
        <p>Manufacturer of Super Foods and Herbal Foods</p>
        <p>
      SRG Super Foods India Private Limited, one of the forerunner organization dedicated for creating impactful value chain in super foods industry and providing the need of the hour products to the world of our esteemed customers. We, through our series of “ aavaaram “ products, aim to create of adopting super foods in the lifestyle of every one with a sustainability concept of “ Produced by nature and delivered by us ”.
        </p>
      </section>

      {/* VISION */}
      <section className="about-section">
        <h3>Vision</h3>
        <p>
          Aim to inspire the generations towards the healthy lifestyle by leading from forefront of the super food industry with the highest standards, quality, sustainability of all stake holders and ethical values.
        </p>
      </section>

      {/* MISSION */}
      <section className="about-section">
        <h3>Mission</h3>
        <p>
          To be a leader and reliable agro food organization for its quality, ethical practices, value chain, eco system and respect for national resources.
        </p>
      </section>

      {/* VALUES */}
      <section className="about-section">
        <h3>Our Values</h3>
        <ul>
          <li><b>Quality Excellence</b> - we precisely select and process the finest natural ingredients so as to make our every product is a symbol of purity and taste.</li>
          <li><b>Sustainability</b> – we support and stand with the model of adopting sustainable farming practices, free from pesticide and minimizing our environmental impact at every stage of production.</li>
          <li><b>Innovation for wellness</b> – we continuously innovate to develop new food products that not only meet nutritional needs but also delight taste buds , making healthy eating enjoyable .</li>
          <li><b>Consumer Education</b> – we empower consumers with knowledge about the benefit of our food products and the importance of making conscious informed choices for their well being..</li>
        </ul>
      </section>

      {/* FARM SECTION */}
      <section className="image-section">
        <img src="/images/farm.jpg" alt="Farm" />
        <div>
          <h3>Our Farm</h3>
          <p>
            We are proud of working with one of the largest certified organic farms in South India. Our farms are bestowed with greatness of the Western Ghats which is the world’s hottest biodiversity and known for its rich and unique flora and fauna. Farms in Sivagiri, Dindigul and Kodaikanal are the testimonials for our tireless efforts in reviving of the ancient agro knowledge and techniques.
          </p>
        </div>
      </section>

      {/* FACTORY SECTION */}
      <section className="image-section reverse">
        <img src="/images/factory.jpg" alt="Factory" />
        <div>
          <h3>Our Factory</h3>
          <p>
           A modern factory with international standards is being established for our manufacturing facility at Sipcot Nilakottai, Dindigul within the campus of Tamil Nadu food park.
          </p>
        </div>
      </section>

      {/* R&D */}
      <section className="image-section">
        <img src="/images/research.jpg" alt="Research" />
        <div>
          <h3>Research & Development</h3>
          <p>
            The Research and Development Team has successfully brought a range of agro and bio based holistic healthy products under the concept of “Food as Medicine and Medicine as Food”. The team is known for its innovation, research, development, commercialization of new products, processes or services driven by technology or intellectual property in the areas of food science, nutraceutical and natural agro farming. The scientists involved in R&D are from the most premier organizations like Indian Institute of Food Processing, Govt. Of India, Tamil Nadu Agriculture University, Gandhigram Trust, Loyola College-Chennai.
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