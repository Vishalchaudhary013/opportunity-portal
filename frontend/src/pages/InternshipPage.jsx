import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FiMapPin, FiShare2, FiUsers, FiCalendar } from "react-icons/fi";
import { LuIndianRupee, LuBriefcaseBusiness } from "react-icons/lu";
import { useOpportunities } from "../context/OpportunitiesContext";
import {
  formatDeadlineStatus,
  formatStipendText,
  isInternshipOpen,
  resolveWorkMode,
} from "../utils/internshipCardData";

const QUICK_FILTERS = [
  { key: "all", label: "All Internships" },
  { key: "corporate", label: "Corporate" },
  { key: "remote", label: "Remote" },
  { key: "ngo", label: "NGO" },
  { key: "startups", label: "Startups" },
  { key: "design", label: "Design" },
];

const JOB_TYPES = ["Full-Time Intern", "Part-Time Intern", "Project Based"];
const EXPERIENCE_LEVELS = ["Undergraduates", "Post-graduates", "Early Career"];

const toList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,|\|/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeText = (value) => String(value || "").toLowerCase();

const includesAny = (text, keywords) =>
  keywords.some((keyword) => normalizeText(text).includes(keyword));

const formatPostedLabel = (createdAt) => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Posted recently";
  }

  const today = new Date();
  const diffInDays = Math.max(
    0,
    Math.floor((today.getTime() - date.getTime()) / 86400000),
  );

  if (diffInDays === 0) {
    return "Posted today";
  }

  if (diffInDays === 1) {
    return "Posted 1 day ago";
  }

  return `Posted ${diffInDays} days ago`;
};

const formatAbsoluteDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getQuickFilterMatch = (item, activeQuickFilter) => {
  if (activeQuickFilter === "all") {
    return true;
  }

  const context = [
    item.title,
    item.company,
    item.companyType,
    item.industry,
    item.description,
    item.functionalRole,
    ...toList(item.skills),
  ]
    .join(" ")
    .toLowerCase();

  if (activeQuickFilter === "remote") {
    return resolveWorkMode(item).toLowerCase().includes("remote");
  }

  if (activeQuickFilter === "corporate") {
    return includesAny(context, ["corporate", "enterprise", "private limited"]);
  }

  if (activeQuickFilter === "ngo") {
    return includesAny(context, ["ngo", "non-profit", "non profit", "foundation"]);
  }

  if (activeQuickFilter === "startups") {
    return includesAny(context, ["startup", "start-up", "early-stage"]);
  }

  if (activeQuickFilter === "design") {
    return includesAny(context, ["design", "ui", "ux", "figma", "product design"]);
  }

  return true;
};

const getJobTypeMatch = (item, selectedJobTypes) => {
  if (!selectedJobTypes.length) {
    return true;
  }

  const text = [item.internshipType, item.programType, item.title, item.duration]
    .join(" ")
    .toLowerCase();

  return selectedJobTypes.some((jobType) => {
    if (jobType === "Full-Time Intern") {
      return includesAny(text, ["full time", "full-time", "fulltime"]);
    }

    if (jobType === "Part-Time Intern") {
      return includesAny(text, ["part time", "part-time", "parttime"]);
    }

    return includesAny(text, ["project", "project based", "contract"]);
  });
};

const getExperienceMatch = (item, selectedExperienceLevels) => {
  if (!selectedExperienceLevels.length) {
    return true;
  }

  const text = [item.eligibility, ...toList(item.whoCanApply)].join(" ").toLowerCase();

  return selectedExperienceLevels.some((level) => {
    if (level === "Undergraduates") {
      return includesAny(text, ["undergraduate", "college", "bachelor", "b.tech", "student"]);
    }

    if (level === "Post-graduates") {
      return includesAny(text, ["post graduate", "postgraduate", "master", "mba", "m.tech"]);
    }

    return includesAny(text, ["early career", "entry level", "fresher", "beginner"]);
  });
};

