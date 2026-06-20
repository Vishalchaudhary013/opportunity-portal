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
import EdecoFaq from "../components/EdecoFaq";
import LearnFromFaculty from "../components/degree-program/LearnFromFaculty";

const DegreePage = () => {
  const bannerRef = useRef(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

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
        className="bg-[#0b2d5b] text-white py-20"
      >
        <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-4">
          <h1 className="text-3xl md:text-[40px] font-semibold md:leading-tight">
            Take your career to the next level with an online degree
          </h1>
        </div>
      </section>

      {/* STICKY HEADER (appears on scroll) */}
      {/* <StickyDegreeHeader visible={showStickyHeader} /> */}

      {/* DEGREE LIST */}
      <DegreesFilterSection />
      <BrowseDegreesSection />
      <DegreeProgressSection />
      <AdmissionWithoutApplication />
      <AffordableTuitionSection />
      <QualityLearningSection />
      <DesignedForWorkingAdultsSection />
      <StudentTestimonialSection />
      <LearnFromFaculty />
      <DegreeInsightsSection />
      <EdecoFaq />
      {/* <Footer/> */}
    </>
  );
};

export default DegreePage;
