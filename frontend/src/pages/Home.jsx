

import { Link } from "react-router-dom";
import Internship from "../components/cards/Internship";
import GlobalProgram from "../components/cards/GlobalProgram";


import Hero from "../components/Hero";
import UniversityMarquee from "../components/cards/UniversityMarquee";

const Home = () => {
  

  return (
    <>
    <div className="bg-[]">
<Hero />

      <UniversityMarquee />
     
      <Internship limit={4} />
      <GlobalProgram limit={4} />
    </div>

      
    </>
  );
};

export default Home;
