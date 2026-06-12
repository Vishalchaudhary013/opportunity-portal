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
} from "react-icons/fi";
import { useAdminContext } from "./AdminContext";
import { LayoutPanelLeft } from "lucide-react";

const ADMIN_MENU_ITEMS = [
  { key: "Internship", label: "Internships" },
  { key: "Global Program", label: "Global Programs" },
  { key: "Jobs", label: "Jobs" },
  { key: "Bootcamps", label: "Bootcamps" },
  { key: "Masterclasses", label: "Masterclasses" },
  { key: "Degree Programs", label: "Degree Programs" },
  { key: "PG Programs", label: "PG Programs" },
 
  { key: "Closed Application", label: "Closed Application" },
];

const SUPER_MENU_ITEMS = [
  { key: "Overview", label: "Overview" },
  { key: "Admins", label: "Admins" },
  { key: "Users", label: "Users" },
  { key: "Internship", label: "Internships" },
  { key: "Global Program", label: "Global Programs" },
  { key: "Jobs", label: "Jobs" },
  { key: "Bootcamps", label: "Bootcamps" },
  { key: "Masterclasses", label: "Masterclasses" },
  { key: "Degree Programs", label: "Degree Programs" },
  { key: "PG Programs", label: "PG Programs" },
  { key: "All Application", label: "All Application" },
  { key: "Closed Application", label: "Closed Application" },
];

const getMenuIcon = (key) => {
  const icons = {
    Internship: <FiGrid size={16} />,
    "Global Program": <FiPieChart size={16} />,
    Jobs: <FiBriefcase size={16} />,
    Bootcamps: <FiCheckCircle size={16} />,
    Masterclasses: <FiFileText size={16} />,
    "Degree Programs": <FiGrid size={16} />,
    "PG Programs": <FiPieChart size={16} />,

    "All Application": <LayoutPanelLeft  size={16} />,
    "Closed Application": <FiEyeOff size={16} />,
    Applications: <FiFileText size={16} />,
    Overview: <FiPieChart size={16} />,
    "Post Opportunity": <FiBriefcase size={16} />,
    Admins: <FiShield size={16} />,
    Users: <FiUsers size={16} />,
  };
  return icons[key] || null;
};

const AdminSidebar = () => {
  const { isSuperDashboard, isSuperAdmin, activeSection, handleSectionChange, handleLogout } = useAdminContext();

  const menuItems = isSuperDashboard && isSuperAdmin ? SUPER_MENU_ITEMS : ADMIN_MENU_ITEMS;

  return (
    <aside className="bg-[#E4EBFB] border border-[#D8E2F7] rounded-2xl p-4 xl:sticky xl:top-0 h-full flex flex-col overflow-hidden">
      <div className="mb-7">
        <p className="text-slate-900 text-xl font-semibold">Admin Control</p>
        <p className="text-[11px] tracking-[0.16em] text-slate-500 mt-1 font-semibold"></p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-7 sm:grid-cols-3 xl:grid-cols-1 xl:space-y-2 xl:gap-0 overflow-y-auto custom-scrollbar pr-1">
        {menuItems.map((item) => (
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
