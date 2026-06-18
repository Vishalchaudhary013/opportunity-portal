import universityLogo from "../../assets/logos/universityLogo.png";
import { Clock, IndianRupee } from "lucide-react";

const DegreeCard = ({ degree }) => {
  return (
    <div
      className="
        relative
        bg-white
        border border-[#e6ebf2]
        rounded-2xl
        px-[14px]
        py-[20px]
        h-[347px]
        flex
        flex-col
        transition-all
        duration-200
        hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]
        hover:-translate-y-[2px]
      "
    >
      {/* DEGREE TYPE BADGE */}
      <span
        className="
          absolute
          top-3
          right-3
          text-[11px]
          font-medium
          px-3
          py-[4px]
          rounded-full
          bg-[#eef4ff]
          text-[#2563eb]
        "
      >
        {degree.degreeType}
      </span>

      {/* LOGO */}
      <div className="h-[125px] flex items-center justify-center mb-[20px]">
        <img
          src={universityLogo}
          alt={degree.university}
          className="max-h-full max-w-[160px] object-contain"
        />
      </div>

      {/* UNIVERSITY */}
      <p className="text-[13px] text-[#6d7785] mb-1 leading-snug h-[25px] overflow-hidden">
        {degree.university}
      </p>

      {/* DEGREE TITLE */}
      <h3 className="text-[14px] font-semibold text-[#1f1f1f] mb-0 h-[35px] overflow-hidden">
        {degree.title}
      </h3>

      {/* DURATION & FEES */}
      <div className="space-y-2 mb-[14px]">
        <div className="flex items-center gap-2 text-[13px] text-[#4a5568]">
          <Clock size={14} />
          <span>{degree.duration}</span>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-[#4a5568]">
          <i class="bi bi-wallet"></i>
          <span>{degree.fees}</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto">
        <p className="text-[13px] text-[#6d7785]">
          Application deadline {degree.deadline}
        </p>
      </div>
    </div>
  );
};

export default DegreeCard;
