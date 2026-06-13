import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiAward, FiBookmark, FiCheckCircle, FiExternalLink, FiShare2, FiTrendingUp, FiUserCheck } from "react-icons/fi";
import ApplicationFormModal from "../components/form/ApplicationFormModal";
import { useOpportunities } from "../context/OpportunitiesContext";
import {
  formatDeadlineLabel,
  formatDeadlineStatus,
  formatStipendPeriod,
  formatStipendText,
  getInternshipTags,
  isInternshipOpen,
  resolveWorkMode,
} from "../utils/internshipCardData";
import InternshipDetailsHeader from "../components/internship/InternshipDetailsHeader";
import InternshipDetailsSummaryCards from "../components/internship/InternshipDetailsSummaryCards";
import InternshipDetailsAbout from "../components/internship/InternshipDetailsAbout";

const toList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const toReadableDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const resolveMapQuery = (value) => {
  const normalized = String(value || "").trim();
  return normalized || "India";
};

const getMapSearchUrl = (value) => {
  const query = encodeURIComponent(resolveMapQuery(value));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

const getMapEmbedUrl = (value) => {
  const query = encodeURIComponent(resolveMapQuery(value));
  return `https://maps.google.com/maps?q=${query}&z=13&output=embed`;
};

const getBenefitIcon = (benefit) => {
  return FiCheckCircle;
};

const InternshipDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { opportunities, isInternshipSaved, toggleSavedInternship, user } =
    useOpportunities();
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const internship = useMemo(
    () =>
      opportunities.find(
        (item) =>
          item.id === id && item.type === "Internship" && isInternshipOpen(item),
      ),
    [opportunities, id],
  );

  const requiredSkills = toList(internship?.requiredSkills || internship?.skills);
  const whoCanApply = toList(internship?.whoCanApply);
  const benefits = toList(internship?.benefits);
  const descriptionText = String(internship?.description || "").trim();
  const shouldShowDescriptionToggle = descriptionText.length > 320;
  const isSaved = isInternshipSaved(internship?.id);
  const mapSearchUrl = getMapSearchUrl(internship?.location);
  const mapEmbedUrl = getMapEmbedUrl(internship?.location);

  if (!internship) {
    return (
      <div className="min-h-[90vh] bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white border border-black/10 rounded-2xl p-8 max-w-xl w-full text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Internship not found</h1>
          <p className="text-slate-600 mt-2">
            This internship may have been removed or is no longer available.
          </p>
          <button
            type="button"
            onClick={() => navigate("/intership")}
            className="mt-5 px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold"
          >
            Back to internships
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#F4F6FB] min-h-screen py-8 sm:py-10 ">
        <div className="w-full max-w-350 mx-auto px-4 sm:px-6">
          <div className="text-sm text-slate-500 mb-5">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <Link to="/intership" className="hover:underline">
              Internship
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-slate-700 font-medium">{internship.title}</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="space-y-6">
              <InternshipDetailsHeader internship={internship} />

              <InternshipDetailsSummaryCards internship={internship} />

              {whoCanApply.length > 0 && (
                <div className="bg-white border border-[#E4EAF8] rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-slate-900">Who Can Apply</h2>
                  <ul className="mt-3 space-y-2 text-slate-700 list-disc pl-5">
                    {whoCanApply.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {requiredSkills.length > 0 && (
                <div className="bg-white border border-[#E4EAF8] rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-slate-900">Required Skills</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {requiredSkills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {benefits.length > 0 && (
                <div className="bg-white border border-[#E4EAF8] rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-slate-900">Internship Benefits</h2>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {benefits.map((benefit, index) => (
                      <div
                        key={`${benefit}-${index}`}
                        className="rounded-xl border border-[#E6ECF8] bg-[#F8FAFF] px-4 py-3 text-slate-800 font-medium flex items-center gap-3"
                      >
                        <span className="h-11 w-11 rounded-xl bg-[#DCE9FF] text-[#0B4AA6] inline-flex items-center justify-center shrink-0">
                          {React.createElement(getBenefitIcon(benefit), {
                            size: 18,
                            "aria-hidden": true,
                          })}
                        </span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white border border-[#E4EAF8] rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-slate-900">Job Description</h2>
                <div
                  className="text-slate-700 mt-3 text-[15px] whitespace-pre-wrap"
                  style={
                    shouldShowDescriptionToggle && !isDescriptionExpanded
                      ? {
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 6,
                          overflow: "hidden",
                        }
                      : undefined
                  }
                  dangerouslySetInnerHTML={{
                    __html: descriptionText
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                  }}
                />
                {shouldShowDescriptionToggle && (
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                    className="mt-3 block mx-auto text-sm font-semibold text-[#0B4AA6] hover:underline"
                  >
                    {isDescriptionExpanded ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            </div>

            <InternshipDetailsAbout
              internship={internship}
              isSaved={isSaved}
              mapSearchUrl={mapSearchUrl}
              mapEmbedUrl={mapEmbedUrl}
              onApply={() => {
                if (!user) {
                  navigate("/signup");
                } else {
                  setSelectedOpportunity(internship);
                }
              }}
              onToggleSave={() => toggleSavedInternship(internship.id)}
            />
          </div>
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

export default InternshipDetailsPage;
