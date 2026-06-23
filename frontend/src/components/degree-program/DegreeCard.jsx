import React from 'react';
import { IoSchoolOutline, IoTimeOutline } from 'react-icons/io5';
import universityLogo from "../../assets/logos/universityLogo.png";

// Define the three cycling colors: blue, green, pink
const CARD_THEMES = [
  {
    name: 'blue',
    border: 'border-t-[6px] border-t-[#0d62b2] hover:border-[#0d62b2]',
    text: 'text-[#0d62b2]',
    btn: 'bg-[#0d62b2] hover:bg-[#0a4f91] text-white',
    hoverBg: 'bg-[#0d62b2]',
    shadow: 'shadow-blue-50/50',
    colorHex: '#0d62b2'
  },
  {
    name: 'green',
    border: 'border-t-[6px] border-t-[#00b294] hover:border-[#00b294]',
    text: 'text-[#00b294]',
    btn: 'bg-[#00b294] hover:bg-[#008f77] text-white',
    hoverBg: 'bg-[#00b294]',
    shadow: 'shadow-emerald-50/50',
    colorHex: '#00b294'
  },
  {
    name: 'pink',
    border: 'border-t-[6px] border-t-[#e6007e] hover:border-[#e6007e]',
    text: 'text-[#e6007e]',
    btn: 'bg-[#e6007e] hover:bg-[#b80064] text-white',
    hoverBg: 'bg-[#e6007e]',
    shadow: 'shadow-pink-50/50',
    colorHex: '#e6007e'
  }
];

export default function DegreeCard({ degree, index = 0, onCardClick = () => {} }) {
  if (!degree) return null;

  const theme = CARD_THEMES[index % 3];

  // Handle click on card: call parent handler, prevent propagation if needed
  const handleCardClick = () => {
    onCardClick(degree);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer min-h-[400px]"
    >
      {/* Straight line at the top */}
      <div className={`h-[6px] w-full flex-shrink-0 ${theme.hoverBg}`}></div>

      {/* --- A. DEFAULT CARD STATE --- */}
      <div className="px-6 pt-6 pb-8 flex-grow flex flex-col justify-between h-full space-y-4 group-hover:opacity-0 group-hover:-translate-y-2 transition-all duration-500 ease-in-out">

        <div className="space-y-4">
          {/* Header Row: University Name & Logo */}
          <div className="flex items-center justify-between w-full gap-2">
            {/* University Name */}
            <div className="text-[12px] font-semibold text-slate-500 leading-tight">
              {degree.university}
            </div>
            {/* University Logo */}
            <img
              src={degree.logo || universityLogo}
              alt={degree.university}
              className="w-[32px] h-[35px] object-contain flex-shrink-0"
              onError={(e) => {
                e.target.onerror = null; // prevents looping
                e.target.src = universityLogo;
              }}
            />
          </div>

          {/* Content Group (Subject Category, Title) */}
          <div className="space-y-2">
            {/* Subject Category */}
            <span className={`text-xs font-bold uppercase tracking-wider block ${theme.text}`}>
              {degree.degreeType}
            </span>
            {/* Course Title */}
            <h3 className="font-extrabold text-slate-800 text-lg leading-snug line-clamp-3">
              {degree.title}
            </h3>
          </div>

          {/* Metadata Details */}
          <div className="space-y-3 pt-3">
            {/* Level */}
            <div className="text-slate-900 text-base font-medium flex items-center gap-2">
              <IoSchoolOutline className="text-slate-700 text-[18px]" />
              <span>{degree.degreeType}</span>
            </div>

            {/* Duration */}
            <div className="text-slate-900 text-base font-medium flex items-center gap-2">
              <IoTimeOutline className="text-slate-700 text-[18px]" />
              <span>{degree.duration}</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className={`w-full text-center font-bold py-3 rounded-xl text-sm transition-all duration-300 ${theme.btn}`}>
          MORE INFO
        </div>
      </div>

      {/* --- B. HOVER CARD STATE (OVERLAY) --- */}
      <div className={`absolute inset-0 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out flex flex-col justify-between p-6 text-white ${theme.hoverBg}`}>
        {/* Header: Category + Plus Circle Icon */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white/95">
            {degree.degreeType}
          </span>
          <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center">
            <i className="bi bi-plus-lg text-xs"></i>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-white text-lg leading-snug line-clamp-3">
          {degree.title}
        </h3>

        {/* Fact Sheet */}
        <div className="space-y-3 pt-2">
          {/* Duration */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-white/60">Duration:</div>
            <div className="text-sm font-semibold">{degree.duration}</div>
          </div>

          {/* Start Date / Deadline */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-white/60">Deadline:</div>
            <div className="text-sm font-semibold">{degree.deadline}</div>
          </div>
        </div>

        {/* Price & White CTA Button */}
        <div className="pt-4 flex flex-col gap-3">
          {/* Price */}
          <div className="text-[18px] font-extrabold tracking-tight leading-snug">
            {degree.fees}
          </div>

          {/* White Button */}
          <div
            className="bg-white text-center font-bold py-2.5 rounded-xl text-sm transition-colors duration-300 shadow-sm"
            style={{ color: theme.colorHex }}
          >
            MORE INFO
          </div>
        </div>
      </div>
    </article>
  );
}
