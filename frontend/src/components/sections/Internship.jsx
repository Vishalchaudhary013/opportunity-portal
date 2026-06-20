import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useOpportunities } from "../../context/OpportunitiesContext";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { LuDot } from "react-icons/lu";
import { IoBagOutline } from "react-icons/io5";
import {
  formatDeadlineLabel,
  formatDeadlineStatus,
  formatStipendPeriod,
  formatStipendText,
  getInternshipTags,
  isInternshipOpen,
  resolveWorkMode,
} from "../../utils/internshipCardData";
import {
  Briefcase,
  Cpu,
  LineChart,
  Code,
  Monitor,
  User,
  HeartPulse,
  Globe,
  Users,
  Palette,
  FlaskConical,
  Sigma,
} from "lucide-react";
import SectionTitle from "../SectionTitle";
import FilterChips from "../FilterChips";
import {
  Building2,
  BookOpen,
  GraduationCap,
  Handshake,
  Landmark,
  Search,
  ClipboardCheck,
  CalendarDays,
  Coins,
  Wallet,
  Clock,
  Network
} from "lucide-react";
const Internship = ({ limit }) => {
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const locationFilter = searchParams.get("location");

  const categories = [
    // { name: "Business", icon: <Briefcase size={16} /> },
    // { name: "Artificial Intelligence", icon: <Cpu size={16} /> },
    // { name: "Data Science", icon: <LineChart size={16} /> },
    // { name: "Computer Science", icon: <Code size={16} /> },
    // { name: "Information Technology", icon: <Monitor size={16} /> },
    // { name: "Personal Development", icon: <User size={16} /> },
    // { name: "Healthcare", icon: <HeartPulse size={16} /> },
    // { name: "Language Learning", icon: <Globe size={16} /> },
    // { name: "Social Sciences", icon: <Users size={16} /> },
    // { name: "Arts and Humanities", icon: <Palette size={16} /> },
    // { name: "Physical Science", icon: <FlaskConical size={16} /> },
    // { name: "Math & Logic", icon: <Sigma size={16} /> },

    { name: "Paid", icon: <Coins size={16} /> },
    { name: "Stipended", icon: <Wallet size={16} /> },
    { name: "Flexible Hours", icon: <Clock size={16} /> },
    { name: "Pre-Placement Offers", icon: <Handshake size={16} /> },
    { name: "Network Building", icon: <Network size={16} /> },
    // { name: "Research", icon: <Search size={16} /> },
    // { name: "Assessment", icon: <ClipboardCheck size={16} /> },
    // { name: "Summer / Winter Break", icon: <CalendarDays size={16} /> },
  ];

  const { opportunities, isInternshipSaved, toggleSavedInternship } =
    useOpportunities();

  const intershipData = React.useMemo(() => {
    return opportunities
      .filter((item) => item.type === "Internship" && isInternshipOpen(item))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [opportunities]);

  const visibleInternships = React.useMemo(() => {
    let data = intershipData;
    if (selectedCategory) {
      const query = selectedCategory.toLowerCase();
      data = data.filter(
        (item) =>
          (item.industry && item.industry.toLowerCase().includes(query)) ||
          (item.functionalRole &&
            item.functionalRole.toLowerCase().includes(query)) ||
          (item.title && item.title.toLowerCase().includes(query)),
      );
    }
    if (locationFilter) {
      const normalizedLocationFilter = locationFilter.trim().toLowerCase();
      data = data.filter((item) => {
        const loc = String(item.location || "").toLowerCase();
        return loc.includes(normalizedLocationFilter);
      });
    }
    return typeof limit === "number" ? data.slice(0, limit) : data;
  }, [intershipData, selectedCategory, limit, locationFilter]);

  return (
    //   <>
    //   <div
    //     className="bg-white rounded-[8px] w-[260px] hover:-translate-y-1 transition overflow-hidden"
    //     style={{ boxShadow: "rgba(0,0,0,0.2) 0px 3px 8px" }}
    //   >
    //     {/* TOP SECTION */}
    //     <div className="bg-[#cfe3e6] p-[15px] relative">

    //       {/* LOGO FIX */}
    //       <div className="w-[40px] h-[40px] bg-white rounded-xl flex items-center justify-center overflow-hidden">
    //         <img
    //           src={
    //             job.logo
    //               ? `http://localhost:5000/uploads/${encodeURIComponent(job.logo)}`
    //               : "/default-logo.png"
    //           }
    //           alt="logo"
    //           className="h-[30px] object-contain"
    //           onError={(e) => {
    //             e.target.src = "/default-logo.png";
    //           }}
    //         />
    //       </div>

    //       {/* DATE BADGE + TOOLTIP */}
    //       <div
    //         className="absolute top-4 right-4 bg-white rounded-xl w-[40px] h-[40px] text-xs flex flex-col items-center justify-center cursor-pointer"
    //         title={`Joining Date: ${startDate.toDateString()}`}
    //       >
    //         <span className="bg-black text-white w-full text-center text-[10px] rounded-t-xl">
    //           {month}
    //         </span>
    //         <span className="font-bold">{day}</span>
    //         <span className="text-[10px] text-gray-500">{weekday}</span>
    //       </div>

    //       {/* COMPANY */}
    //       <p className="mt-3 text-sm text-gray-700 font-medium">
    //         {job.companyName}
    //       </p>

    //       {/* TITLE */}
    //       <h2 className="text-[15px] font-semibold">
    //         {job.workProfile}
    //       </h2>

    //       {/* TAGS */}
    //       <div className="flex gap-2 mt-2 text-[10px] flex-wrap">
    //         <span className="bg-white px-2 py-[2px] rounded border">
    //           {job.workType}
    //         </span>
    //       </div>

    //       {/*  DAYS LEFT */}
    //       <div className="flex justify-between mt-3 text-[12px] text-gray-700">
    //         <span
    //           className="cursor-pointer"
    //           title={`${daysLeft} days left to apply`}
    //         >
    //           {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
    //         </span>

    //         <span>{job.location}</span>
    //       </div>
    //     </div>

    //     {/* BOTTOM */}
    //     <div className="flex justify-between items-center p-[12px]">
    //       <span className="text-sm font-medium">{reward}</span>

    //       <div className="flex gap-2">
    // {/* VIEW */}
    // <button
    //   onClick={() => {
    //     console.log("VIEW CLICKED:", job._id);
    //     navigate(`/internship/${job._id}`);
    //   }}
    //   className="bg-black text-white px-3 py-1 rounded text-xs"
    // >
    //   View
    // </button>

    // {/* APPLY */}
    //   <button
    //     onClick={handleApplyClick}
    //     className="bg-red-600 text-white px-3 py-1 rounded text-xs"
    //   >
    //     Apply
    //   </button>
    //   </div>
    //     </div>
    //   </div>
    //   </>
    <>
      <div className="">
        <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto py-8 sm:py-10 ">

           <div className="mb-3">
            <SectionTitle
                title="Internships"
                subtitle="Gain Practical Industry Experience Before Diving into a Full-Time Career"
                defination="A short-term professional learning experience that offers meaningful, practical work related to a student’s field of study or career interest. Internships bridge the gap between academic theory and real-world execution."
              />
           </div>
          
          <FilterChips 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {visibleInternships.map((data) => (
              <Link
                to={`/internship/${data.id}`}
                key={data.id}
                className="py-4 px-3 border bg-white border-black/10 rounded-xl group hover:transition hover:scale-101"
              >
                {(() => {
                  const isSaved = isInternshipSaved(data.id);
                  return (
                    <div className="flex justify-between gap-3 mb-5">
                      <ul className="flex items-center gap-3 min-w-0">
                        <li>
                          {data.logo ? (
                            <img
                              src={data.logo}
                              alt={data.company}
                              className="h-9 w-9 overflow-hidden rounded-lg"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-lg bg-black text-white font-semibold flex items-center justify-center">
                              {String(data.company || "I")
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                        </li>
                        <li className="flex flex-col min-w-0">
                          <span className="text-sm text-red-600 font-medium">
                            {data.company}
                          </span>
                          <span className="font-medium truncate">
                            {data.title}
                          </span>
                        </li>
                      </ul>
                      <button
                        type="button"
                        className="cursor-pointer"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleSavedInternship(data.id);
                        }}
                        aria-label={
                          isSaved ? "Unsave internship" : "Save internship"
                        }
                        title={isSaved ? "Saved" : "Save for later"}
                      >
                        {isSaved ? (
                          <BsBookmarkFill
                            size={22}
                            className="pt-0.5 text-[#0B4AA6]"
                          />
                        ) : (
                          <BsBookmark size={22} className="pt-0.5" />
                        )}
                      </button>
                    </div>
                  );
                })()}

                <ul className="flex flex-wrap items-center gap-1.5 mb-3">
                  <li className="flex gap-1 items-center">
                    <span>
                      <CiLocationOn />
                    </span>
                    <span className="text-sm font-medium truncate max-w-42.5">
                      {data.location}
                    </span>
                  </li>

                  <li>
                    <LuDot />
                  </li>
                  <li className="flex gap-1 items-center">
                    <span>
                      <IoBagOutline />
                    </span>
                    <span className="text-sm font-medium">
                      {resolveWorkMode(data)}
                    </span>
                  </li>
                </ul>

                <div className="flex gap-2  flex-wrap mb-4">
                  {getInternshipTags(data).map((tag, i) => (
                    <span
                      key={i}
                      className="flex items-center justify-center bg-blue-100 text-blue-800 px-2 p-0.5 text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="border border-black/5 rounded-xl p-4 bg-white mb-6">
                  <p className="text-sm  font-medium uppercase">Stipend</p>

                  <h2 className="text-lg font-semibold mt-1">
                    {formatStipendText(data)}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {formatStipendPeriod(data)}
                  </p>
                </div>

                <div className="flex items-start gap-1.5  ">
                  <CiCalendar size={18} />

                  <ul>
                    <li className="flex flex-col">
                      <span className="text-xs">
                        Deadline: <b>{formatDeadlineLabel(data.deadline)}</b>
                      </span>
                      <span className="uppercase text-red-500 text-[11px] font-medium">
                        {formatDeadlineStatus(data.deadline)}
                      </span>
                    </li>
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Internship;
