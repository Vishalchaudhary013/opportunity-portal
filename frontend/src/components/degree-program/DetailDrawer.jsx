import React from 'react';

export default function DetailDrawer({ course, onClose, onEnquireNowClick }) {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      {/* Overlay closing zone */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left border-l border-slate-100">
        <div>
          {/* Image banner */}
          <div className="relative h-60 bg-slate-100">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
            >
              <i className="bi bi-x-lg"></i>
            </button>
            <span className="absolute bottom-4 left-6 text-white text-xs font-bold tracking-wide uppercase bg-primary px-3 py-1 rounded-full">
              {course.subject}
            </span>
          </div>

          {/* Course details metadata */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-1">{course.level}</div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">{course.title}</h2>
              <div className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                <i className="bi bi-bank text-sm"></i> {course.university}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start text-sm w-fit">
              <i className="bi bi-star-fill text-amber-400"></i>
              <span className="font-bold text-slate-800">{course.rating}</span>
              <span className="text-slate-400">({course.reviews} reviews)</span>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Course Overview</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{course.description}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{course.details}</p>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <div className="text-slate-400 uppercase tracking-wider font-semibold mb-1">Duration</div>
                <div className="text-slate-800 font-bold text-sm flex items-center gap-1">
                  <i className="bi bi-clock text-slate-500"></i> {course.duration}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <div className="text-slate-400 uppercase tracking-wider font-semibold mb-1">Learning Pace</div>
                <div className="text-slate-800 font-bold text-sm flex items-center gap-1">
                  <i className="bi bi-graph-up-arrow text-slate-500"></i> {course.pace}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <div className="text-slate-400 uppercase tracking-wider font-semibold mb-1">Tuition Fees</div>
                <div className="text-slate-800 font-bold text-sm flex items-center gap-1">
                  <i className="bi bi-cash-stack text-slate-500"></i> {course.fees.replace('£', '₹')}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <div className="text-slate-400 uppercase tracking-wider font-semibold mb-1">Awarding Body</div>
                <div className="text-slate-800 font-bold text-sm flex items-center gap-1">
                  <i className="bi bi-mortarboard text-slate-500"></i> {course.level}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Key Admission Requirements</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{course.entryRequirements}</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-4">
          <button
            onClick={() => onEnquireNowClick(course.id)}
            className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-full transition-all text-sm shadow-md hover:shadow-lg shadow-blue-100 flex-1 flex items-center justify-center gap-1 cursor-pointer"
          >
            Enquire Now <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
