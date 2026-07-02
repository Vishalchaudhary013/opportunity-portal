import React from "react";
import {
  FiBriefcase,
  FiEyeOff,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiPieChart,
  FiShield,
  FiCheckCircle,
  FiUsers,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";
import { useAdminContext } from "./AdminContext";
import { LayoutPanelLeft, LocateIcon, Image as ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const CORE_ADMIN_ITEMS = [
  { key: "Closed Application", label: "Closed Application" },
];

const CORE_SUPER_ITEMS = [
  { key: "Overview", label: "Overview" },
  { key: "Admins", label: "Admins" },
  { key: "Users", label: "Users" },
  { key: "Location", label: "Location" },
  { key: "Gallery", label: "Gallery" },
  { key: "All Application", label: "All Application" },
  { key: "Closed Application", label: "Closed Application" },
];

const PROGRAM_ITEMS = [
  { key: "Internship", label: "Internships" },
  { key: "Apprenticeships", label: "Apprenticeships" },
  { key: "Jobs", label: "Jobs" },
  { key: "Mentorships", label: "Industry Mentorships" },
  { key: "Bootcamps", label: "Workshops & Bootcamps" },
  { key: "Certificate Programs", label: "Certificate Programs" },
  { key: "Bachelors Degrees", label: "Bachelor's Degrees" },
  { key: "Post Graduate Programs", label: "Post Graduate Programs" },
  { key: "Masters Degrees", label: "Masters' Degrees" },
  { key: "Doctorates & PhD", label: "Doctorates & PhD" },
  { key: "Integrated Degrees", label: "Integrated Degrees" },
  { key: "Global Program", label: "Global Programs" },
];

const getMenuIcon = (key) => {
  const icons = {
    Internship: <FiGrid size={16} />,
    Apprenticeships: <FiBriefcase size={16} />,
    Jobs: <FiBriefcase size={16} />,
    Mentorships: <FiUsers size={16} />,
    Bootcamps: <FiCheckCircle size={16} />,
    "Certificate Programs": <FiFileText size={16} />,
    "Bachelors Degrees": <FiGrid size={16} />,
    "Post Graduate Programs": <FiPieChart size={16} />,
    "Masters Degrees": <FiGrid size={16} />,
    "Doctorates & PhD": <FiGrid size={16} />,
    "Integrated Degrees": <FiPieChart size={16} />,
    "Global Program": <FiPieChart size={16} />,
    "All Application": <LayoutPanelLeft  size={16} />,
    "Closed Application": <FiEyeOff size={16} />,
    Applications: <FiFileText size={16} />,
    Overview: <FiPieChart size={16} />,
    "Post Opportunity": <FiBriefcase size={16} />,
    Admins: <FiShield size={16} />,
    Users: <FiUsers size={16} />,
    Location:<LocateIcon size={16} />,
    Gallery: <ImageIcon size={16} />
  };
  return icons[key] || null;
};

const AdminSidebar = () => {
  const { isSuperDashboard, isSuperAdmin, activeSection, handleSectionChange, handleLogout } = useAdminContext();

  const [selectedPrograms, setSelectedPrograms] = useState(() => {
    const saved = localStorage.getItem("admin_sidebar_preferences");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return ["Internship", "Jobs"];
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("admin_sidebar_preferences", JSON.stringify(selectedPrograms));
  }, [selectedPrograms]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProgram = (key) => {
    setSelectedPrograms(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const coreItems = isSuperDashboard && isSuperAdmin ? CORE_SUPER_ITEMS : CORE_ADMIN_ITEMS;
  const activeProgramItems = (isSuperDashboard && isSuperAdmin) 
    ? PROGRAM_ITEMS 
    : PROGRAM_ITEMS.filter(item => selectedPrograms.includes(item.key));
  
  let finalMenuItems = [];
  if (isSuperDashboard && isSuperAdmin) {
     finalMenuItems = [
       ...CORE_SUPER_ITEMS.slice(0, 5),
       ...activeProgramItems,
       ...CORE_SUPER_ITEMS.slice(5)
     ];
  } else {
     finalMenuItems = [
       ...activeProgramItems,
       ...CORE_ADMIN_ITEMS
     ];
  }

  return (
    <aside className="bg-[#E4EBFB] border border-[#D8E2F7]  p-4 xl:sticky xl:top-0 h-full flex flex-col overflow-hidden">
      <div className="mb-7 relative" ref={dropdownRef}>
        <div className="flex items-center justify-between">
          <p className="text-slate-900 text-xl font-semibold">Admin Control</p>
        </div>
        
        {!(isSuperDashboard && isSuperAdmin) && (
          <>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="mt-3 w-full flex items-center justify-between px-3 py-2 bg-white border border-[#DCE5FA] rounded-lg text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              Choose
              <FiChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#DCE5FA] rounded-lg shadow-xl z-50 max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-2 tracking-wider">Select Programs</p>
                {PROGRAM_ITEMS.map(item => {
                  const isSelected = selectedPrograms.includes(item.key);
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleProgram(item.key)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-blue-50 rounded transition-colors text-left"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                        {isSelected && <FiCheck size={10} className="text-white" />}
                      </div>
                      {item.label}
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-7 sm:grid-cols-3 xl:grid-cols-1 xl:space-y-2 xl:gap-0 overflow-y-auto custom-scrollbar pr-1">
        {finalMenuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => handleSectionChange(item.key)}
            className={`w-full flex items-center justify-center xl:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeSection === item.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            {getMenuIcon(item.key)}
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-[#D0DCF5] space-y-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg border border-slate-300 hover:bg-white/80 flex items-center justify-center xl:justify-start gap-2"
        >
          <FiLogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
