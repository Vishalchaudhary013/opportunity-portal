import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import ApplicationFormModal from "../components/form/ApplicationFormModal";
import { useOpportunities } from "../context/OpportunitiesContext";
import GlobalProgramSearchBar from "../components/globalProgram/GlobalProgramSearchBar";
import GlobalProgramCard from "../components/globalProgram/GlobalProgramCard";

const normalizeDurationValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const Global = () => {
  const navigate = useNavigate();
  const { opportunities, user } = useOpportunities();
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = (data) => {
    if (!user) {
      navigate("/signup");
    } else {
      setSelectedOpportunity(data);
    }
  };

  return (
    <>
      <div className="bg-[#F8FAFC]">
        <div className="w-full max-w-[1350px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <h2 className="text-3xl sm:text-4xl font-medium mb-2">Explore Global Program</h2>
          <p className="text-base sm:text-lg text-black/60 mb-8 sm:mb-10">
            Find the perfect global program to kickstart your career.
          </p>

          <GlobalProgramSearchBar
            query={query}
            onQueryChange={setQuery}
            showMoreFilters={showMoreFilters}
            onToggleFilters={() => setShowMoreFilters((prev) => !prev)}
            filters={filters}
            onFilterChange={handleFilterChange}
            locationOptions={locationOptions}
            durationOptions={durationOptions}
            categoryOptions={categoryOptions}
            onResetFilters={resetFilters}
          />

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
                <GlobalProgramCard
                  key={data.id}
                  data={data}
                  onApply={handleApply}
                />
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
