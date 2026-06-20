import TuitionProgramCard from "./TuitionProgramCard";
const AffordableTuitionSection = () => {
  return (
    <section className="py-16">
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-1">
            <h2 className="text-[22px] font-semibold text-[#1f1f1f] mb-4 mt-[90px]">
              Affordable tuition with flexible payment options
            </h2>

            <p className="text-[14px] text-gray-700 leading-relaxed">
              Pursue your degree with affordable tuition, flexible payment
              options that let you pay as you go, and financial aid
              opportunities, including scholarships.
            </p>
          </div>

          {/* RIGHT CARDS */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            <TuitionProgramCard
              logos={[
                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Illinois_Fighting_Illini_logo.svg/1024px-Illinois_Fighting_Illini_logo.svg.png",
              ]}
              university="University of Illinois Urbana-Champaign"
              title="Master of Science in Management (iMSM)"
              description="Launch your management career with essential leadership skills and career-ready credentials. Earn your master’s degree in just 12 months."
              deadline="Application due January 15, 2026"
            />

            <TuitionProgramCard
              logos={[
                "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/University_of_London_logo.svg/2560px-University_of_London_logo.svg.png",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Royal_Holloway_University_of_London_logo.svg/2560px-Royal_Holloway_University_of_London_logo.svg.png",
              ]}
              university="University of London"
              title="Master of Science in Cyber Security"
              description="Master CISO-ready cybersecurity skills with hands-on labs and case studies, covering security, cryptography, and more from a leading UK university."
              deadline="Application due March 16, 2026"
            />

            <TuitionProgramCard
              logos={[
                "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/University_of_Colorado_logo.svg/2560px-University_of_Colorado_logo.svg.png",
              ]}
              university="University of Colorado Boulder"
              title="Master of Science in Data Science"
              description="Build data science skills blending CS, stats, and business; go beyond models to turn data into insights and decisions with real-world impact at scale."
              deadline="Application due February 20, 2026"
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default AffordableTuitionSection;
