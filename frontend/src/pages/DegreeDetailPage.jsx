import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { degreesData } from '../components/degree-program/degreesData';
import { MdOutlineStarOutline } from 'react-icons/md';

const DegreeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = degreesData.find((d) => d.id === parseInt(id));
    if (found) {
      setCourse(found);
    }
  }, [id]);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center mt-20">
          <p className="text-xl text-slate-500">Degree program not found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-5 mt-10 ">

        <div className=" flex flex-col  ">

          <main className="flex-grow w-full max-w-5xl mx-auto p-5 rounded-lg bg-white">

            {/* Course Image */}
            {course.image && (
              <div className="w-full h-64 md:h-80 bg-slate-100 rounded-xl overflow-hidden mb-10 relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {/* Rating Overlay */}
                {course.rating && (
                  <div className="absolute top-4 right-4 flex items-center  gap-2 bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-lg  shadow-md">
                    {/* <MdOutlineStarOutline size={20}/> */}
                    <span className="font-bold text-[13px] text-slate-900">{course.rating} / 5</span>
                    <span className="text-slate-600 text-[13px] font-medium">({course.reviews} reviews)</span>
                  </div>
                )}
              </div>
            )}

            {/* Header Information */}
            <div className="space-y-4 mb-10">
              <div className="text-blue-700 font-bold text-sm uppercase tracking-wider">{course.level}</div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {course.title}
              </h1>
              <div className="text-slate-500 font-medium flex items-center gap-2 text-lg">
                <i className="bi bi-bank"></i> {course.university}
              </div>

              {/* Call to Action */}
              <div className="mt-6">
                <button
                  onClick={() => console.log('Enquire', course.id)}
                  className="bg-[#00A9E0] hover:bg-[#0089B8] text-white font-bold py-3 px-6 rounded-full transition-all text-base shadow-md flex items-center justify-center gap-2 cursor-pointer w-fit"
                >
                  Enquire Now <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>

            {/* Course Overview */}
            <div className="space-y-4 mb-10">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Course Overview</h2>
              <p className="text-slate-600 text-base leading-relaxed">{course.description}</p>
              <p className="text-slate-600 text-base leading-relaxed">{course.details}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="text-slate-400 uppercase tracking-wider font-semibold mb-1 text-xs">Duration</div>
                <div className="text-slate-900 font-bold text-sm flex items-center gap-2">
                  <i className="bi bi-clock text-slate-400"></i> {course.duration}
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="text-slate-400 uppercase tracking-wider font-semibold mb-1 text-xs">Learning Pace</div>
                <div className="text-slate-900 font-bold text-sm flex items-center gap-2">
                  <i className="bi bi-graph-up-arrow text-slate-400"></i> {course.pace}
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="text-slate-400 uppercase tracking-wider font-semibold mb-1 text-xs">Tuition Fees</div>
                <div className="text-slate-900 font-bold text-sm flex items-center gap-2">
                  <i className="bi bi-cash-stack text-slate-400"></i> {course.fees?.replace('£', '₹')}
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="text-slate-400 uppercase tracking-wider font-semibold mb-1 text-xs">Awarding Body</div>
                <div className="text-slate-900 font-bold text-sm flex items-center gap-2">
                  <i className="bi bi-mortarboard text-slate-400"></i> {course.level}
                </div>
              </div>
            </div>

            {/* Key Admission Requirements */}
            <div className="space-y-4 mb-10">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Key Admission Requirements</h2>
              <p className="text-slate-600 text-base leading-relaxed">{course.entryRequirements}</p>
            </div>



          </main>
        </div>
      </div>
    </>
  );
};

export default DegreeDetailPage;
