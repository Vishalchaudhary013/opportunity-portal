import { useEffect, useRef, useState } from "react";
import StickyDegreeHeader from "../components/degree-program/StickyDegreeHeader";
import Footer from "../components/Footer";
import DegreesFilterSection from "../components/degree-program/DegreesFilterSection";
import BrowseDegreesSection from "../components/degree-program/BrowseDegreesSection";

import DegreeInsightsSection from "../components/degree-program/DegreeInsightsSection";
import StudentTestimonialSection from "../components/degree-program/StudentTestimonialSection";
import DegreeProgressSection from "../components/degree-program/DegreeProgressSection";
import AdmissionWithoutApplication from "../components/degree-program/AdmissionWithoutApplication";
import AffordableTuitionSection from "../components/degree-program/AffordableTuitionSection";
import QualityLearningSection from "../components/degree-program/QualityLearningSection";
import DesignedForWorkingAdultsSection from "../components/degree-program/DesignedForWorkingAdultsSection";

import LearnFromFaculty from "../components/degree-program/LearnFromFaculty";
import EdecoFaq from "../components/sections/EdecoFaq";
import Master from "../components/degree-program/section/Master";
import Bachlor from "../components/degree-program/section/Bachlor";
import Phd from "../components/degree-program/section/Phd";
import IntegratedDegreesSection from "../components/degree-program/section/IntegratedDegreesSection";

const DegreePage = () => {
  const bannerRef = useRef(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [activeLevel, setActiveLevel] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (!bannerRef.current) return;

      const bannerBottom =
        bannerRef.current.getBoundingClientRect().bottom;

      // when banner scrolls out of view
      setShowStickyHeader(bannerBottom <= 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>


      {/* HERO BANNER */}
      <section
        ref={bannerRef}
        className="bg-[#0b2d5b] text-white py-20 mt-10"
      >
        <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-4 text-center ">
          <h1 className="text-3xl md:text-[40px] font-semibold md:leading-tight mb-4">
            Find Your Future: Explore Our Degree Programs
          </h1>
          <h3 className="text-2xl md:text-[30px] font-semibold md:leading-tight mb-4">Your Goals. Your Pace. Your Degree</h3>
          {/* <h5 className="text-xl md:text-[20px] font-semibold md:leading-tight mb-4">Higher education, reinvented for your lifestyle</h5> */}
          
        </div>
      </section>

      {/* STICKY HEADER (appears on scroll) */}
      {/* <StickyDegreeHeader visible={showStickyHeader} /> */}

      
      <DegreesFilterSection onLevelChange={setActiveLevel}>
        {(!activeLevel || activeLevel === "Masters" || activeLevel === "MBA") && <Master />}
        {(!activeLevel || activeLevel.includes("Bachelor") || activeLevel.includes("UG Degree")) && <Bachlor />}
        {(!activeLevel || activeLevel === "Doctoral (PhD)") && <Phd />}
        {(!activeLevel || activeLevel.includes("Integrated")) && <IntegratedDegreesSection />}
      </DegreesFilterSection>

      {/* <BrowseDegreesSection /> */}
      {/* <DegreeProgressSection />
      <AdmissionWithoutApplication />
      <AffordableTuitionSection /> */}
      {/* <QualityLearningSection />
      <DesignedForWorkingAdultsSection />
      <StudentTestimonialSection />
      <LearnFromFaculty />
      <DegreeInsightsSection /> */}
      <EdecoFaq />
      {/* <Footer/> */}
    </>
  );
};

export default DegreePage;
