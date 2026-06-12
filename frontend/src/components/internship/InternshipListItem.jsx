import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FiMapPin, FiShare2, FiUsers, FiCalendar } from "react-icons/fi";
import { LuBriefcaseBusiness } from "react-icons/lu";

const InternshipListItem = ({
  item,
  isSaved,
  stipendLabel,
  skillsList,
  experienceText,
  locationText,
  deadlineLabel,
  postedDateLabel,
  companyInitial,
  onShare,
  onToggleSave,
}) => {
  const navigate = useNavigate();
  const visibleTags = skillsList.slice(0, 4);
  const moreCount = Math.max(skillsList.length - visibleTags.length, 0);
  const applicantCount = Number(item.applicationCount || item.applicantsCount || 0);

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
          <div className="flex items-center gap-3 mt-1">
            <p className="truncate text-[15px] text-[#4B5563]">
              {item.company || "Company"}
            </p>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100 whitespace-nowrap">
              {item.internshipType || "Internship"}
            </span>
          </div>

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
              await onShare(item);
            }}
          >
            <FiShare2 className="text-[18px]" />
          </button>

          <button
            type="button"
            className="rounded-md p-1 transition hover:bg-slate-100 hover:text-slate-600"
            onClick={(event) => {
              event.stopPropagation();
              onToggleSave(item.id);
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
};

export default InternshipListItem;