const InternshipPage = () => {
  const navigate = useNavigate();
  const { opportunities, isInternshipSaved, toggleSavedInternship } = useOpportunities();
  const [query, setQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState("all");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const internships = useMemo(
    () =>
      opportunities.filter(
        (item) => item.type === "Internship" && isInternshipOpen(item),
      ),
    [opportunities],
  );

  const locationOptions = useMemo(
    () => [...new Set(internships.map((item) => item.location).filter(Boolean))].sort(),
    [internships],
  );

  const filteredInternships = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedLocationQuery = locationQuery.trim().toLowerCase();

    return internships
      .filter((item) => {
        const skills = toList(item.skills).join(" ").toLowerCase();
        const searchableText = [item.title, item.company, item.description, skills]
          .join(" ")
          .toLowerCase();

        const searchMatch = !normalizedQuery || searchableText.includes(normalizedQuery);
        const locationMatch =
          !normalizedLocationQuery || normalizeText(item.location).includes(normalizedLocationQuery);
        const quickFilterMatch = getQuickFilterMatch(item, activeQuickFilter);
        const jobTypeMatch = getJobTypeMatch(item, selectedJobTypes);
        const experienceMatch = getExperienceMatch(item, selectedExperienceLevels);

        return searchMatch && locationMatch && quickFilterMatch && jobTypeMatch && experienceMatch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.updatedAt || 0).getTime() -
          new Date(a.createdAt || a.updatedAt || 0).getTime(),
      );
  }, [
    internships,
    query,
    locationQuery,
    activeQuickFilter,
    selectedJobTypes,
    selectedExperienceLevels,
  ]);

  const toggleCheckboxValue = (value, setter) => {
    setter((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value],
    );
  };

  const resetFilters = () => {
    setQuery("");
    setLocationQuery("");
    setActiveQuickFilter("all");
    setSelectedJobTypes([]);
    setSelectedExperienceLevels([]);
  };

  const handleShareInternship = async (item) => {
    const detailUrl = `${window.location.origin}/internship/${item.id}`;
    const sharePayload = {
      title: item.title || "Internship Opportunity",
      text: `Check out this internship: ${item.title || "Opportunity"}`,
      url: detailUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(detailUrl);
        window.alert("Internship link copied to clipboard");
        return;
      }

      window.prompt("Copy this internship link:", detailUrl);
    } catch {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(detailUrl);
          window.alert("Internship link copied to clipboard");
          return;
        } catch {
          window.prompt("Copy this internship link:", detailUrl);
        }
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8"
      
    >
      <div className="w-full max-w-350 mx-auto px-4 sm:px-6">
         <h2 className="text-3xl sm:text-4xl font-medium mb-2">Explore Internships</h2>
          <p className="text-base sm:text-lg text-black/60 mb-8 sm:mb-10">
            Find the perfect internship to kickstart your career.
          </p>
        <div className="rounded-2xl border border-[#DFE7FB] bg-white/90 p-3 shadow-[0_12px_34px_rgba(15,44,93,0.08)]">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.6fr_1fr_auto]">
            <label className="flex items-center gap-2 rounded-xl border border-[#E4EAF8] bg-[#F9FBFF] px-3 py-3">
              <CiSearch className="text-lg text-[#4D6B9F]" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by role, company, or skills..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#7C90B7]"
              />
            </label>

            <label className="flex items-center gap-2 rounded-xl border border-[#E4EAF8] bg-[#F9FBFF] px-3 py-3">
              <FiMapPin className="text-base text-[#4D6B9F]" />
              <input
                type="text"
                list="internship-location-options"
                value={locationQuery}
                onChange={(event) => setLocationQuery(event.target.value)}
                placeholder="Location"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#7C90B7]"
              />
              <datalist id="internship-location-options">
                {locationOptions.map((location) => (
                  <option key={location} value={location} />
                ))}
              </datalist>
            </label>

            <button
              type="button"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white  "
            >
              Find Opportunities
            </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {QUICK_FILTERS.map((filter) => {
              const active = activeQuickFilter === filter.key;

              return (
                <button
                  type="button"
                  key={filter.key}
                  onClick={() => setActiveQuickFilter(filter.key)}
                  className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-[#0B4AA6] bg-blue-600 text-white"
                      : "border-[#E0E8FA] bg-white text-[#445985] hover:border-[#BDD0F3]"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-3.5">
            {filteredInternships.length === 0 ? (
              <div className="rounded-2xl border border-[#DFE7FB] bg-white p-10 text-center">
                <CiSearch className="mx-auto mb-3 text-4xl text-slate-400" />
                <h2 className="text-xl font-semibold text-slate-800">No internships found</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your keywords or clearing the filters.
                </p>
              </div>
            ) : (
              filteredInternships.map((item) => {
                const isSaved = isInternshipSaved(item.id);
                const applicantCount = Number(item.applicationCount || item.applicantsCount || 0);
                const stipendLabel = formatStipendText(item);
                const skillsList = toList(item.skills);
                const visibleTags = skillsList.slice(0, 4);
                const moreCount = Math.max(skillsList.length - visibleTags.length, 0);
                const experienceText = String(item.duration || "0-2 Yrs").trim();
                const locationText = String(item.location || "Location not specified").trim();
                const deadlineLabel = formatDeadlineStatus(item.deadline);
                const postedDateLabel = formatAbsoluteDate(item.createdAt || item.updatedAt);
                const companyInitial = String(item.company || "I").trim().charAt(0).toUpperCase();

                return (
                  <article
                    key={item.id}
                    className="cursor-pointer rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition hover:border-[#C9D4EB]"
                    role="link"
                    tabIndex={0}
                    aria-label={`View details for ${item.title}`}
                    onClick={() => navigate(`/internship/${item.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/internship/${item.id}`);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/internship/${item.id}`}
                          className="block truncate text-[22px] font-semibold text-[#111827]"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-1 truncate text-[15px] text-[#4B5563]">
                          {item.company || "Company"}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-[14px] text-[#374151]">
                          <span className="inline-flex items-center gap-1.5">
                            
                            {stipendLabel}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <FiUsers className="text-[16px]" />
                            {applicantCount > 0 ? `${applicantCount} Applicants` : "Applications open"}
                          </span>
                          <span className="inline-flex items-center gap-1.5 truncate">
                            <FiMapPin className="text-[16px]" />
                            {locationText}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <LuBriefcaseBusiness className="text-[16px]" />
                            {experienceText}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {visibleTags.map((tag) => (
                            <span
                              key={`${item.id}-${tag}`}
                              className="rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-[12px] text-[#374151]"
                            >
                              {tag}
                            </span>
                          ))}
                          {moreCount > 0 ? (
                            <span className="rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-[12px] text-[#374151]">
                              +{moreCount}
                            </span>
                          ) : null}
                        </div>

                       
                      </div>

                      <div className="h-17 w-17 shrink-0 rounded-xl p-2.5 flex items-center justify-center">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.company}
                            className="h-full w-full rounded-lg object-contain"
                          />
                        ) : (
                          <span className="text-2xl font-semibold text-[#1A5FB4]">{companyInitial}</span>
                        )}
                      </div>
                    </div>

                     <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#F3F4F6] pt-3">
                          <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#6B7280] leading-none">
                            <span>Posted {postedDateLabel}</span>
                            <span className="inline-flex items-center gap-1 text-[#1A5FB4] font-semibold whitespace-nowrap">
                              <FiCalendar className="text-[13px]" />
                              {deadlineLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 text-[#9CA3AF]">
                            <button
                              type="button"
                              className="rounded-md p-1 transition hover:bg-slate-100 hover:text-slate-600"
                              aria-label="Share internship"
                              onClick={async (event) => {
                                event.stopPropagation();
                                await handleShareInternship(item);
                              }}
                            >
                              <FiShare2 className="text-[18px]" />
                            </button>

                            <button
                              type="button"
                              className="rounded-md p-1 transition hover:bg-slate-100 hover:text-slate-600"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleSavedInternship(item.id);
                              }}
                              aria-label={isSaved ? "Unsave internship" : "Save internship"}
                            >
                              {isSaved ? (
                                <BsBookmarkFill className="text-[18px] text-[#0B4AA6]" />
                              ) : (
                                <BsBookmark className="text-[18px]" />
                              )}
                            </button>
                          </div>
                        </div>
                  </article>
                );
              })
            )}
          </div>

          <aside className="hidden space-y-3 xl:block">
            <div className="rounded-2xl border border-[#E2E9FA] bg-white p-4 shadow-[0_8px_22px_rgba(32,60,120,0.06)]">
              <h3 className="text-sm font-semibold text-slate-800">Refine Search</h3>

              <div className="mt-4">
                <p className="text-[11px] font-bold tracking-wide text-slate-500">JOB TYPE</p>
                <div className="mt-2 space-y-2">
                  {JOB_TYPES.map((label) => (
                    <label key={label} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedJobTypes.includes(label)}
                        onChange={() => toggleCheckboxValue(label, setSelectedJobTypes)}
                        className="h-3.5 w-3.5 accent-[#0B4AA6]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-bold tracking-wide text-slate-500">EXPERIENCE LEVEL</p>
                <div className="mt-2 space-y-2">
                  {EXPERIENCE_LEVELS.map((label) => (
                    <label key={label} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedExperienceLevels.includes(label)}
                        onChange={() => toggleCheckboxValue(label, setSelectedExperienceLevels)}
                        className="h-3.5 w-3.5 accent-[#0B4AA6]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white  "
              >
                Reset Filters
              </button>
            </div>

           
          </aside>
        </div>
      </div>
    </div>
  );
};

export default InternshipPage;
