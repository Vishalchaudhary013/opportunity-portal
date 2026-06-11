const SectionTitle = ({ title, subtitle }) => (
  <div className="relative md:flex-row mb-[5px] border-l-4 border-[#0056D2] rounded-[6px] py-[3px] px-[13px]">
    {/* <div className="absolute -top-5 left-1/4 w-5 h-5 bg-blue-900 rounded-full opacity-50 animate-pulse"></div>
    <div className="absolute -bottom-5 right-1/3 w-6 h-6 bg-blue-900 rounded-full opacity-40 animate-pulse"></div> */}

    {/* Title */}
    <h2 className="text-[25px] font-[700] text-black bg-clip-text leading-snug">
      {title}
    </h2>

    {/* Subtitle */}
    {subtitle && (
      <p className="text-[16px] md:text-[18px] text-gray-500 font-light">
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionTitle;


