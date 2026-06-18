import logo from "../../assets/images/university.png";
const degreePrograms = [
  {
    university: "University of London",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/13/University_of_London_coat_of_arms.svg",
    degree: "Bachelor of Science in Computer Science",
    description:
      "Build the foundation for a career in tech with core math, data, and programming skills and specialise in cutting-edge topics such as ML and AI or UX.",
    deadline: "Application due March 16, 2026",
  },
  {
    university: "University of Illinois Urbana-Champaign",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Illinois_Fighting_Illini_logo.svg",
    degree: "Master of Business Administration (iMBA)",
    description:
      "Boost your career and design a journey that fits your goals with focus areas in analytics, marketing, innovation and more.",
    deadline: "Application due January 15, 2026",
    featured: true,
  },
  {
    university: "University of Colorado Boulder",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/University_of_Colorado_Boulder_seal.svg",
    degree: "Master of Science in Data Science",
    description:
      "Build data science skills blending CS, stats, and business; go beyond models to turn data into insights and decisions with real-world impact at scale.",
    deadline: "Application due February 20, 2026",
  },
];

const DegreeCard = ({ program }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-[#e6ebf2] p-6 transition`}
    >
     <div className="flex justify-center items-center mb-2">
       {/* Logo */}
      <img
        src={logo}
        alt={program.university}
        className="h-[120px] object-contain"
      />
     </div>

      {/* University */}
      <p className="text-[13px] text-gray-600 mb-2">
        {program.university}
      </p>

      {/* Degree */}
      <h3 className="text-[16px] font-semibold text-[#1f1f1f] mb-3">
        {program.degree}
      </h3>

      {/* Description */}
      <p className="text-[13px] text-gray-700 leading-relaxed mb-6">
        {program.description}
      </p>

      {/* Deadline */}
      <p className="text-[11px] text-gray-500">
        {program.deadline}
      </p>
    </div>
  );
};

const DegreeProgressSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* LEFT CONTENT */}
        <div className="lg:col-span-1">
          <h2 className="text-[28px] font-bold text-[#1f1f1f] mb-4 mt-[64px]">
            Start making progress toward a degree today
          </h2>

          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Discover flexible degree pathways that enable you to build new
            skills and gain career certificates while making progress and
            earning credit toward eligible degree programs.
          </p>

          <p className="text-xs text-gray-500 leading-relaxed">
            Each university determines the number of pre-approved credits that
            may count towards the degree requirements according to institutional
            policies.
          </p>
        </div>

        {/* RIGHT CARDS */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {degreePrograms.map((program, index) => (
            <DegreeCard key={index} program={program} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DegreeProgressSection;
