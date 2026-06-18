import React from "react";

const JOB_TYPES = ["Full-Time Intern", "Part-Time Intern", "Project Based"];
const EXPERIENCE_LEVELS = ["Undergraduates", "Post-graduates", "Early Career"];

const InternshipSidebar = ({
  selectedJobTypes,
  selectedExperienceLevels,
  onToggleJobType,
  onToggleExperienceLevel,
  onResetFilters,
}) => {
  return (
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
                  onChange={() => onToggleJobType(label)}
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
                  onChange={() => onToggleExperienceLevel(label)}
                  className="h-3.5 w-3.5 accent-[#0B4AA6]"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 w-full rounded-lg bg-red-600 py-2 text-sm font-semibold text-white"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
};

export default InternshipSidebar;
