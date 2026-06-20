import { useEffect, useRef, useState } from "react";
import MainHeader from "../components/degree page/MainHeader";
import StickyDegreeHeader from "../components/degree page/StickyDegreeHeader";
import Footer from "../components/Footer";
import DegreesFilterSection from "../components/degree page/DegreesFilterSection";
import BrowseDegreesSection from "../components/degree page/BrowseDegreesSection";
import LearnFromFaculty from "../components/LearnFromFaculty";
import DegreeInsightsSection from "../components/DegreeInsightsSection";
import StudentTestimonialSection from "../components/StudentTestimonialSection";
import DegreeProgressSection from "../components/DegreeProgressSection";
import AdmissionWithoutApplication from "../components/degree page/AdmissionWithoutApplication";
import AffordableTuitionSection from "../components/degree page/AffordableTuitionSection";
import QualityLearningSection from "../components/degree page/QualityLearningSection";
import DesignedForWorkingAdultsSection from "../components/degree page/DesignedForWorkingAdultsSection";
import EdecoFaq from "../sections/EdecoFaq";

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
      <MainHeader />

      {/* HERO BANNER */}
      <section
        ref={bannerRef}
        className="bg-[#0b2d5b] text-white py-20"
      >
        <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-4">
          <h1 className="text-[40px] font-semibold">
            Take your career to the next level with an online degree
          </h1>
        </div>
      </section>

      {/* STICKY HEADER (appears on scroll) */}
      <StickyDegreeHeader visible={showStickyHeader} />

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
      <Footer />
    </>
  );
};

export default DegreePage;
