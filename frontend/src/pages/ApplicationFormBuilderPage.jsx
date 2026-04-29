import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApplicationFormBuilder from "../components/FormBuilder/ApplicationFormBuilder";
import { FiArrowLeft, FiEdit2, FiGrid, FiPieChart, FiEyeOff, FiFileText, FiBriefcase, FiShield, FiUsers, FiLogOut } from "react-icons/fi";
import { useOpportunities } from "../context/OpportunitiesContext";
import { useFormBuilder, FormBuilderProvider } from "../context/FormBuilderContext";

/**
 * Inner component that consumes the FormBuilder context.
 * This MUST be a separate component so that useFormBuilder is called
 * inside the FormBuilderProvider tree.
 */
const ApplicationFormBuilderPageContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isSuperAdmin, logout } = useOpportunities();
  const { formState, setFormState, handlers, isPublishing } = useFormBuilder();
  const [isSidebarHovered, setIsSidebarHovered] = React.useState(false);
  
  const menuItems = [
    { key: "Program Details", label: "Program Details" },
    { key: "Internship", label: "Internships" },
    { key: "Global Program", label: "Global Programs" },
    { key: "Closed Application", label: "Closed Application" },
    { key: "Applications", label: "Applications" },
  ];

  if (isSuperAdmin) {
    menuItems.splice(
      0,
      menuItems.length,
      { key: "Overview", label: "Overview" },
      { key: "Admins", label: "Admins" },
      { key: "Users", label: "Users" },
      { key: "Program Details", label: "Program Details" },
      { key: "Internship", label: "Internships" },
      { key: "Global Program", label: "Global Programs" },
      { key: "Closed Application", label: "Closed Application" },
    );
  }

  const handleSidebarClick = (key) => {
    if (key === "Program Details") {
      navigate("/admin-dashboard", { state: { editId: id, activeSection: "Internship" } });
      return;
    }
    navigate("/admin-dashboard", { state: { activeSection: key } });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#EEF3FF]">
      <div className="w-full px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
        <div className={`grid grid-cols-1 gap-4 xl:gap-5 transition-all duration-300 ease-in-out ${isSidebarHovered ? 'xl:grid-cols-[220px_minmax(0,1fr)]' : 'xl:grid-cols-[80px_minmax(0,1fr)]'}`}>
          {/* SIDEBAR (AUTO-EXPANDING) */}
          <aside 
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
            className={`bg-[#E4EBFB] border border-[#D8E2F7] rounded-2xl p-4 xl:sticky xl:top-6 h-[calc(100vh-3rem)] flex flex-col overflow-hidden transition-all duration-300 ease-in-out shadow-sm ${isSidebarHovered ? 'items-start w-full' : 'items-center w-full'}`}
          >
            <div className={`mb-8 transition-all duration-300 ${isSidebarHovered ? 'w-full' : ''}`}>
              {isSidebarHovered ? (
                <div className="flex flex-col">
                  <p className="text-slate-900 text-xl font-semibold whitespace-nowrap">
                    Admin Control
                  </p>
                  <p className="text-[10px] tracking-[0.16em] text-slate-500 mt-1 font-semibold">PORTAL</p>
                </div>
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <FiShield className="text-white" size={20} />
                </div>
              )}
            </div>

            <div className={`flex flex-col gap-2 w-full overflow-y-auto custom-scrollbar ${isSidebarHovered ? '' : 'items-center'}`}>
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  title={!isSidebarHovered ? item.label : ""}
                  onClick={() => handleSidebarClick(item.key)}
                  className={`flex items-center gap-3 rounded-xl transition-all group relative ${isSidebarHovered ? 'w-full px-4 py-3 justify-start' : 'w-12 h-12 justify-center'} ${isSidebarHovered ? 'text-slate-700 hover:bg-white hover:text-blue-600' : 'text-slate-600 hover:bg-white/70 hover:text-blue-600'}`}
                >
                  <div className="shrink-0">
                    {item.key === "Program Details" && <FiEdit2 size={isSidebarHovered ? 18 : 20} />}
                    {item.key === "Internship" && <FiGrid size={isSidebarHovered ? 18 : 20} />}
                    {item.key === "Global Program" && <FiPieChart size={isSidebarHovered ? 18 : 20} />}
                    {item.key === "Closed Application" && <FiEyeOff size={isSidebarHovered ? 18 : 20} />}
                    {item.key === "Applications" && <FiFileText size={isSidebarHovered ? 18 : 20} />}
                    {item.key === "Overview" && <FiPieChart size={isSidebarHovered ? 18 : 20} />}
                    {item.key === "Post Opportunity" && <FiBriefcase size={isSidebarHovered ? 18 : 20} />}
                    {item.key === "Admins" && <FiShield size={isSidebarHovered ? 18 : 20} />}
                    {item.key === "Users" && <FiUsers size={isSidebarHovered ? 18 : 20} />}
                  </div>
                  
                  {isSidebarHovered && (
                    <span className="text-sm font-semibold whitespace-nowrap transition-all duration-300 opacity-100">
                      {item.label}
                    </span>
                  )}

                  {!isSidebarHovered && (
                    <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className={`mt-auto pt-4 border-t border-[#D0DCF5] w-full flex ${isSidebarHovered ? 'justify-start' : 'justify-center'}`}>
              <button
                type="button"
                title={!isSidebarHovered ? "Logout" : ""}
                onClick={handleLogout}
                className={`flex items-center gap-3 rounded-xl border border-slate-300 transition-all group relative ${isSidebarHovered ? 'w-full px-4 py-3 justify-start' : 'w-12 h-12 justify-center'} ${isSidebarHovered ? 'text-slate-700 hover:bg-white hover:text-rose-600' : 'text-slate-700 hover:bg-white/80 hover:text-rose-600'}`}
              >
                <div className="shrink-0">
                  <FiLogOut size={isSidebarHovered ? 16 : 18} />
                </div>
                
                {isSidebarHovered && (
                  <span className="text-sm font-semibold whitespace-nowrap transition-all duration-300 opacity-100">
                    Logout
                  </span>
                )}

                {!isSidebarHovered && (
                  <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    Logout
                  </span>
                )}
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="min-w-0 flex flex-col bg-white rounded-3xl border border-[#DCE5FA] overflow-hidden shadow-sm h-[calc(100vh-3rem)]">
            {/* BUILDER CONTAINER */}
            <div className="flex-1 overflow-hidden relative">
              <ApplicationFormBuilder programId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Page Component.
 * Wraps the content in the FormBuilderProvider.
 */
const ApplicationFormBuilderPage = () => {
  const { id } = useParams();
  
  return (
    <FormBuilderProvider internshipId={id}>
      <ApplicationFormBuilderPageContent />
    </FormBuilderProvider>
  );
};

export default ApplicationFormBuilderPage;
