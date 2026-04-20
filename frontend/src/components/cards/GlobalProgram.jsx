import React, { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { ImPower } from "react-icons/im";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import ApplicationFormModal from "../form/ApplicationFormModal";
import { useOpportunities } from "../../context/OpportunitiesContext";

const GlobalProgram = ({ limit }) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const { opportunities } = useOpportunities();
  const globalData = opportunities.filter(
    (item) => item.type === "Global Program",
  );
  const visibleGlobalPrograms =
    typeof limit === "number" ? globalData.slice(0, limit) : globalData;
  return (
    <>
      <div>
        <div className="w-full max-w-350 mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-10">
            <ul>
              <li className="text-2xl font-semibold">Global Programs</li>
              <li className="text-xl font-medium">
                Prestigious Global Programs
              </li>
            </ul>

            <ul>
              <li>
                <Link
                  to="/global-program"
                  className="font-medium flex gap-2 items-center text-slate-900  hover:underline"
                >
                  View All Global Programs
                  <FaLongArrowAltRight />
                </Link>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {visibleGlobalPrograms.map((data) => (
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
                    <span className="text-[14.5px] font-medium text-black/65 wrap-break-word">
                      {data.company}
                    </span>
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
                      {data.programType}
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <HiOutlineShieldCheck className="w-9 h-9 rounded-lg p-2 flex items-center justify-center bg-black/5" />
                  <ul>
                    <li className="text-[14.5px] font-medium text-black/55">
                      Eligibility
                    </li>
                    <li className="text-sm font-medium">{data.eligibility}</li>
                  </ul>
                </div>
                <div className="flex bg-slate-900 font-medium text-base sm:text-xl rounded-xl text-white justify-center py-2">
                  <button
                    className="flex gap-2 items-center"
                    onClick={() => setSelectedOpportunity(data)}
                  >
                    Apply Now <FaLongArrowAltRight />{" "}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ApplicationFormModal
        isOpen={Boolean(selectedOpportunity)}
        opportunityTitle={selectedOpportunity?.title}
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </>
  );
};

export default GlobalProgram;
