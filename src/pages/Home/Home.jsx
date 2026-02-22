
import Categories from "../../components/Categories/Categories";
import BestSellers from "../../components/BestSellers/BestSellers";

import ComboPacks from "../../components/ComboPacks/ComboPacks";
import SweetLegacy from "../../components/SweetLegacy/SweetLegacy";
import TimelessDelights from "../../components/TimelessDelights/TimelessDelights";
import RoyalBites from "../../components/RoyalBites/RoyalBites";
import ShopByCollection from "../../components/ShopByCollection/ShopByCollection";
import HeritageStory from "../../components/HeritageStory/HeritageStory";
import Testimonials from "../../components/Testimonials/Testimonials";
import ProcessVideos from "../../components/ProcessVideos/ProcessVideos";
import Banner from "../../components/Banner/Banner";
import FAQ from "../../components/FAQ/FAQ";


export default function Home() {
  return (
    <>
    
      <Banner />
      <Categories />
      <BestSellers />
        <ComboPacks />
        <SweetLegacy />
        <TimelessDelights /> 
        {/* <RoyalBites /> */}
        {/* <ShopByCollection /> */}
        <HeritageStory /> 
        <Testimonials />
        <ProcessVideos />
        <FAQ />
      
    </>
  );
}
