import React, { useMemo, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { BsSliders2 } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FaLongArrowAltRight } from "react-icons/fa";
import { CiLocationOn, CiCalendar } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { ImPower } from "react-icons/im";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import ApplicationFormModal from "../components/form/ApplicationFormModal";
import { useOpportunities } from "../context/OpportunitiesContext";

const normalizeDurationValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const Global = () => {
  const { opportunities } = useOpportunities();
  const [query, setQuery] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    duration: "",
    category: "",
    deadline: "all",
  });

  const programs = useMemo(
    () => opportunities.filter((item) => item.type === "Global Program"),
    [opportunities],
  );

  const locationOptions = useMemo(
    () =>
      [...new Set(programs.map((item) => item.location).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [programs],
  );

  const durationOptions = useMemo(() => {
    const uniqueByNormalized = new Map();

    programs.forEach((item) => {
      const label = String(item.duration || "").trim();
      const key = normalizeDurationValue(label);

      if (label && key && !uniqueByNormalized.has(key)) {
        uniqueByNormalized.set(key, label);
      }
    });

    return [...uniqueByNormalized.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([key, label]) => ({ key, label }));
  }, [programs]);

  const categoryOptions = useMemo(
    () =>
      [
        ...new Set(programs.map((item) => item.programType).filter(Boolean)),
      ].sort((a, b) => a.localeCompare(b)),
    [programs],
  );

  const filteredPrograms = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return programs.filter((item) => {
      const skillsText = Array.isArray(item.skills)
        ? item.skills.join(" ").toLowerCase()
        : String(item.skills || "").toLowerCase();

      const locationMatch =
        !filters.location || item.location === filters.location;
      const durationMatch =
        !filters.duration ||
        normalizeDurationValue(item.duration) === filters.duration;
      const categoryMatch =
        !filters.category || item.programType === filters.category;
      const deadlineMatch =
        filters.deadline !== "upcoming" ||
        new Date(item.deadline).getTime() >= new Date().setHours(0, 0, 0, 0);

      const searchMatch =
        !normalized ||
        item.title.toLowerCase().includes(normalized) ||
        item.company.toLowerCase().includes(normalized) ||
        skillsText.includes(normalized);

      return (
        searchMatch &&
        locationMatch &&
        durationMatch &&
        categoryMatch &&
        deadlineMatch
      );
    });
  }, [programs, query, filters]);

  const resetFilters = () => {
    setFilters({
      location: "",
      duration: "",
      category: "",
      deadline: "all",
    });
  };

  return (
    <>
      <div className="bg-[#F8FAFC]">
       
        <div className="w-full max-w-350 mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <h2 className="text-3xl sm:text-4xl font-medium mb-2">Explore Global Program</h2>
          <p className="text-base sm:text-lg text-black/60 mb-8 sm:mb-10">
            Find the perfect global program to kickstart your career.
          </p>

          <div className="border border-black/10 rounded-xl py-4 px-4 mb-10 bg-white">
            <div className="flex flex-col md:flex-row gap-2 md:justify-between">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, Country, Skills..."
                className="outline-none w-full md:w-[80%] py-2 px-4 border border-black/10 rounded-xl bg-white"
              />

              <button
                type="button"
                onClick={() => setShowMoreFilters((prev) => !prev)}
                className="w-full md:w-auto justify-center flex items-center gap-2 border border-black/10 bg-white rounded-xl px-3 py-2 font-medium"
              >
                <BsSliders2 />
                <span>{showMoreFilters ? "Hide Filters" : "More Filters"}</span>
              </button>
            </div>

            {showMoreFilters && (
              <div className="mt-4 pt-4 border-t border-black/10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                <select
                  value={filters.location}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: event.target.value,
                    }))
                  }
                  className="border border-black/10 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">All Locations</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.duration}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      duration: event.target.value,
                    }))
                  }
                  className="border border-black/10 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">All Durations</option>
                  {durationOptions.map((duration) => (
                    <option key={duration.key} value={duration.key}>
                      {duration.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.category}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                  className="border border-black/10 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={filters.deadline}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        deadline: event.target.value,
                      }))
                    }
                    className="border border-black/10 rounded-lg px-3 py-2 bg-white flex-1"
                  >
                    <option value="all">All Deadlines</option>
                    <option value="upcoming">Upcoming Only</option>
                  </select>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-3 py-2 rounded-lg bg-slate-100 text-slate-900 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="h-[50vh] bg-white rounded-xl flex flex-col justify-center items-center">
              <CiSearch
                size={30}
                className=" h-12 w-12 p-2 bg-black/5 rounded-full flex justify-center items-center text-black/55 mb-3"
              />

              <h3 className="text-2xl font-medium mb-1">
                No Global Program found
              </h3>
              <p className="text-[15px] text-black/55 font-medium">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredPrograms.map((data) => (
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
                      onClick={() => setSelectedOpportunity(data)}
                    >
                      Apply Now <FaLongArrowAltRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default Global;
