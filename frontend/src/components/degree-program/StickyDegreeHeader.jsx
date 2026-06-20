// src/components/DegreesTopBar.jsx
import mainLogo from "../../assets/images/mainLogo.jpeg";

const StickyDegreeHeader = ({ visible }) => {
  return (
    <div
      className={`
        fixed top-0 left-0 w-full z-[60]
        bg-[#f5f7fa] border-b border-gray-200
        transition-transform duration-300 ease-out
        ${visible ? "translate-y-0 shadow-md" : "-translate-y-full"}
      `}
    >
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto px-4 h-[64px] flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-[35px]">
          <h2 className="text-[34px] font-[700] text-[#0056d2]">edeco</h2>

          <span className="text-[20px] font-semibold text-gray-900 whitespace-nowrap">
            Take your career to the next level with a degree
          </span>
        </div>

        {/* RIGHT */}
        <button className="bg-[#0056d2] text-white text-sm font-medium px-5 py-[10px] rounded-lg hover:bg-[#0047b3] transition">
          Email Me Info
        </button>
      </div>
    </div>
  );
};

export default StickyDegreeHeader;
