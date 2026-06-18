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
import MasterClasses from "../components/sections/MasterClasses";
import Instagram from "../components/Instagram";
import DegreePrograms from "../components/sections/DegreePrograms";
import Jobs from "../components/sections/Jobs";

const Home = () => {
  return (
    <>
      <div className="">
        <Hero />
        <UniversityMarquee />
        <Internship limit={4} />
        <Jobs />
        {/* <ExploreCareersSection /> */}
        <MasterClasses />
        <Bootcamps />
        <DegreePrograms />
        <GlobalProgram limit={4} />
        <Testimonials />
        <Facebook />
        <Linkedinn />
        <Instagram />
      </div>
    </>
  );
};

export default Home;
