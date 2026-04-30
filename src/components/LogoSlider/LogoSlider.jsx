import "./LogoSlider.css";

import nyt from "./1.png";
import forbes from "./2.png";
import vogue from "./3.png";
import bon from "./4.png";

export default function BrandSlider() {

  const logos = [nyt, forbes, vogue, bon];

  return (
    <section className="brand-slider">
<div className="combo-header">
        {/* <span className="combo-sub">COMBO SECTION</span> */}
        <h2>Trusted by customers across India
</h2>
      </div>
      <div className="brand-track ">

        {logos.concat(logos).map((logo, index) => (
          <div className="brand-item" key={index}>
            <img src={logo} alt="brand"/>
          </div>
        ))}

      </div>

    </section>
  );
}
