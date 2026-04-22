import React from "react";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useOpportunities } from "../../context/OpportunitiesContext";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { LuDot } from "react-icons/lu";
import { IoBagOutline } from "react-icons/io5";
import {
  formatDeadlineLabel,
  formatDeadlineStatus,
  formatStipendPeriod,
  formatStipendText,
  getInternshipTags,
  isInternshipOpen,
  resolveWorkMode,
} from "../../utils/internshipCardData";

const Internship = ({ limit }) => {
  const { opportunities, isInternshipSaved, toggleSavedInternship } =
    useOpportunities();
  const intershipData = opportunities.filter(
    (item) => item.type === "Internship" && isInternshipOpen(item),
  );
  const visibleInternships =
    typeof limit === "number" ? intershipData.slice(0, limit) : intershipData;
  return (
    <>
      <div className="bg-[#F8FAFC]">
        <div className="w-full max-w-350 mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-10">
            <ul>
              <li className="text-2xl font-semibold">Internships</li>
              <li className="text-xl font-medium">
                Top Internship Opportunities
              </li>
            </ul>

            <ul>
              <li>
                <Link
                  to="/intership"
                  className="font-medium flex gap-2 items-center text-slate-900 hover:underline"
                >
                  View All Internships
                  <FaLongArrowAltRight />
                </Link>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {visibleInternships.map((data) => (
              <Link
                to={`/internship/${data.id}`}
                key={data.id}
                className="py-4 px-3 border bg-white border-black/10 rounded-xl group hover:transition hover:scale-101"
              >
                {(() => {
                  const isSaved = isInternshipSaved(data.id);
                  return (
                <div className="flex justify-between gap-3 mb-5">
                  <ul className="flex items-center gap-3 min-w-0">
                    <li>
                      {data.logo ? (
                        <img
                          src={data.logo}
                          alt={data.company}
                          className="h-9 w-9 overflow-hidden rounded-lg"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-lg bg-black text-white font-semibold flex items-center justify-center">
                          {String(data.company || "I")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </li>
                    <li className="flex flex-col min-w-0">
                      <span className="text-sm text-blue-600 font-medium">
                        {data.company}
                      </span>
                      <span className="font-medium truncate">{data.title}</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleSavedInternship(data.id);
                    }}
                    aria-label={isSaved ? "Unsave internship" : "Save internship"}
                    title={isSaved ? "Saved" : "Save for later"}
                  >
                    {isSaved ? (
                      <BsBookmarkFill
                        size={22}
                        className="pt-0.5 text-[#0B4AA6]"
                      />
                    ) : (
                      <BsBookmark size={22} className="pt-0.5" />
                    )}
                  </button>
                </div>
                  );
                })()}

                <ul className="flex flex-wrap items-center gap-1.5 mb-3">
                  <li className="flex gap-1 items-center">
                    <span>
                      <CiLocationOn />
                    </span>
                    <span className="text-sm font-medium truncate max-w-42.5">
                      {data.location}
                    </span>
                  </li>

                  <li>
                    <LuDot />
                  </li>
                  <li className="flex gap-1 items-center">
                    <span>
                      <IoBagOutline />
                    </span>
                    <span className="text-sm font-medium">
                      {resolveWorkMode(data)}
                    </span>
                  </li>
                </ul>

                <div className="flex gap-2  flex-wrap mb-4">
                  {getInternshipTags(data).map((tag, i) => (
                    <span
                      key={i}
                      className="flex items-center justify-center bg-blue-100 text-blue-800 px-2 p-0.5 text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="border border-black/5 rounded-xl p-4 bg-white mb-6">
                  <p className="text-sm  font-medium uppercase">
                    Stipend 
                  </p>

                  <h2 className="text-lg font-semibold mt-1">
                    {formatStipendText(data)}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {formatStipendPeriod(data)}
                  </p>
                </div>

                <div className="flex items-start gap-1.5  ">
                  <CiCalendar size={18}  />

                  <ul>
                    <li className="flex flex-col">
                      <span className="text-xs">
                        Deadline: <b>{formatDeadlineLabel(data.deadline)}</b>
                      </span>
                      <span className="uppercase text-red-500 text-[11px] font-medium">
                        {formatDeadlineStatus(data.deadline)}
                      </span>
                    </li>
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Internship;
