import AdmissionPathwayCard from "./AdmissionPathwayCard";

const AdmissionWithoutApplication = () => {
  return (
    <section className="bg-[#f5f7fa] py-16">
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-1">
            <h2 className="text-[22px] font-semibold text-[#1f1f1f] mb-4 mt-[38px]">
              Gain admission without an application
            </h2>

            <p className="text-[14px] text-gray-700 leading-relaxed mb-4">
              Complete university-approved content to qualify for
              performance-based admission to select degree programs
              and earn credit toward your degree. No application or
              prior work experience is required to start these degree
              pathways.
            </p>

            <p className="text-[13px] text-gray-600 leading-relaxed">
              Each university determines the grades required to qualify
              for performance-based admission. Review the admissions
              process for each degree program for more information.
            </p>
          </div>

          {/* RIGHT CARDS */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            <AdmissionPathwayCard
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/University_of_Colorado_logo.svg/2560px-University_of_Colorado_logo.svg.png"
              university="University of Colorado Boulder"
              title="Master of Engineering in Engineering Management"
              description="Turn technical expertise into leadership excellence with a flexible, industry-connected master’s from a top 20 engineering school."
              deadline="Application due February 20, 2026"
            />

            <AdmissionPathwayCard
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/University_of_Colorado_logo.svg/2560px-University_of_Colorado_logo.svg.png"
              university="University of Colorado Boulder"
              title="Master of Science in Data Science"
              description="Build data science skills blending CS, stats, and business; go beyond models to turn data into insights and decisions with real-world impact at scale."
              deadline="Application due February 20, 2026"
            />

            <AdmissionPathwayCard
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Illinois_Tech_logo.svg/2560px-Illinois_Tech_logo.svg.png"
              university="Illinois Tech"
              title="Master of Business Administration"
              description="Advance your career in leadership, strategy, and analytics through a hands-on, performance-focused pathway. No application required."
              deadline="Application due January 20, 2026"
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionWithoutApplication;
