// ROW 1 LOGOS
import logo1 from "../../assets/logos/logo1.png";
import logo2 from "../../assets/logos/logo2.png";
import logo3 from "../../assets/logos/logo3.png";
import logo4 from "../../assets/logos/logo4.png";
import logo5 from "../../assets/logos/logo5.png";
import logo6 from "../../assets/logos/logo6.png";
import logo7 from "../../assets/logos/logo7.png";
import logo8 from "../../assets/logos/logo8.png";

// ROW 2 LOGOS
import logo9 from "../../assets/logos/logo9.png";
import logo10 from "../../assets/logos/logo10.png";
import logo11 from "../../assets/logos/logo11.png";
import logo12 from "../../assets/logos/logo12.png";
import logo13 from "../../assets/logos/logo13.jpg";
import logo14 from "../../assets/logos/logo14.png";
import logo15 from "../../assets/logos/logo15.png";
import logo16 from "../../assets/logos/logo16.png";

const row1 = [
  logo1, logo2, logo3, logo4,
  logo5, logo6, logo7, logo8,
];

const row2 = [
  logo9, logo10, logo11, logo12,
  logo13, logo14, logo15, logo16,
];

// LOGO CARD
const LogoCard = ({ src }) => {
  return (
    <div
      className="
        w-[160px] h-[80px]
        border border-gray-200
        rounded-xl bg-white
        flex items-center justify-center
        shrink-0
      "
    >
      <img
        src={src}
        alt="logo"
        className="w-[68px] h-[60px] object-cover"
      />
    </div>
  );
};

const UniversityMarquee = () => {
  return (
   <>
   <div className="w-[1350px] mx-auto">
     <section className="pb-16 overflow-hidden">
      <h3 className="text-xl font-semibold mb-6">
        Learn from leading universities and companies
      </h3>

      {/* ROW 1 → */}
      <div className="overflow-hidden mb-4">
        <div className="flex gap-4 min-w-full w-max animate-right">
          {[...row1, ...row1].map((logo, i) => (
            <LogoCard key={`row1-${i}`} src={logo} />
          ))}
        </div>
      </div>

      {/* ROW 2 ← */}
      <div className="overflow-hidden">
        <div className="flex gap-4 min-w-full w-max animate-left">
          {[...row2, ...row2].map((logo, i) => (
            <LogoCard key={`row2-${i}`} src={logo} />
          ))}
        </div>
      </div>
    </section>
   </div>
   </>
  );
};

export default UniversityMarquee;

