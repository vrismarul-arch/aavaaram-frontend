import React from "react";
import "./NutritionalPanel.css";
import scoop from "./1.png";

function NutritionalPanel() {
  const data = [
    { name: "DAILY HERBAL COVERAGE", value: "40" },
    { name: "ENERGY SUPPORT", value: "6G" },
    { name: "NATURAL DETOX SYSTEM", value: "2G" },
    { name: "IMMUNITY BOOST", value: "<1G" },
    { name: "STRESS BALANCE", value: "2G" },
    { name: "GUT HEALTH SUPPORT", value: "7.5G" },
    { name: "DAILY PHYTONUTRIENTS", value: "1.5G" },
    { name: "PROBIOTICS", value: "10 BILLION CFU" }
  ]
    ;

  return (
    <div className="nutrition-section">

      <div className="nutrition-left">
        <h1 className="nutrition-title">
        FOUR IN ONE COMBO  <br />
        FOR COMPLETE DAILY SUPPORTS
        </h1>


        <p className="nutrition-desc">
          Everything your body needs  simplified into one daily routine.
          .
        </p>

        <div className="nutrition-table">
          {data.map((item, index) => (
            <div key={index} className="nutrition-row">
              <span>{item.name}</span>
              {/* <span>{item.value}</span> */}
            </div>
          ))}
        </div>
      </div>

      <div className="nutrition-right">
        <img src={scoop} alt="AG1 scoop" />
      </div>

    </div>
  );
}

export default NutritionalPanel;
