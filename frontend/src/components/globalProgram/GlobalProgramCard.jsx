import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { CiLocationOn, CiCalendar } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { ImPower } from "react-icons/im";
import { HiOutlineShieldCheck } from "react-icons/hi2";

const GlobalProgramCard = ({ data, onApply }) => {
  return (
    <div
      key={data.id}
      className="p-5 border border-black/10 rounded-xl group hover:shadow hover:transition hover:scale-101"
    >
      <ul className="flex gap-3 items-start mb-5 min-w-0">
        <li>
          <img
            src={data.logo}
            alt=""
            className="h-10 w-10 rounded-lg"
          />
        </li>
        <li className="leading-4.5 min-w-0">
          <h3 className="text-[15.5px] font-medium group-hover:text-[#155DFC] wrap-break-word">
            {data.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[14.5px] font-medium text-black/65 wrap-break-word">
              {data.company}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-bold uppercase tracking-wider border border-blue-100 whitespace-nowrap">
              {data.programType || "Global Program"}
            </span>
          </div>
        </li>
      </ul>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-2 text-[14px] sm:text-[14.5px] mb-3 font-medium text-black/55">
        <div className="flex items-center gap-1 ">
          <CiLocationOn />
          <span className="truncate">{data.location}</span>
        </div>

        <div className="flex items-center gap-1">
          <IoMdTime />
          {data.duration}
        </div>

        <div className="flex items-center gap-1">
          <MdAttachMoney />
          {data.stipend}
        </div>

        <div className="flex items-center gap-1 ">
          <CiCalendar />
          {new Date(data.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <ImPower
          size={10}
          className="w-9 h-9 rounded-lg p-2 flex items-center justify-center bg-black/5"
        />
        <ul>
          <li className="text-[14.5px] font-medium text-black/55">
            Program Category
          </li>
          <li className="text-[16px] font-medium">
            {data.programType || "Not specified"}
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <HiOutlineShieldCheck className="w-9 h-9 rounded-lg p-2 flex items-center justify-center bg-black/5" />
        <ul>
          <li className="text-[14.5px] font-medium text-black/55">
            Eligibility
          </li>
          <li className="text-sm font-medium">
            {data.eligibility || "Not specified"}
          </li>
        </ul>
      </div>

      <div className="flex bg-slate-900 font-medium text-base sm:text-xl rounded-xl text-white justify-center py-2">
        <button
          className="flex gap-2 items-center"
          onClick={() => onApply(data)}
        >
          Apply Now <FaLongArrowAltRight />
        </button>
      </div>
    </div>
  );
};

export default GlobalProgramCard;
