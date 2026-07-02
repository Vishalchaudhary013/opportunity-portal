
import SuperDirectory from "../components/superadmin/SuperDirectory";
import ApplicationsTable from "../components/admin/ApplicationsTable";
import OpportunitiesTable from "../components/admin/OpportunitiesTable";
import OpportunityForm from "../components/admin/OpportunityForm";
import OverviewStats from "../components/superadmin/OverviewStats";
import PostOpportunity from "../components/superadmin/PostOpportunity";
import LocationManager from "../components/superadmin/LocationManager";
import GalleryManager from "../components/superadmin/GalleryManager";

import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiBriefcase,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiGlobe,
  FiGrid,
  FiLogOut,
  FiPieChart,
  FiShield,
  FiCheckCircle,
  FiUsers,
  FiExternalLink,
  FiKey,
  FiTrash2,
  FiCheck,
  FiEdit2,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { AdminProvider, useAdminContext } from "../components/admin/AdminContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import { API_BASE_URL } from "../api/apiClient";
import NavBar from "../components/NavBar";

const isOpportunityClosed = (opportunity) => {
  const deadline = opportunity?.deadline;
  if (!deadline) return false;
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
};

const AdminDashboardContent = () => {
  const {
    isSuperDashboard,
    user, isAdmin, isSuperAdmin, isBootstrapping, isImpersonating,
    filteredOpportunities, sorted,
    scopedApplications, paginatedApplications, totalPages, recentApplications,
    form, editingId, showOpportunityForm, requiredSkillInputs, benefitInputs,
    currentStep, setCurrentStep, showPreviewModal, showSuccessMessage,
    activeSection,
    isInternshipPanel, isGlobalProgramPanel, isJobsPanel, isBootcampsPanel,
    isMasterclassesPanel, isDegreeProgramsPanel, isPGProgramsPanel, isClosedApplicationPanel,
    isSuperStatsSection, isSuperPostSection, isSuperUsersSection, isSuperAdminsSection,
    isSuperApprovedRequestsSection, isAnySuperDirectorySection,
    currentPage, setCurrentPage, itemsPerPage, totalClosedPages, paginatedClosedItems,
    closedApplicationView, setClosedApplicationView, closedApplicationItems, closedApplicationTitle,
    selectedIds,
    directory,
    userCount, adminCount, superAdminCount, totalAccountCount, userPercent, adminPercent, superAdminPercent,
    isWhatsAppConnected, whatsAppStatusText,
    passwordEditorAdminId, adminPasswordForm, showAdminPassword,
    changingPasswordAdminId, passwordChangeMessage, adminApprovalMessage, approvingAdminId,
    visiblePasswords, openingAdminId, deletingUserId,
    selectedApplication, setSelectedApplication,
    statusChangingId, statusChangeMessage,
    error, busy,
    resolveOwnerName,
    handleChange, handleLogoChange, handleRequiredSkillChange, addRequiredSkillInput, removeRequiredSkillInput,
    handleBenefitChange, addBenefitInput, resetForm,
    handleOpenCreateForm, handleSuperCreateInternship, handleSuperCreateGlobalProgram,
    handleSubmit, handleConfirmSubmit,
    handleEdit, handleViewResponses, handleDelete, handleBulkDelete,
    handleSelectAll, handleSelectItem,
    handleViewResume,
    handleSectionChange, handleLogout, handleReturnToSuperAdmin,
    handleOpenAdminDashboard, handleApproveAdminAccess, handleDeleteAccount,
    handleStartPasswordEditor, handleCancelPasswordEditor, toggleAdminPasswordVisibility,
    handleAdminPasswordInputChange, handleNotifyAdminToggle, handleChangeAdminPassword,
    handleStatusChange, handleExport, fetchDecryptedPassword,
  } = useAdminContext();

  const menuItems = [
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
    { key: "Closed Application", label: "Closed Application" },
  ];

  if (isSuperDashboard && isSuperAdmin) {
    menuItems.splice(
      0,
      menuItems.length,
      { key: "Overview", label: "Overview" },
      { key: "Admins", label: "Admins" },
      { key: "Users", label: "Users" },
      { key: "Location", label: "Location" },
      { key: "Gallery", label: "Gallery" },
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
      { key: "All Application", label: "All Application" },
      { key: "Closed Application", label: "Closed Application" },
    );
  }

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-slate-700 font-medium">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const resolveUserInitial = (user) => {
    const emailInitial = String(user?.email || "").trim().charAt(0);
    if (emailInitial) return emailInitial.toUpperCase();
    const nameInitial = String(user?.fullName || user?.name || "").trim().charAt(0);
    return nameInitial ? nameInitial.toUpperCase() : "U";
  };
  const userInitial = resolveUserInitial(user);

  return (
    <>
      <div className="h-screen bg-[#EEF3FF] flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40 border-b border-[#DCE5FA] shadow-sm shrink-0">
          <Link to="/" className="text-[26px] text-[#0f2a4d] font-bold cursor-pointer select-none hover:opacity-90 leading-none">
            edeco<span className="text-[#0f2a4d]">®</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="h-10 w-10 rounded-full bg-[#002761] text-white text-lg font-semibold flex items-center justify-center shadow-sm hover:ring-2 hover:ring-blue-100 transition-all">
                {userInitial}
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100 py-2">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user.fullName || user.email}</p>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50">
                  <FiLogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="w-full flex-1 min-h-0">
          <div className="grid grid-cols-1  xl:grid-cols-[260px_minmax(0,1fr)]  h-full">
            <AdminSidebar />
            <main className="min-w-0 space-y-4 sm:space-y-5 h-full overflow-y-auto custom-scrollbar ">
              {!isSuperDashboard && isImpersonating && (
                <div className="bg-amber-50 border border-amber-200  px-4 py-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-amber-900 font-medium">
                    You are viewing this as a selected admin account.
                  </p>
                  <button
                    type="button"
                    onClick={handleReturnToSuperAdmin}
                    className="px-3 py-1.5 rounded-md bg-amber-700 text-white text-xs font-semibold"
                  >
                    Return to Super Admin
                  </button>
                </div>
              )}

              {/* PREMIUM HEADER */}
              {activeSection === "Overview" && (
                <div className="bg-white border border-[#DCE5FA]  px-6 py-4 flex items-center justify-between shadow-sm mb-5">
                  <div className="flex items-center gap-8">
                    {/* LOGO */}

                    <div>
                      <h1 className="text-xl font-bold text-slate-800">
                        {isSuperDashboard
                          ? "Super Admin Control"
                          : "Admin Dashboard"}
                      </h1>
                      
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 rounded-xl bg-[#F5F8FF] border border-[#DEE8FF] px-3 py-1.5">
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        {(user?.fullName || "A").charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          {user?.fullName || "Admin"}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">
                          {isSuperDashboard ? "Super Admin" : "Admin"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <OverviewStats />
              <PostOpportunity />

              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}

              {passwordChangeMessage && (
                <p className="text-sm font-medium text-emerald-700">
                  {passwordChangeMessage}
                </p>
              )}

              {adminApprovalMessage && (
                <p className="text-sm font-medium text-emerald-700">
                  {adminApprovalMessage}
                </p>
              )}

              {activeSection === "Location" && <LocationManager />}
              {activeSection === "Gallery" && <GalleryManager />}

                <SuperDirectory />
                <ApplicationsTable />
                <OpportunitiesTable />
                <OpportunityForm />
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

const AdminDashboard = ({ dashboardType = "admin" }) => (
  <AdminProvider dashboardType={dashboardType}>
    <AdminDashboardContent />
  </AdminProvider>
);

export default AdminDashboard;
