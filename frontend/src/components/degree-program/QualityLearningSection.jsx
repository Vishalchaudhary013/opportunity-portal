import WorldClassUniversityCard from "./WorldClassUniversityCard";

const QualityLearningSection = () => {
  return (
    <section className="bg-[#f5f7fa] py-16">
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-1">
            <h2 className="text-[22px] font-semibold text-[#1f1f1f] mb-4 mt-[84px]">
              Quality learning from world-class universities
            </h2>

            <p className="text-[14px] text-gray-700 leading-relaxed">
              Unlock your potential and pave the way to a successful
              career by earning a degree from an accredited university.
              Learn from expert faculty passionate about helping you
              achieve your goals.
            </p>
          </div>

          {/* RIGHT CARDS */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            <WorldClassUniversityCard
              university="Birla Institute of Technology & Science, Pilani"
              title="Bachelor of Science in Computer Science"
              description="Build the foundation for a career in tech. Learn coding, data, and problem-solving skills while earning degree-level credentials, fully online."
              deadline="Application due January 31, 2026"
            />

            <WorldClassUniversityCard
              university="Indian Institute of Technology Guwahati"
              title="Bachelor of Science in Data Science & AI"
              description="Become an IITian from wherever you are. Build a career in AI and data science with IIT Guwahati."
              deadline="Application due January 30, 2026"
            />

            <WorldClassUniversityCard
              university="University of Huddersfield"
              title="BSc Data Science"
              description="Launch your data science career with a world-class curriculum from the UK’s top-ranked young university. Learn to analyze, model, and visualize data."
              deadline="Application due January 30, 2026"
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default QualityLearningSection;
