import React from "react";
import { useAdminContext } from "../admin/AdminContext";

const PostOpportunity = () => {
  const {
    showOpportunityForm,
    isSuperPostSection,
    handleSectionChange,
    handleSuperCreateInternship,
    handleSuperCreateGlobalProgram,
  } = useAdminContext();

  if (showOpportunityForm || !isSuperPostSection) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-5 space-y-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Post Opportunities
          </h2>
          <p className="text-sm text-slate-500">
            Create internships or global programs from the sidebar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleSectionChange("Applications")}
          className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm font-semibold"
        >
          View Applications
        </button>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={handleSuperCreateInternship}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0B4AA6] text-white font-semibold"
        >
          Post Internship
        </button>
        <button
          type="button"
          onClick={handleSuperCreateGlobalProgram}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
        >
          Post Global Program
        </button>
        <button
          type="button"
          onClick={() => handleSectionChange("Closed Application")}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
        >
          Closed Applications
        </button>
      </div>
    </div>
  );
};

export default PostOpportunity;
