import React, { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { ImPower } from "react-icons/im";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import ApplicationFormModal from "../form/ApplicationFormModal";
import { useOpportunities } from "../../context/OpportunitiesContext";

const GlobalProgram = ({ limit }) => {
  const navigate = useNavigate();
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const { opportunities, user } = useOpportunities();
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
                className="flex h-full flex-col rounded-xl border border-black/10 p-5 group hover:shadow hover:transition hover:scale-101"
              >
                <div className="flex-1">
                  <ul className="mb-5 flex min-w-0 items-start gap-3">
                    <li>
                      <img
                        src={data.logo}
                        alt=""
                        className="h-10 w-10 rounded-lg"
                      />
                    </li>
                    <li className="min-w-0 leading-4.5">
                      <h3 className="wrap-break-word text-[15.5px] font-medium group-hover:text-[#155DFC]">
                        {data.title}
                      </h3>
                      <span className="wrap-break-word text-[14.5px] font-medium text-black/65">
                        {data.company}
                      </span>
                    </li>
                  </ul>

                  <div className="mb-3 grid grid-cols-1 gap-x-2 gap-y-2 text-[14px] font-medium text-black/55 sm:grid-cols-2 sm:text-[14.5px]">
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

                  <div className="mb-3 flex items-center gap-4">
                    <ImPower
                      size={10}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 p-2"
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

                  <div className="mb-6 flex items-center gap-4">
                    <HiOutlineShieldCheck className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 p-2" />
                    <ul>
                      <li className="text-[14.5px] font-medium text-black/55">
                        Eligibility
                      </li>
                      <li className="text-sm font-medium">{data.eligibility}</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-auto flex w-full rounded-xl bg-slate-900 font-medium text-base text-white transition hover:bg-slate-800 sm:text-xl">
                  <button
                    className="flex w-full items-center justify-center gap-2 px-4 py-3"
                    onClick={() => {
                      if (!user) {
                        navigate("/signup");
                      } else {
                        setSelectedOpportunity(data);
                      }
                    }}
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
