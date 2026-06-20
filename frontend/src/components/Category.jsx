import React from 'react';
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

const categories = [
  { id: 1, title: "Internships", count: "3,452", icon: <LuBriefcase size={28} /> },
  { id: 2, title: "Apprenticeships", count: "1,252", icon: <LuWrench size={28} /> },
  { id: 3, title: "Jobs", count: "5,485", icon: <LuBuilding2 size={28} /> },
  { id: 4, title: "Industry Mentorships", count: "2,841", icon: <LuUserPlus size={28} /> },
  { id: 5, title: "Bootcamps", count: "1,052", icon: <LuPresentation size={28} /> },
  { id: 6, title: "Certificate Programs", count: "8,532", icon: <LuAward size={28} /> },
  { id: 7, title: "Post Graduate Programs", count: "4,120", icon: <LuGraduationCap size={28} /> },
  { id: 8, title: "Masters' Degrees", count: "2,305", icon: <LuBookOpen size={28} /> },
  { id: 9, title: "Integrated Degrees", count: "1,840", icon: <LuLibrary size={28} /> },
  { id: 10, title: "Global PG Programs", count: "3,210", icon: <LuGlobe size={28} /> },
];

const Category = () => {
  return (
    <>
    <div className='bg-[#F8F9FE]'>
        <section className="py-12 w-full max-w-[1350px] px-4 md:px-6 mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Explore Categories
          {/* Explore <span className="font-light italic text-gray-600">Categories</span> */}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-[#F8FAFC] hover:bg-[#00A9E0] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="w-20 h-20 rounded-full bg-white border border-black/5 group-hover:bg-white/20 flex items-center justify-center mb-5 transition-all duration-300">
              <div className=" group-hover:text-white transition-colors duration-300">
                {category.icon}
              </div>
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-white transition-colors duration-300 text-center mb-1">
              {category.title}
            </h3>
            <p className="text-[13px] text-gray-500 group-hover:text-white/80 transition-colors duration-300 text-center">
              {category.count} Programs
            </p>
          </div>
        ))}
      </div>
    </section>
    </div>
    </>
  );
};

export default Category;
