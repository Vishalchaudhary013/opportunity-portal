

import { Link } from "react-router-dom";
import Internship from "../components/cards/Internship";
import GlobalProgram from "../components/cards/GlobalProgram";


import Hero from "../components/Hero";
import UniversityMarquee from "../components/cards/UniversityMarquee";
import Testimonials from "../components/Testimonials";
import Facebook from "../components/Facebook";

import Linkedinn from "../components/Linkedinn";

const Home = () => {
  

  return (
    <>
    <div className="">
<Hero />

      <UniversityMarquee />
     
      <Internship limit={4} />
      <GlobalProgram limit={4} />

      <Testimonials />

      <Facebook />

      <Linkedinn />
    </div>

      
    </>
  );
};

export default Home;
