import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { useOpportunities } from "../context/OpportunitiesContext";
import {
  formatDeadlineStatus,
  formatStipendText,
  isInternshipOpen,
  resolveWorkMode,
} from "../utils/internshipCardData";
import InternshipSearchBar from "../components/internship/InternshipSearchBar";
import InternshipSidebar from "../components/internship/InternshipSidebar";
import InternshipListItem from "../components/internship/InternshipListItem";

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
  const [searchParams] = useSearchParams();
  const { opportunities, isInternshipSaved, toggleSavedInternship } = useOpportunities();
  const [query, setQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState(searchParams.get("location") || "");

  useEffect(() => {
    if (searchParams.has("location")) {
      setLocationQuery(searchParams.get("location"));
    }
  }, [searchParams]);

  const [activeQuickFilter, setActiveQuickFilter] = useState("all");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState([]);

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
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8">
      <div className="w-full max-w-350 mx-auto px-4 sm:px-6 mt-15">
        <h2 className="text-3xl sm:text-4xl font-medium mb-2">Explore Internships</h2>
        <p className="text-base sm:text-lg text-black/60 mb-8 sm:mb-10">
          Find the perfect internship to kickstart your career.
        </p>

        <InternshipSearchBar
          query={query}
          locationQuery={locationQuery}
          locationOptions={locationOptions}
          activeQuickFilter={activeQuickFilter}
          onQueryChange={setQuery}
          onLocationChange={setLocationQuery}
          onQuickFilterChange={setActiveQuickFilter}
        />

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
              filteredInternships.map((item) => (
                <InternshipListItem
                  key={item.id}
                  item={item}
                  isSaved={isInternshipSaved(item.id)}
                  stipendLabel={formatStipendText(item)}
                  skillsList={toList(item.skills)}
                  experienceText={String(item.duration || "0-2 Yrs").trim()}
                  locationText={String(item.location || "Location not specified").trim()}
                  deadlineLabel={formatDeadlineStatus(item.deadline)}
                  postedDateLabel={formatAbsoluteDate(item.createdAt || item.updatedAt)}
                  companyInitial={String(item.company || "I").trim().charAt(0).toUpperCase()}
                  onShare={handleShareInternship}
                  onToggleSave={toggleSavedInternship}
                />
              ))
            )}
          </div>

          <InternshipSidebar
            selectedJobTypes={selectedJobTypes}
            selectedExperienceLevels={selectedExperienceLevels}
            onToggleJobType={(value) => toggleCheckboxValue(value, setSelectedJobTypes)}
            onToggleExperienceLevel={(value) => toggleCheckboxValue(value, setSelectedExperienceLevels)}
            onResetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default InternshipPage;
