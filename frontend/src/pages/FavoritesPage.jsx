import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { useOpportunities } from "../context/OpportunitiesContext";
import {
  formatStipendText,
  resolveWorkMode,
} from "../utils/internshipCardData";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user, opportunities, savedInternshipIds, isBootstrapping, toggleSavedInternship } =
    useOpportunities();

  useEffect(() => {
    if (!isBootstrapping && !user) {
      navigate("/login");
    }
  }, [isBootstrapping, user, navigate]);

  const favoriteInternships = useMemo(
    () =>
      opportunities.filter(
        (item) =>
          item.type === "Internship" &&
          savedInternshipIds.includes(String(item.id || "").trim()),
      ),
    [opportunities, savedInternshipIds],
  );

  if (isBootstrapping) {
    return (
      <div className="min-h-[80vh] bg-[#F4F7FF] flex items-center justify-center">
        <p className="text-slate-600 font-medium">Loading favorites...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#F4F7FF] min-h-screen py-8 sm:py-10 px-4 sm:px-6">
      <div className="w-full max-w-350 mx-auto">
        <div className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">My Favorites</h1>
              <p className="text-sm text-slate-500 mt-1">
                All internships you have saved for later.
              </p>
            </div>
            
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Saved Internships</h2>

          {favoriteInternships.length === 0 ? (
            <p className="text-slate-500">
              No saved internships yet. Browse internships and click save.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteInternships.map((item) => (
                <div
                  key={item.id}
                  className="border border-[#DFE8FA] rounded-xl p-4 bg-[#FAFCFF]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-blue-700 font-medium">{item.company}</p>
                      <p className="text-sm text-slate-600 mt-1 inline-flex items-center gap-1">
                        <CiLocationOn />
                        {item.location || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-slate-700 space-y-1">
                    <p>
                      <span className="font-medium">Stipend:</span> {formatStipendText(item)}
                    </p>
                    <p>
                      <span className="font-medium">Mode:</span> {resolveWorkMode(item)}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                    <Link
                      to={`/internship/${item.id}`}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-[#0B4AA6] text-white text-sm font-semibold text-center"
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleSavedInternship(item.id)}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
