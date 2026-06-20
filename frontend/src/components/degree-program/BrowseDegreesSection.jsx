const programLevels = [
  "Bachelor's Degrees",
  "Master's Degrees",
  "Integrated UG + PG",
  "Doctoral Programs",
];

const categories = [
  "Business & Management",
  "Computer Science & IT",
  "Data Science & AI",
  "Design & Creative Studies",
  "Engineering & Technology",
  "Healthcare & Life Sciences",
  "Global & Study Abroad Programs",
];

const Card = ({ title, showCurve = false }) => {
  return (
    <div
      className="
        relative
        overflow-hidden
        bg-[#f2f7ff]
        border border-[#e6ebf2]
        rounded-xl
        text-[17px]
        font-[600]
        p-[30px]
        min-h-[88px]
        flex
        items-center
        text-[#1f1f1f]
        transition-all
        duration-200
        hover:-translate-y-[2px]
        hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)]
        cursor-pointer
      "
    >
      {/* RIGHT CURVED DECORATION — ONLY IF showCurve */}
      {showCurve && (
        <div
          className="
            absolute
            -right-16
            -top-10
            w-[260px]
            h-[260px]
            rounded-full
            bg-gradient-to-br
            from-[#dbe7ff]
            to-transparent
            opacity-60
            pointer-events-none
          "
        />
      )}

      {/* TEXT */}
      <span className="relative z-10">{title}</span>
    </div>
  );
};


const BrowseDegreesSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-4">

        <h2 className="text-[22px] font-semibold text-[#1f1f1f] mb-6">
          Browse by program level
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {programLevels.map((level) => (
            <Card key={level} title={level} showCurve />
          ))}
        </div>


        {/* ===== BROWSE BY CATEGORY ===== */}
        <h2 className="text-[22px] font-semibold text-[#1f1f1f] mb-6">
          Browse by category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category} title={category} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default BrowseDegreesSection;
