import React from "react";
import { CiSearch } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";

const QUICK_FILTERS = [
  { key: "all", label: "All Internships" },
  { key: "corporate", label: "Corporate" },
  { key: "remote", label: "Remote" },
  { key: "ngo", label: "NGO" },
  { key: "startups", label: "Startups" },
  { key: "design", label: "Design" },
];

const InternshipSearchBar = ({
  query,
  locationQuery,
  locationOptions,
  activeQuickFilter,
  onQueryChange,
  onLocationChange,
  onQuickFilterChange,
}) => {
  return (
    <div className="rounded-2xl border border-[#DFE7FB] bg-white/90 p-3 shadow-[0_12px_34px_rgba(15,44,93,0.08)]">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.6fr_1fr_auto]">
        <label className="flex items-center gap-2 rounded-xl border border-[#E4EAF8] bg-[#F9FBFF] px-3 py-3">
          <CiSearch className="text-lg text-[#4D6B9F]" />
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
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
            onChange={(event) => onLocationChange(event.target.value)}
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
          className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white"
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
              onClick={() => onQuickFilterChange(filter.key)}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border-[#0B4AA6] bg-red-600 text-white"
                  : "border-[#E0E8FA] bg-white text-[#445985] hover:border-[#BDD0F3]"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InternshipSearchBar;
