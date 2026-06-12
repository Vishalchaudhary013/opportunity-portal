import React from "react";
import { BsSliders2 } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";

const GlobalProgramSearchBar = ({
  query,
  onQueryChange,
  showMoreFilters,
  onToggleFilters,
  filters,
  onFilterChange,
  locationOptions,
  durationOptions,
  categoryOptions,
  onResetFilters,
}) => {
  return (
    <div className="border border-black/10 rounded-xl py-4 px-4 mb-10 bg-white">
      <div className="flex flex-col md:flex-row gap-2 md:justify-between">
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by title, Country, Skills..."
          className="outline-none w-full md:w-[80%] py-2 px-4 border border-black/10 rounded-xl bg-white"
        />

        <button
          type="button"
          onClick={onToggleFilters}
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
            onChange={(event) => onFilterChange("location", event.target.value)}
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
            onChange={(event) => onFilterChange("duration", event.target.value)}
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
            onChange={(event) => onFilterChange("category", event.target.value)}
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
              onChange={(event) => onFilterChange("deadline", event.target.value)}
              className="border border-black/10 rounded-lg px-3 py-2 bg-white flex-1"
            >
              <option value="all">All Deadlines</option>
              <option value="upcoming">Upcoming Only</option>
            </select>
            <button
              type="button"
              onClick={onResetFilters}
              className="px-3 py-2 rounded-lg bg-slate-100 text-slate-900 font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalProgramSearchBar;
