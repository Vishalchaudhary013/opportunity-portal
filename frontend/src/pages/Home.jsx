

import { Link } from "react-router-dom";
import Internship from "../components/cards/Internship";
import GlobalProgram from "../components/cards/GlobalProgram";


import Hero from "../components/Hero";

const Home = () => {
  

  return (
    <>

      <Hero />
     
      <Internship limit={4} />
      <GlobalProgram limit={4} />
    </>
  );
};

export default Home;
