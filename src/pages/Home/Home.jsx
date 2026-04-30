
import Categories from "../../components/Categories/Categories";
import BestSellers from "../../components/BestSellers/BestSellers";

import ComboPacks from "../../components/ComboPacks/ComboPacks";
import SweetLegacy from "../../components/SweetLegacy/SweetLegacy";
// import TimelessDelights from "../../components/TimelessDelights/TimelessDelights";
import Testimonials from "../../components/Testimonials/Testimonials";
import Banner from "../../components/Banner/Banner";
import FAQ from "../../components/FAQ/FAQ";
import LogoSlider from "../../components/LogoSlider/LogoSlider";
import IngredientsSection from "../../components/IngredientsSection/IngredientsSection";
import NutritionalPanel from "../../components/NutritionalPanel/NutritionalPanel";


export default function Home() {
  return (
    <>

      <Banner />
      <LogoSlider />

      <Categories />
      <SweetLegacy />

      <BestSellers />
      <ComboPacks />
      <NutritionalPanel/>
      {/* <TimelessDelights /> */}
<IngredientsSection/>
      <Testimonials />

      <FAQ />

    </>
  );
}
