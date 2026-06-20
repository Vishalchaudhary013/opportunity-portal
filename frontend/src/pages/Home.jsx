import { Link } from "react-router-dom";
import Internship from "../components/cards/Internship";
import GlobalProgram from "../components/cards/GlobalProgram";

import Hero from "../components/Hero";
import UniversityMarquee from "../components/cards/UniversityMarquee";
import Testimonials from "../components/Testimonials";
import Facebook from "../components/Facebook";

import Linkedinn from "../components/Linkedinn";
import ExploreCareersSection from "../components/sections/ExploreCareerSection";
import Bootcamps from "../components/sections/Bootcamps";

import Instagram from "../components/Instagram";

import Jobs from "../components/sections/Jobs";

import Category from "../components/Category";
import Apprenticeships from "../components/sections/Apprenticeships";
import Mentorships from "../components/sections/Mentorships";
import CertificatePrograms from "../components/sections/CertificatePrograms";
import PostGraduatePrograms from "../components/sections/PostGraduatePrograms";
import MastersDegrees from "../components/sections/MastersDegrees";
import IntegratedDegrees from "../components/sections/IntegratedDegrees";

const Home = () => {
  return (
    <>
      <div className="">
        <Hero />
        <Category />
        {/* <UniversityMarquee /> */}
        <Internship limit={4} />
        <Apprenticeships />
        <Jobs />
        {/* <ExploreCareersSection /> */}
        <Mentorships />
        <Bootcamps />
        <CertificatePrograms />
        <PostGraduatePrograms />
        <MastersDegrees />
        <IntegratedDegrees />
        
        <GlobalProgram limit={4} />
        <Testimonials />
        {/* <Facebook /> */}
        <Linkedinn />
        <Instagram />
      </div>
    </>
  );
};

export default Home;
