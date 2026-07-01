import React, { useState, useEffect } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { LuRocket } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import { TbSwitch3 } from "react-icons/tb";
import { AiOutlineGlobal } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

const Hero = () => {
  const images = [
    "https://edeco-master-page.vercel.app/assets/banner-C3sdVHtu.png",
    "https://edeco-master-page.vercel.app/assets/banner2-C4NiUsvV.png",
    "https://edeco-master-page.vercel.app/assets/banner2-C4NiUsvV.png",
    "https://edeco-master-page.vercel.app/assets/banner3-fGYyopAL.png",
    
  ];

  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Courses");
  const navigate = useNavigate();

  const cardsData = [
    { 
      bg: "bg-[#C9F29B]", 
      alignTop: true, 
      clipPath: "url(#top-clip)",
      level: "Beginner",
      title: "UI/UX Design",
      duration: "6 months of intensive study"
    },
    { 
      bg: "bg-[#FF985E]", 
      alignTop: false, 
      clipPath: "url(#bottom-clip)",
      level: "Intermediate",
      title: "Packaging Design",
      duration: "1 year of dedicated study"
    },
    { 
      bg: "bg-[#B5D2F0]", 
      alignTop: true, 
      clipPath: "url(#top-clip)",
      level: "Advanced",
      title: "Data Science",
      duration: "2 years of rigorous learning"
    },
    { 
      bg: "bg-[#00A9E0]", 
      alignTop: false, 
      clipPath: "url(#bottom-clip)",
      level: "Beginner",
      title: "Web Development",
      duration: "8 months of project building"
    },
    { 
      bg: "bg-[#C9F29B]", 
      alignTop: true, 
      clipPath: "url(#top-clip)",
      level: "Intermediate",
      title: "Graphic Design",
      duration: "5 months of creative study"
    },
    { 
      bg: "bg-[#FF985E]", 
      alignTop: false, 
      clipPath: "url(#bottom-clip)",
      level: "Advanced",
      title: "Machine Learning",
      duration: "1.5 years of deep learning"
    },
  ];

  const CARDS_SLIDE = 3;

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? cardsData.length - CARDS_SLIDE : prev - CARDS_SLIDE));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + CARDS_SLIDE >= cardsData.length ? 0 : prev + CARDS_SLIDE));
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + CARDS_SLIDE >= cardsData.length ? 0 : prev + CARDS_SLIDE));
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/internship?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/internship');
    }
  };


  return (
   <>
   <div className="bg-[#EAF6FF]">
     <div className="w-full min-h-[calc(100vh-70px)] md:h-[calc(100vh-70px)] flex flex-col justify-center scrollbar-hide overflow-x-hidden gap-8 md:gap-12 pt-12 md:pt-18 pb-8 md:pb-4">
      
      {/* SVG Clip Paths for perfectly rounded slants */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="top-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0 0.12 Q 0 0 0.1333 0 L 0.8667 0 Q 1 0 1 0.12 L 1 0.88 Q 1 1 0.8667 1 L 0.8556 1 Q 0.8 1 0.7444 0.9757 L 0.0556 0.6743 Q 0 0.65 0 0.6 Z" />
          </clipPath>
          <clipPath id="bottom-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0 0.5 L 0 0.4 Q 0 0.35 0.0556 0.3257 L 0.7444 0.0243 Q 0.8 0 0.8556 0 L 0.8667 0 Q 1 0 1 0.12 L 1 0.88 Q 1 1 0.8667 1 L 0.1333 1 Q 0 1 0 0.88 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Sliding Cards at Top */}
      <div 
        className="w-full relative px-4 md:px-5 mx-auto group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation Arrows (Hidden on mobile) */}
        <button 
          onClick={prevSlide}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hover:bg-gray-50 hover:scale-105"
        >
          <MdKeyboardArrowLeft size={30} />
        </button>
        <button 
          onClick={nextSlide}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hover:bg-gray-50 hover:scale-105"
        >
          <MdKeyboardArrowRight size={30} />
        </button>

        <div 
          className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide md:transition-transform md:duration-700 md:ease-in-out hero-slider-transform"
          style={{ '--slider-transform': `translateX(-${index * 544}px)` }}
        >
          {[...cardsData, ...cardsData].map((card, i) => (
            <div key={i} className={`relative p-4 md:p-5 w-[85vw] sm:w-[400px] md:w-[520px] h-[260px] md:h-[280px] rounded-xl md:rounded-2xl ${card.bg} flex-shrink-0 shadow-sm snap-center`}>
              <img
                src="/hero_students.png"
                alt=""
                className={`absolute ${card.alignTop ? 'top-4' : 'bottom-4'} right-4 w-[160px] md:w-[190px] h-[200px] md:h-[235px] object-cover rounded-[10px] md:rounded-2xl`}
                style={{ clipPath: card.clipPath }}
              />
              <span className={`absolute ${card.alignTop ? 'top-6' : 'bottom-6'} left-6 md:left-8 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full inline-flex justify-center items-center shadow-sm text-black hover:scale-105 transition-transform cursor-pointer`}>
                <GoArrowUpRight size={20} className="md:w-6 md:h-6" />
              </span>
              <div className={`absolute ${card.alignTop ? 'bottom-6' : 'top-6'} left-6 md:left-8 right-0 flex flex-col items-start gap-2 pr-[175px] md:pr-[215px]`}>
                <span className="border border-black/50 py-0.5 px-2 md:px-3 rounded-full text-xs md:text-sm font-medium">{card.level}</span>
                <div className="leading-tight md:leading-6.5 w-full">
                   <h3 className="text-[22px] sm:text-[24px] md:text-[28px] font-medium text-black leading-tight mb-1 md:mb-0 break-words">{card.title}</h3>
                   <span className="text-sm md:text-base break-words inline-block">{card.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabbed Search Bar Below Slider */}
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto mt-6 md:mt-8">
        {/* Tabs */}
        <div className="flex w-full overflow-x-auto scrollbar-hide items-end gap-[2px]">
          {["Internship",  "Apprenticeships", "Jobs", "Degree Programs", "Global Programs", "Site Search"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 whitespace-nowrap px-4 md:px-5 py-3 md:py-4.5 text-[15px] md:text-[18px] font-semibold rounded-t-xl border border-b-0 transition-colors ${
                activeTab === tab
                  ? "bg-red-600 text-white  relative z-10"
                  : "bg-[#1F2853] text-white "
              }`}
              style={activeTab === tab ? { marginBottom: "-1px" } : {}}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Inputs Container */}
        <form 
          onSubmit={handleSearch}
          className="bg-white px-4 md:px-5 py-5 md:py-7 rounded-b-xl shadow-sm flex gap-4 md:gap-5 flex-col lg:flex-row w-full  relative z-0"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search by title..."
            className="flex-1 px-4 py-3 md:py-3.5 border border-gray-200 rounded-md outline-none focus:border-[#00A9E0] text-gray-700 placeholder:text-gray-500 bg-[#F8FAFC]"
          />
          
          {/* <div className="flex-1 relative">
            <select 
              className="w-full px-4 py-3 md:py-3.5 border border-gray-200 rounded-md outline-none focus:border-[#00A9E0] appearance-none bg-[#F8FAFC] text-gray-700 relative z-10 cursor-pointer"
            >
              <option value="">by College here...</option>
              <option value="college1">College 1</option>
              <option value="college2">College 2</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00A9E0] z-20 pointer-events-none">
              <MdKeyboardArrowDown size={24} />
            </div>
          </div> */}

          <button 
            type="submit"
            className="bg-[#1F2853] transition-colors text-white px-8 py-3 md:py-3.5 rounded-md font-bold tracking-wide whitespace-nowrap"
          >
            SEARCH 
          </button>
        </form>
      </div>
    </div>
   </div>
   </>
  );
};

export default Hero;

