import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CiCalendar, CiLocationOn } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import {
  FiAward,
  FiBookmark,
  FiCheckCircle,
  FiExternalLink,
  FiShare2,
  FiTrendingUp,
  FiUserCheck,
} from "react-icons/fi";
import { LuDot } from "react-icons/lu";
import ApplicationFormModal from "../components/form/ApplicationFormModal";
import { useOpportunities } from "../context/OpportunitiesContext";
import {
  formatDeadlineLabel,
  formatDeadlineStatus,
  formatStipendPeriod,
  formatStipendText,
  getInternshipTags,
  resolveWorkMode,
} from "../utils/internshipCardData";

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
  const normalized = String(benefit || "").trim().toLowerCase();

  if (normalized.includes("mentor")) {
    return FiUserCheck;
  }

  if (normalized.includes("certificate") || normalized.includes("certification")) {
    return FiAward;
  }

  if (normalized.includes("network")) {
    return FiShare2;
  }

  if (normalized.includes("ppo") || normalized.includes("placement") || normalized.includes("opportunity")) {
    return FiTrendingUp;
  }

  return FiCheckCircle;
};

const InternshipDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { opportunities, isInternshipSaved, toggleSavedInternship } =
    useOpportunities();
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const internship = useMemo(
    () => opportunities.find((item) => item.id === id && item.type === "Internship"),
    [opportunities, id],
  );

  const requiredSkills = toList(internship?.requiredSkills || internship?.skills);
  const whoCanApply = toList(internship?.whoCanApply);
  const benefits = toList(internship?.benefits);
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
      <div className="bg-[#F4F6FB] min-h-screen py-8 sm:py-10 px-4 sm:px-6">
        <div className="w-full max-w-350 mx-auto">
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
              <div className="bg-white border border-[#E4EAF8] rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    {internship.logo ? (
                      <img
                        src={internship.logo}
                        alt={internship.company}
                        className="h-14 w-14 rounded-xl mt-1.5 object-cover border border-black/10"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl font-semibold">
                        {String(internship.company || "I").trim().charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-0.5 wrap-break-word">{internship.title}</h1>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <span className="font-medium text-blue-700">{internship.company}</span>
                        <LuDot />
                        <span className="inline-flex items-center gap-1">
                          <CiLocationOn />
                          {internship.location || "N/A"}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {getInternshipTags(internship).map((tag, index) => (
                          <span
                            key={`${tag}-${index}`}
                            className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white border border-[#E4EAF8] rounded-xl p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Stipend</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{formatStipendText(internship)}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatStipendPeriod(internship)}</p>
                </div>
                <div className="bg-white border border-[#E4EAF8] rounded-xl p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Apply by</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{formatDeadlineLabel(internship.deadline)}</p>
                  <p className="text-xs text-rose-500 mt-1 uppercase">{formatDeadlineStatus(internship.deadline)}</p>
                </div>
                <div className="bg-white border border-[#E4EAF8] rounded-xl p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Start date</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1 inline-flex items-center gap-1">
                    <CiCalendar />
                    {toReadableDate(internship.startDate)}
                  </p>
                </div>
                <div className="bg-white border border-[#E4EAF8] rounded-xl p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Role type</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1 inline-flex items-center gap-1">
                    <IoBagOutline />
                    {resolveWorkMode(internship)}
                  </p>
                </div>
              </div>

               <div className="bg-white border border-[#E4EAF8] rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-slate-900">Who Can Apply</h2>
                {whoCanApply.length ? (
                  <ul className="mt-3 space-y-2 text-slate-700 list-disc pl-5">
                    {whoCanApply.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-slate-500">No eligibility criteria added yet.</p>
                )}
              </div>

              

              <div className="bg-white border border-[#E4EAF8] rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-slate-900">Required Skills</h2>
                {requiredSkills.length ? (
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
                ) : (
                  <p className="mt-3 text-slate-500">No skills listed.</p>
                )}
              </div>

             

              <div className="bg-white border border-[#E4EAF8] rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-slate-900">Internship Benefits</h2>
                {benefits.length ? (
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
                ) : (
                  <p className="mt-3 text-slate-500">No benefits listed.</p>
                )}
              </div>

              <div className="bg-white border border-[#E4EAF8] rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-slate-900">Job Description</h2>
                <p className="text-slate-700 mt-3 text-[15px] ">
                  {internship.description}
                </p>
              </div>
            </div>

            

            <aside className="space-y-4 xl:sticky xl:top-6">
              <div className="bg-white border border-[#E4EAF8] rounded-2xl p-4">
                <button
                  type="button"
                  onClick={() => setSelectedOpportunity(internship)}
                  className="w-full py-3 rounded-lg bg-[#0B4AA6] hover:bg-[#083C86] text-white font-semibold"
                >
                  Apply Now
                </button>
                <button
                  type="button"
                  onClick={() => toggleSavedInternship(internship.id)}
                  className="w-full mt-3 py-2.5 rounded-lg border border-[#D8E2F7] text-slate-700 font-medium inline-flex items-center justify-center gap-2"
                  aria-label={isSaved ? "Unsave internship" : "Save internship"}
                >
                  <FiBookmark className={isSaved ? "text-[#0B4AA6]" : ""} />
                  {isSaved ? "Saved" : "Save for later"}
                </button>
              </div>

              <div className="bg-white border border-[#E4EAF8] rounded-2xl p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">About the Company</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Department</span>
                    <span className="text-slate-800 font-medium text-right">{internship.department || "N/A"}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Functional role</span>
                    <span className="text-slate-800 font-medium text-right">{internship.functionalRole || "N/A"}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Type</span>
                    <span className="text-slate-800 font-medium text-right">{internship.companyType || "N/A"}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Size</span>
                    <span className="text-slate-800 font-medium text-right">{internship.companySize || "N/A"}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Founded</span>
                    <span className="text-slate-800 font-medium text-right">{internship.foundedYear || "N/A"}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Industry</span>
                    <span className="text-slate-800 font-medium text-right">{internship.industry || "N/A"}</span>
                  </div>
                </div>

                {internship.website && (
                  <a
                    href={internship.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#D8E2F7] text-[#0B4AA6] font-semibold"
                  >
                    Visit Website
                    <FiExternalLink />
                  </a>
                )}
              </div>

              <div className="bg-white border border-[#E4EAF8] rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-slate-700 text-sm font-medium inline-flex items-center gap-1">
                    <CiLocationOn />
                    Global HQ: {internship.location || "N/A"}
                  </p>
                  <a
                    href={mapSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#0B4AA6] hover:underline whitespace-nowrap"
                  >
                    Open in Maps
                  </a>
                </div>

                <div className="mt-3 h-36 rounded-xl border border-[#E4EAF8] overflow-hidden bg-white">
                  <iframe
                    title="Company location map"
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </aside>
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
