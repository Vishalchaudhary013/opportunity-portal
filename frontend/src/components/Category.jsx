import React from 'react';
import { GoArrowRight, GoArrowUpRight } from 'react-icons/go';
import {
  LuBriefcase,
  LuWrench,
  LuBuilding2,
  LuUserPlus,
  LuPresentation,
  LuAward,
  LuGraduationCap,
  LuBookOpen,
  LuLibrary,
  LuGlobe
} from "react-icons/lu";
import { Link } from 'react-router-dom';

const categories = [
  { id: 1, path:"/interships", title: "Internships", count: "3,452", icon: <LuBriefcase size={28} />, colors: { bg: "#EEF2FF", mid: "#818CF8", dark: "#4F46E5" } },
  { id: 2, title: "Apprenticeships", path:"/apprenticeships", count: "1,252", icon: <LuWrench size={28} />, colors: { bg: "#FDF4FF", mid: "#E879F9", dark: "#C026D3" } },
  { id: 3, title: "Jobs", path:"/jobs",  count: "5,485", icon: <LuBuilding2 size={28} />, colors: { bg: "#FFF7ED", mid: "#FDBA74", dark: "#F97316" } },
  { id: 4, title: "Industry Mentorships", path:"/industry-mentorships", count: "2,841", icon: <LuUserPlus size={28} />, colors: { bg: "#FEFCE8", mid: "#FDE047", dark: "#EAB308" } },
  { id: 5, title: "Bootcamps", path:"/bootcamps", count: "1,052", icon: <LuPresentation size={28} />, colors: { bg: "#F0FDF4", mid: "#86EFAC", dark: "#22C55E" } },
  { id: 6, title: "Certificate Programs", path:"/certificate-programs", count: "8,532", icon: <LuAward size={28} />, colors: { bg: "#F0FDFA", mid: "#5EEAD4", dark: "#14B8A6" } },
  { id: 7, title: "Post Graduate Programs", path:"/post-graduate-programs", count: "4,120", icon: <LuGraduationCap size={28} />, colors: { bg: "#FFF1F2", mid: "#FDA4AF", dark: "#E11D48" } },
  { id: 8, title: "Masters' Degrees", path:"/masters-degrees", count: "2,305", icon: <LuBookOpen size={28} />, colors: { bg: "#F8FAFC", mid: "#94A3B8", dark: "#475569" } },
  { id: 9, title: "Integrated Degrees" , path:"/integrated-degrees", count: "1,840", icon: <LuLibrary size={28} />, colors: { bg: "#ECFEFF", mid: "#67E8F9", dark: "#06B6D4" } },
  { id: 10, title: "Global PG Programs", path:"/global-programs", count: "3,210", icon: <LuGlobe size={28} />, colors: { bg: "#F5F3FF", mid: "#A78BFA", dark: "#7C3AED" } },
];

const Category = () => {
  return (
    <>
      <div className=''>
        <section className="py-15 w-full max-w-[1350px] px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3.5">
              Your Career Launchpad Starts Here
              {/* Explore <span className="font-light italic text-gray-600">Categories</span> */}
            </h2>
            <p className='w-[900px] mx-auto text-gray-600 font-medium mb-2'>Finding the right path after graduation shouldn't be a challenge. We’ve structured our career solutions into distinct pillars to help you build competitive skills, connect with industry leaders, and secure your future.</p>
            <p className='font-semibold'>Choose a category below to take your next big step:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-10">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className="group relative overflow-hidden flex flex-col justify-between py-4 px-5 rounded-[12px] transition-transform duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 "
                style={{ backgroundColor: category.colors.bg }}
              >
                {/* SVG for cloude*/}
                <div className="absolute right-0 bottom-0 top-0 w-full pointer-events-none overflow-hidden rounded-r-[12px]">
                  <svg
                    width="320"
                    height="180"
                    viewBox="0 0 320 180"
                    fill="none"
                    className="absolute right-0 bottom-0 h-[70px] md:h-[59px] w-auto transform translate-x-7 translate-y-2 group-hover:scale-105 transition-transform duration-500"
                  >
                    <path
                      d="M320 180H0C0 140 35 110 80 110C90 70 125 40 170 40C185 15 215 0 250 0C290 0 320 25 320 65V180Z"
                      fill={category.colors.dark}
                    />
                  </svg>
                </div>

                {/* Text Content */}
                <div className="relative z-10 flex flex-col gap-8 justify-between w-full h-full">
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 leading-snug text-left">
                    {category.title}
                  </h3>
                  <p className="text-[12px] self-end text-gray-700  font-semibold opacity-80 flex items-center gap-3">
                    {category.count} Programs <GoArrowUpRight size={18} className='mt-0.5' />
                  </p>
                </div>

                {/* Icon */}
                {/* <div className="relative z-10 text-white bg-black/10 p-2 rounded-full backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 mr-1 shadow-sm">
              {category.icon}
            </div> */}
              </Link>
            ))}

          </div>
          <div className='flex justify-center '>

            <Link
              to="/category"
              className="flex gap-0.5 items-center group"
            >
              <div className="font-medium mt-1 text-slate-900 bg-red-600 text-white py-1 px-4 rounded-4xl transition-colors duration-300 ">
                View All
              </div>

              <span className="inline-flex items-center justify-center w-8 h-8 bg-red-600 rounded-full transition-all duration-300  group-hover:translate-x-1.5">
                <GoArrowRight size={22} className="text-white" />
              </span>
            </Link>



          </div>
        </section>
      </div>
    </>
  );
};

export default Category;
