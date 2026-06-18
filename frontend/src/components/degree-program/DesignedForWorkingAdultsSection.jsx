import WorkingAdultProgramCard from "./WorkingAdultProgrammingCard";
const DesignedForWorkingAdultsSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-1">
            <h2 className="text-[22px] font-semibold text-[#1f1f1f] mb-4 mt-[102px]">
              Designed for working adults
            </h2>

            <p className="text-[14px] text-gray-700 leading-relaxed">
              Enroll in flexible, 100% online degree programs. Set your
              own schedule to balance your work and personal commitments
              and complete coursework at your own pace.
            </p>
          </div>

          {/* RIGHT CARDS */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            <WorkingAdultProgramCard
              university="IIT Roorkee"
              title="Executive MBA"
              description="Shape your IIT Roorkee MBA with 55+ electives. Dual specialisations, Top 10 in India (NIRF 2025)."
            />

            <WorkingAdultProgramCard
              university="O.P. Jindal Global University"
              title="M.A. in International Relations, Security, and Strategy"
              description="Learn from former ambassadors, diplomats & policymakers that shaped global affairs. Gain expertise in geopolitics, diplomacy & security strategy."
              deadline="Application due March 31, 2026"
            />

            <WorkingAdultProgramCard
              university="O.P. Jindal Global University"
              title="Bachelor of Science in Psychology"
              description="Understand the human mind and shape meaningful change in work, health, and society. Build a foundation in psychology for purpose-driven careers."
              deadline="Application due January 31, 2026"
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignedForWorkingAdultsSection;
