import { FaLongArrowAltRight } from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import { TbQuestionMark } from "react-icons/tb";
import { Link } from "react-router-dom";

const SectionTitle = ({ title, subtitle , defination, viewAllLink = "/intership" }) => (
  <>

    {/* Title Section */}
    <div className="relative mb-2">
      {/* Subtle Background Glow & Floating Shapes */}
      {/* <div className="absolute -inset-y-6 -left-8 w-64 h-32 bg-gradient-to-r from-[#00A9E0]/10 to-transparent rounded-[100%] blur-2xl pointer-events-none -z-10"></div> */}
      
      {/* Delicate floating accents (like the original orbs, but refined) */}
      {/* <div className="absolute -top-2 -left-2 w-2 h-2 bg-[#00A9E0] rounded-full opacity-30 -z-10 animate-pulse"></div>
      <div className="absolute -bottom-3 left-1/4 w-2.5 h-2.5 border-[1.5px] border-red-400 rounded-full opacity-30 -z-10"></div> */}

      <div className="flex justify-between items-start relative z-10">
        <div className="leading-10">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[28px] font-[650] text-[#1F2853] leading-snug ">
              {title}
            </h2>
          {defination && (
            <div className="relative group inline-flex items-center">
              <span className="inline-flex items-center justify-center w-[20px] h-[20px] bg-white border border-gray-200 shadow-sm rounded-full cursor-help text-gray-500 hover:text-gray-800 transition-colors">
                <TbQuestionMark size={14} />
              </span>

              <div
                className="
                  absolute left-full -top-1.5 -translate-y-1/2 ml-3
                  w-max max-w-[700px]
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  scale-95 group-hover:scale-100
                  transition-all duration-300 origin-left
                  bg-white text-gray-700 text-[13.5px] font-normal leading-relaxed px-4 py-3 
                  rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                  border border-gray-100
                  z-50
                "
              >
                
                <div className="absolute top-1/2 -left-[5px] -translate-y-1/2 w-[10px] h-[10px] bg-white border-l border-b border-gray-100 transform rotate-45 rounded-[1px]"></div>
                <span className="relative z-10">{defination}</span>
              </div>
            </div>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[16px] md:text-[18px] text-gray-600 font-normal">
            {subtitle}
          </p>
        )}
      </div>

      <div>

        <Link
          to={viewAllLink}
          className="flex border-2 items-center py-0.5 px-4 gap-2 rounded-lg border-[#1F2853] "
        >
          <div className="font-medium  text-[#1F2853]     ">
            View All
          </div>
          
          <span>
            <GoArrowRight size={18} className="text-[#1F2853]" />
          </span>
        </Link>

        

      </div>
      </div>
    </div>
  </>
);

export default SectionTitle;


