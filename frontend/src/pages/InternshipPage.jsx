import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { BsSliders2 } from "react-icons/bs";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { CiLocationOn, CiCalendar } from "react-icons/ci";
import { useOpportunities } from "../context/OpportunitiesContext";
import { LuDot } from "react-icons/lu";
import { IoBagOutline } from "react-icons/io5";
import {
  formatDeadlineLabel,
  formatDeadlineStatus,
  formatStipendPeriod,
  formatStipendText,
  getInternshipTags,
  resolveWorkMode,
} from "../utils/internshipCardData";

const INTERNSHIP_TYPE_KEYWORDS = {
  frontend: [
    "frontend",
    "front-end",
    "front end",
    "react",
    "next.js",
    "nextjs",
    "angular",
    "vue",
    "ui",
    "ux",
    "html",
    "css",
  ],
  backend: [
    "backend",
    "back-end",
    "back end",
    "node",
    "express",
    "api",
    "django",
    "flask",
    "spring",
    "java",
    "database",
    "sql",
    "mongodb",
  ],
  devops: [
    "devops",
    "dev ops",
    "ci/cd",
    "docker",
    "kubernetes",
    "k8s",
    "terraform",
    "jenkins",
    "ansible",
    "linux",
    "sre",
    "monitoring",
  ],
  cloud: [
    "cloud",
    "colude",
    "aws",
    "azure",
    "gcp",
    "serverless",
    "cloud-native",
  ],
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const includesKeyword = (text, keyword) => {
  const normalizedKeyword = String(keyword || "")
    .trim()
    .toLowerCase();

  if (!normalizedKeyword) {
    return false;
  }

  const pattern = new RegExp(
    `(^|[^a-z0-9])${escapeRegex(normalizedKeyword)}([^a-z0-9]|$)`,
    "i",
  );

  return pattern.test(text);
};

const normalizeDurationValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");


const matchesInternshipType = (type, titleText, skillsText) => {
  if (!type) {
    return true;
  }

  const normalizedType =
    type.toLowerCase() === "colude" ? "cloud" : type.toLowerCase();
  const keywords = INTERNSHIP_TYPE_KEYWORDS[normalizedType] || [normalizedType];
  return keywords.some(
    (keyword) =>
      includesKeyword(titleText, keyword) ||
      includesKeyword(skillsText, keyword),
  );
};

const InternshipPage = () => {
  const { opportunities, isInternshipSaved, toggleSavedInternship } =
    useOpportunities();
  const [query, setQuery] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    duration: "",
    internshipType: "",
    stipend: "",
    deadline: "all",
  });

  const internships = useMemo(() => {
    return opportunities.filter((item) => item.type === "Internship");
  }, [opportunities]);

  const locationOptions = useMemo(
    () =>
      [
        ...new Set(internships.map((item) => item.location).filter(Boolean)),
      ].sort((a, b) => a.localeCompare(b)),
    [internships],
  );

  const durationOptions = useMemo(() => {
    const uniqueByNormalized = new Map();

    internships.forEach((item) => {
      const label = String(item.duration || "").trim();
      const key = normalizeDurationValue(label);

      if (label && key && !uniqueByNormalized.has(key)) {
        uniqueByNormalized.set(key, label);
      }
    });

    return [...uniqueByNormalized.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([key, label]) => ({ key, label }));
  }, [internships]);

  const filteredInternships = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return internships.filter((item) => {
      const titleText = String(item.title || "").toLowerCase();
      const skillsText = Array.isArray(item.skills)
        ? item.skills.join(" ").toLowerCase()
        : String(item.skills || "").toLowerCase();

      const locationMatch =
        !filters.location || item.location === filters.location;
      const durationMatch =
        !filters.duration ||
        normalizeDurationValue(item.duration) === filters.duration;
      const internshipTypeMatch = matchesInternshipType(
        filters.internshipType,
        titleText,
        skillsText,
      );
      const stipendMatch =
        !filters.stipend ||
        [String(item.stipend || ""), formatStipendText(item)]
          .join(" ")
          .toLowerCase()
          .includes(filters.stipend.toLowerCase());
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
        internshipTypeMatch &&
        stipendMatch &&
        deadlineMatch
      );
    });
  }, [internships, query, filters]);

  const resetFilters = () => {
    setFilters({
      location: "",
      duration: "",
      internshipType: "",
      stipend: "",
      deadline: "all",
    });
  };

  return (
    <>
      <div className="bg-[#F8FAFC]">
        
        <div className="w-full max-w-350 mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <h2 className="text-3xl sm:text-4xl font-medium mb-2">Explore Internships</h2>
          <p className="text-base sm:text-lg text-black/60 mb-8 sm:mb-10">
            Find the perfect internship to kickstart your career.
          </p>

          <div className="border border-black/10 rounded-xl py-4 px-4 mb-10 bg-white">
            <div className="flex flex-col md:flex-row gap-2 md:justify-between">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, Company, Skills..."
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
              <div className="mt-4 pt-4 border-t border-black/10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
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
                  value={filters.internshipType}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      internshipType: event.target.value,
                    }))
                  }
                  className="border border-black/10 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">All Internship Types</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="devops">DevOps</option>
                  <option value="cloud">Cloud</option>
                  <option value="colude">Colude</option>
                </select>

                <input
                  type="text"
                  value={filters.stipend}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      stipend: event.target.value,
                    }))
                  }
                  placeholder="Stipend contains..."
                  className="border border-black/10 rounded-lg px-3 py-2"
                />

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

          {filteredInternships.length === 0 ? (
            <div className="h-[50vh] bg-white rounded-xl flex flex-col justify-center items-center">
              <CiSearch
                size={30}
                className=" h-12 w-12 p-2 bg-black/5 rounded-full flex justify-center items-center text-black/55 mb-3"
              />

              <h3 className="text-2xl font-medium mb-1">
                No Internships found
              </h3>
              <p className="text-[15px] text-black/55 font-medium">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {filteredInternships.map((data) => {
                const isSaved = isInternshipSaved(data.id);

                return (
                <Link
                  to={`/internship/${data.id}`}
                  key={data.id}
                  className="py-4 px-3 border bg-white border-black/10 rounded-xl group hover:transition hover:scale-101"
                >
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
                            {String(data.company || "I").trim().charAt(0).toUpperCase()}
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
                        <BsBookmarkFill size={22} className="pt-0.5 text-[#0B4AA6]" />
                      ) : (
                        <BsBookmark size={22} className="pt-0.5" />
                      )}
                    </button>
                  </div>

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

                  <div className="flex gap-2 flex-wrap mb-4">
                    {getInternshipTags(data).map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="flex items-center justify-center bg-blue-100 text-blue-800 px-2 p-0.5 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="border border-black/5 rounded-xl p-4 bg-white mb-6">
                    <p className="text-sm font-medium uppercase">Stipend</p>
                    <h2 className="text-lg font-semibold mt-1">
                      {formatStipendText(data)}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {formatStipendPeriod(data)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CiCalendar size={19} />

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
                );
              })}
            </div>
          )}
        </div>

        
      </div>
    </>
  );
};

export default InternshipPage;
