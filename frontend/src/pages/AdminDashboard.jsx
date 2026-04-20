import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fi";
import { useOpportunities } from "../context/OpportunitiesContext";
import NavBar from "../components/NavBar";
import { API_BASE_URL } from "../services/apiClient";

const initialForm = {
  title: "",
  company: "",
  description: "",
  requiredSkills: "",
  whoCanApply: "",
  benefits: "",
  department: "",
  functionalRole: "",
  companyType: "",
  companySize: "",
  foundedYear: "",
  industry: "",
  website: "",
  location: "",
  duration: "",
  stipend: "",
  stipendCurrency: "INR",
  workMode: "In Office",
  cardTags: "",
  type: "Internship",
  skills: "",
  deadline: "",
  startDate: "",
  logo: "",
  programType: "",
  eligibility: "",
};

const resolveOwnerId = (opportunity) => {
  const owner = opportunity?.createdBy;
  if (!owner) {
    return "";
  }

  if (typeof owner === "string") {
    return owner;
  }

  return owner._id || owner.id || "";
};

const resolveOwnerName = (opportunity) => {
  const owner = opportunity?.createdBy;

  if (!owner) {
    return "Unknown admin";
  }

  if (typeof owner === "string") {
    return "Unknown admin";
  }

  return owner.fullName || owner.email || "Unknown admin";
};

const resolveResumeUrl = (application) => {
  const filePath = application?.resumeFilePath || application?.resume?.filePath;

  if (!filePath) {
    return "";
  }

  if (/^https?:\/\//i.test(filePath)) {
    return filePath;
  }

  return `${API_BASE_URL}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
};

const toMultiline = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join("\n");
  }

  return String(value || "");
};

const AdminDashboard = ({ dashboardType = "admin" }) => {
  const navigate = useNavigate();
  const isSuperDashboard = dashboardType === "super";
  const {
    opportunities,
    applications,
    user,
    logout,
    isAdmin,
    isSuperAdmin,
    isBootstrapping,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    loadApplications,
    getUserDirectory,
    deleteUserAccount,
    changeAdminPassword,
    approveAdminAccess,
    getWhatsAppStatus,
    impersonateAdmin,
    stopImpersonation,
    isImpersonating,
    updateApplicationStatus,
    exportOpportunities,
    exportApplications,
    getApiErrorMessage,
  } = useOpportunities();

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [requiredSkillInputs, setRequiredSkillInputs] = useState(["", "", ""]);
  const [benefitInputs, setBenefitInputs] = useState(["", "", "", ""]);
  const [activeSection, setActiveSection] = useState(
    isSuperDashboard ? "Overview" : "Internship",
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [applicationsLoaded, setApplicationsLoaded] = useState(false);
  const [openingAdminId, setOpeningAdminId] = useState("");
  const [directory, setDirectory] = useState({
    admins: [],
    users: [],
    superAdmins: [],
    counts: { admins: 0, users: 0, superAdmins: 0, total: 0 },
  });
  const [directoryLoaded, setDirectoryLoaded] = useState(false);
  const [whatsAppStatus, setWhatsAppStatus] = useState(null);
  const [whatsAppStatusLoading, setWhatsAppStatusLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState("");
  const [passwordEditorAdminId, setPasswordEditorAdminId] = useState("");
  const [adminPasswordForm, setAdminPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
    notifyAdmin: false,
  });
  const [showAdminPassword, setShowAdminPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [changingPasswordAdminId, setChangingPasswordAdminId] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const [adminApprovalMessage, setAdminApprovalMessage] = useState("");
  const [approvingAdminId, setApprovingAdminId] = useState("");

  const title = editingId
    ? `Edit ${form.type === "Global Program" ? "Global Program" : "Internship"}`
    : `Create ${form.type === "Global Program" ? "Global Program" : "Internship"}`;

  const sorted = useMemo(
    () =>
      [...opportunities]
        .filter((item) => {
          if (isSuperAdmin) {
            return true;
          }

          return resolveOwnerId(item) === String(user?.id || "");
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        ),
    [opportunities, isSuperAdmin, user?.id],
  );

  const filteredOpportunities = useMemo(() => {
    if (activeSection === "Internship") {
      return sorted.filter((item) => item.type === "Internship");
    }

    if (activeSection === "Global Program") {
      return sorted.filter((item) => item.type === "Global Program");
    }

    return sorted;
  }, [sorted, activeSection]);

  const isInternshipPanel = activeSection === "Internship";
  const isGlobalProgramPanel = activeSection === "Global Program";
  const isSuperStatsSection = isSuperDashboard && activeSection === "Overview";
  const isSuperPostSection = isSuperDashboard && activeSection === "Post Opportunity";
  const isSuperUsersSection = isSuperDashboard && activeSection === "Users";
  const isSuperAdminsSection = isSuperDashboard && activeSection === "Admins";
  const isSuperApprovedRequestsSection =
    isSuperDashboard && activeSection === "Approved Requests";
  const isAnySuperDirectorySection =
    isSuperStatsSection ||
    isSuperPostSection ||
    isSuperUsersSection ||
    isSuperAdminsSection ||
    isSuperApprovedRequestsSection;
  const userCount = directory.counts?.users || 0;
  const adminCount = directory.counts?.admins || 0;
  const superAdminCount = directory.counts?.superAdmins || 0;
  const totalAccountCount =
    directory.counts?.total || userCount + adminCount + superAdminCount;
  const toPercent = (value) =>
    totalAccountCount > 0
      ? Math.round((Number(value || 0) / totalAccountCount) * 100)
      : 0;
  const userPercent = toPercent(userCount);
  const adminPercent = toPercent(adminCount);
  const superAdminPercent = toPercent(superAdminCount);

  const recentApplications = useMemo(() => {
    const sectionApplications =
      activeSection === "Applications"
        ? applications
        : applications.filter((item) => item.opportunityType === activeSection);

    return [...sectionApplications]
      .sort(
        (a, b) =>
          new Date(b.appliedAt || 0).getTime() -
          new Date(a.appliedAt || 0).getTime(),
      )
      .slice(0, 5);
  }, [applications, activeSection]);

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    if (!isAdmin) {
      navigate("/");
      return;
    }

    if (isSuperDashboard && !isSuperAdmin) {
      navigate("/admin-dashboard");
    }
  }, [
    isBootstrapping,
    user,
    isAdmin,
    isSuperAdmin,
    isSuperDashboard,
    navigate,
  ]);

  useEffect(() => {
    if (!isAdmin || applicationsLoaded) {
      return;
    }

    const run = async () => {
      try {
        setError("");
        await loadApplications();
        setApplicationsLoaded(true);
      } catch (apiError) {
        setError(getApiErrorMessage(apiError, "Failed to load applications."));
      }
    };

    run();
  }, [isAdmin, applicationsLoaded]);

  useEffect(() => {
    if (
      !isSuperDashboard ||
      !isSuperAdmin ||
      directoryLoaded ||
      !isAnySuperDirectorySection
    ) {
      return;
    }

    const run = async () => {
      try {
        setError("");
        const result = await getUserDirectory();
        setDirectory(result);
        setDirectoryLoaded(true);
      } catch (apiError) {
        setError(
          getApiErrorMessage(apiError, "Failed to load users directory."),
        );
      }
    };

    run();
  }, [
    isSuperDashboard,
    isSuperAdmin,
    directoryLoaded,
    isAnySuperDirectorySection,
    getUserDirectory,
    getApiErrorMessage,
  ]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const run = async () => {
      try {
        setWhatsAppStatusLoading(true);
        const status = await getWhatsAppStatus();
        setWhatsAppStatus(status);
      } catch (apiError) {
        setWhatsAppStatus({
          connected: false,
          message: getApiErrorMessage(
            apiError,
            "Failed to fetch WhatsApp status.",
          ),
        });
      } finally {
        setWhatsAppStatusLoading(false);
      }
    };

    run();
  }, [isAdmin, getWhatsAppStatus, getApiErrorMessage]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequiredSkillChange = (index, value) => {
    setRequiredSkillInputs((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index ? value : item,
      ),
    );
  };

  const addRequiredSkillInput = () => {
    setRequiredSkillInputs((prev) => [...prev, ""]);
  };

  const handleBenefitChange = (index, value) => {
    setBenefitInputs((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index ? value : item,
      ),
    );
  };

  const addBenefitInput = () => {
    setBenefitInputs((prev) => [...prev, ""]);
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      type:
        activeSection === "Global Program" ? "Global Program" : "Internship",
    });
    setEditingId(null);
    setShowOpportunityForm(false);
    setRequiredSkillInputs(["", "", ""]);
    setBenefitInputs(["", "", "", ""]);
  };

  const handleOpenCreateForm = () => {
    const nextType =
      activeSection === "Global Program" ? "Global Program" : "Internship";

    navigate(
      isSuperDashboard
        ? nextType === "Global Program"
          ? "/super-admin-dashboard/create-global-program"
          : "/super-admin-dashboard/create-internship"
        : nextType === "Global Program"
          ? "/admin-dashboard/create-global-program"
          : "/admin-dashboard/create-internship",
    );
  };

  const handleSuperCreateInternship = () => {
    navigate("/super-admin-dashboard/create-internship");
  };

  const handleSuperCreateGlobalProgram = () => {
    navigate("/super-admin-dashboard/create-global-program");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    const shouldIncludeInternshipCardFields = form.type === "Internship";
    const stipendCurrencySymbol = form.stipendCurrency === "USD" ? "$" : "₹";
    const requiredSkillsValue = requiredSkillInputs
      .map((skill) => String(skill || "").trim())
      .filter(Boolean)
      .join(", ");
    const benefitsValue = benefitInputs
      .map((benefit) => String(benefit || "").trim())
      .filter(Boolean)
      .join(", ");

    const payload = {
      ...form,
      skills: form.skills,
      requiredSkills: shouldIncludeInternshipCardFields ? requiredSkillsValue : form.requiredSkills,
      benefits: shouldIncludeInternshipCardFields ? benefitsValue : form.benefits,
      deadline: new Date(form.deadline).toISOString(),
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      stipend: form.stipend
        ? `${stipendCurrencySymbol}${String(form.stipend).trim()}`
        : "",
      ...(shouldIncludeInternshipCardFields
        ? {
            workMode: form.workMode,
            cardTags: form.cardTags,
          }
        : {}),
    };

    try {
      if (editingId) {
        await updateOpportunity(editingId, payload);
        resetForm();
        return;
      }

      await addOpportunity(payload);
      resetForm();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to save opportunity."));
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (item) => {
    navigate(
      isSuperDashboard
        ? `/super-admin-dashboard/edit-opportunity/${item.id}`
        : `/admin-dashboard/edit-opportunity/${item.id}`,
      {
      state: { opportunity: item },
      },
    );
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteOpportunity(id);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to delete opportunity."));
    }
  };

  const handleViewResume = (application) => {
    const resumeUrl = resolveResumeUrl(application);

    if (!resumeUrl) {
      setError("Resume file is not available for this application.");
      return;
    }

    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setEditingId(null);
    setShowOpportunityForm(false);
    setRequiredSkillInputs(["", "", ""]);
    setBenefitInputs(["", "", "", ""]);
    if (section === "Internship" || section === "Global Program") {
      setForm((prev) => ({ ...prev, type: section }));
    }
  };

  const refreshDirectory = async () => {
    try {
      setError("");
      const result = await getUserDirectory();
      setDirectory(result);
      setDirectoryLoaded(true);
    } catch (apiError) {
      setError(
        getApiErrorMessage(apiError, "Failed to refresh users directory."),
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isWhatsAppConnected = Boolean(whatsAppStatus?.connected);
  const whatsAppStatusText = whatsAppStatusLoading
    ? "Checking WhatsApp..."
    : whatsAppStatus?.message ||
      (isWhatsAppConnected ? "WhatsApp connected" : "WhatsApp not connected");

  const handleOpenAdminDashboard = async (adminId) => {
    try {
      setError("");
      setOpeningAdminId(adminId);
      await impersonateAdmin(adminId);
      navigate("/admin-dashboard");
    } catch (apiError) {
      setError(
        getApiErrorMessage(
          apiError,
          "Failed to open selected admin dashboard.",
        ),
      );
    } finally {
      setOpeningAdminId("");
    }
  };

  const handleApproveAdminAccess = async (adminId) => {
    try {
      setError("");
      setAdminApprovalMessage("");
      setApprovingAdminId(adminId);
      const result = await approveAdminAccess(adminId);
      setAdminApprovalMessage(
        result?.message || "Admin access approved successfully.",
      );
      await refreshDirectory();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to approve admin access."));
    } finally {
      setApprovingAdminId("");
    }
  };

  const handleReturnToSuperAdmin = async () => {
    try {
      setError("");
      await stopImpersonation();
      navigate("/super-admin-dashboard");
    } catch (apiError) {
      setError(
        getApiErrorMessage(
          apiError,
          "Failed to return to super admin dashboard.",
        ),
      );
    }
  };

  const handleDeleteAccount = async (targetUser) => {
    const label = targetUser?.fullName || targetUser?.email || "this account";
    const confirmed = window.confirm(
      `Are you sure you want to delete ${label}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setDeletingUserId(targetUser.id);
      await deleteUserAccount(targetUser.id);
      await refreshDirectory();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to delete account."));
    } finally {
      setDeletingUserId("");
    }
  };

  const handleStartPasswordEditor = (adminId) => {
    setError("");
    setPasswordChangeMessage("");
    setPasswordEditorAdminId(adminId);
    setAdminPasswordForm({
      newPassword: "",
      confirmPassword: "",
      notifyAdmin: false,
    });
    setShowAdminPassword({
      newPassword: false,
      confirmPassword: false,
    });
  };

  const handleCancelPasswordEditor = () => {
    setPasswordEditorAdminId("");
    setAdminPasswordForm({
      newPassword: "",
      confirmPassword: "",
      notifyAdmin: false,
    });
    setShowAdminPassword({
      newPassword: false,
      confirmPassword: false,
    });
  };

  const toggleAdminPasswordVisibility = (fieldName) => {
    setShowAdminPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleAdminPasswordInputChange = (event) => {
    const { name, value } = event.target;
    setAdminPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotifyAdminToggle = (event) => {
    const { checked } = event.target;
    setAdminPasswordForm((prev) => ({
      ...prev,
      notifyAdmin: checked,
    }));
  };

  const handleChangeAdminPassword = async (adminId) => {
    const { newPassword, confirmPassword, notifyAdmin } = adminPasswordForm;

    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");
      setPasswordChangeMessage("");
      setChangingPasswordAdminId(adminId);
      const result = await changeAdminPassword(adminId, newPassword, notifyAdmin);
      setPasswordChangeMessage(
        result?.message || "Admin password changed successfully.",
      );
      handleCancelPasswordEditor();
    } catch (apiError) {
      setError(
        getApiErrorMessage(apiError, "Failed to change admin password."),
      );
    } finally {
      setChangingPasswordAdminId("");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setError("");
      await updateApplicationStatus(id, status);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to update status."));
    }
  };

  const handleExport = async (format) => {
    try {
      setError("");

      if (activeSection === "Applications") {
        await exportApplications(format);
        return;
      }

      await exportOpportunities(format, activeSection);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to export data."));
    }
  };

  const menuItems = [
    { key: "Internship", label: "Internships" },
    { key: "Global Program", label: "Global Programs" },
    { key: "Applications", label: "Application Forms" },
  ];

  if (isSuperDashboard && isSuperAdmin) {
    menuItems.splice(
      0,
      menuItems.length,
      { key: "Overview", label: "Overview" },
      { key: "Post Opportunity", label: "Post Opportunity" },
      { key: "Admins", label: "Admins" },
      
      { key: "Users", label: "Users" },
     
      
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

  return (
    <>
      
      <div className="min-h-screen bg-[#EEF3FF]">
        <div className="mx-auto w-full max-w-425 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[250px_minmax(0,1fr)] xl:gap-5">
            <aside className="bg-[#E4EBFB] border border-[#D8E2F7] rounded-2xl p-4 xl:sticky xl:top-6 h-fit">
              <div className="mb-7">
                <p className="text-slate-900 text-xl font-semibold">
                  Admin Control
                </p>
                <p className="text-[11px] tracking-[0.16em] text-slate-500 mt-1 font-semibold"></p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-7 sm:grid-cols-3 xl:grid-cols-1 xl:space-y-2 xl:gap-0">
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
                    {item.key === "Internship" && <FiGrid size={16} />}
                    {item.key === "Global Program" && <FiPieChart size={16} />}
                    {item.key === "Applications" && <FiFileText size={16} />}
                    {item.key === "Overview" && <FiPieChart size={16} />}
                    {item.key === "Post Opportunity" && <FiBriefcase size={16} />}
                    {item.key === "Admins" && <FiShield size={16} />}
                    
                    {item.key === "Users" && <FiUsers size={16} />}
                    
                    {item.label}
                  </button>
                ))}
              </div>

              {/* <button
                type="button"
                onClick={() => handleExport("xlsx")}
                className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold shadow-[0_6px_18px_rgba(15,23,42,0.35)] hover:bg-slate-800 transition"
              >
                Export Reports
              </button> */}

              <div className="mt-7 pt-4 border-t border-[#D0DCF5] space-y-2">
                {/* {isSuperDashboard && isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => navigate("/admin-dashboard")}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg border border-slate-300 hover:bg-white/80 flex items-center gap-2"
                  >
                    <FiGrid size={15} />
                    Open Admin Dashboard
                  </button>
                )} */}

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

            <main className="min-w-0 space-y-4 sm:space-y-5">
              {!isSuperDashboard && isImpersonating && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
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

              <div className="bg-white border border-[#DCE5FA] rounded-2xl px-4 py-4 sm:px-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                    {isSuperDashboard
                      ? "Super Admin Control Center"
                      : "Admin Control Center"}
                  </h1>
                  <p className="text-xs tracking-[0.14em] text-slate-500 font-semibold mt-1">
                    OPERATIONAL OVERVIEW
                  </p>
                </div>
                  <div className="w-full sm:w-auto flex items-center gap-3 rounded-xl bg-[#F5F8FF] border border-[#DEE8FF] px-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-900 font-semibold flex items-center justify-center">
                    {(user?.fullName || "A").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 leading-tight">
                      {user?.fullName || "Admin"}
                    </p>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                      {isSuperDashboard
                        ? "Super Administrator"
                        : "Administrator"}
                    </p>
                  </div>
                </div>
              </div>

              {isSuperStatsSection ? (
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-lg border border-[#E2EAFC] p-4 bg-white">
                    <p className="text-xs text-slate-500 tracking-widest font-semibold">
                      TOTAL USERS
                    </p>
                    <p className="text-3xl mt-1 font-bold text-slate-800">
                      {directory.counts?.users || 0}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#E2EAFC] p-4 bg-white">
                    <p className="text-xs text-slate-500 tracking-widest font-semibold">
                      TOTAL ADMINS
                    </p>
                    <p className="text-3xl mt-1 font-bold text-slate-800">
                      {directory.counts?.admins || 0}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#E2EAFC] p-4 bg-white">
                    <p className="text-xs text-slate-500 tracking-widest font-semibold">
                      SUPER ADMINS
                    </p>
                    <p className="text-3xl mt-1 font-bold text-slate-800">
                      {directory.counts?.superAdmins || 0}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#E2EAFC] p-4 bg-white">
                    <p className="text-xs text-slate-500 tracking-widest font-semibold">
                      TOTAL ACCOUNTS
                    </p>
                    <p className="text-3xl mt-1 font-bold text-slate-800">
                      {directory.counts?.total || 0}
                    </p>
                  </div>
                </div>
              ) : null}

              {isSuperPostSection ? (
                <div className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-800">
                        Post Opportunities
                      </h2>
                      <p className="text-sm text-slate-500">
                        Create internships or global programs from the sidebar.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSectionChange("Applications")}
                      className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm font-semibold"
                    >
                      View Applications
                    </button>
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={handleSuperCreateInternship}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0B4AA6] text-white font-semibold"
                    >
                      Post Internship
                    </button>
                    <button
                      type="button"
                      onClick={handleSuperCreateGlobalProgram}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
                    >
                      Post Global Program
                    </button>
                  </div>

                  
                </div>
              ) : null}

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

              {isAnySuperDirectorySection ? (
                <div className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-5">
                  <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-800">
                        {isSuperStatsSection
                          ? "Overview"
                          : isSuperPostSection
                            ? "Post Opportunity"
                          : isSuperAdminsSection
                            ? "Admins"
                          : isSuperApprovedRequestsSection
                            ? "Approved Requests"
                            : "Users"}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {isSuperStatsSection
                          ? "Overview of all account totals."
                          : isSuperPostSection
                            ? "Open the post panel to create internships or global programs."
                          : isSuperAdminsSection
                            ? "View and manage admin accounts."
                          : isSuperApprovedRequestsSection
                            ? "View already approved admin requests."
                            : "View and manage user accounts."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={refreshDirectory}
                      className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm font-semibold"
                    >
                      Refresh
                    </button>
                  </div>

                  {/* {isSuperStatsSection && (
                    // <div className="space-y-4">
                    //   <p className="text-sm text-slate-500">
                    //     Select Users or Admins from the left menu to open each list separately.
                    //   </p>

                    //   <div className="grid grid-cols-3 gap-3">
                    //     <div className="rounded-lg border border-[#E2EAFC] bg-[#F8FAFF] p-3">
                    //       <p className="text-xs text-slate-500 font-semibold tracking-wide">
                    //         USERS SHARE
                    //       </p>
                    //       <p className="text-2xl font-bold text-slate-800 mt-1">
                    //         {userPercent}%
                    //       </p>
                    //       <p className="text-xs text-slate-500 mt-1">
                    //         {userCount} of {totalAccountCount} accounts
                    //       </p>
                    //     </div>
                    //     <div className="rounded-lg border border-[#E2EAFC] bg-[#F8FAFF] p-3">
                    //       <p className="text-xs text-slate-500 font-semibold tracking-wide">
                    //         ADMINS SHARE
                    //       </p>
                    //       <p className="text-2xl font-bold text-slate-800 mt-1">
                    //         {adminPercent}%
                    //       </p>
                    //       <p className="text-xs text-slate-500 mt-1">
                    //         {adminCount} of {totalAccountCount} accounts
                    //       </p>
                    //     </div>
                    //     <div className="rounded-lg border border-[#E2EAFC] bg-[#F8FAFF] p-3">
                    //       <p className="text-xs text-slate-500 font-semibold tracking-wide">
                    //         SUPER ADMINS SHARE
                    //       </p>
                    //       <p className="text-2xl font-bold text-slate-800 mt-1">
                    //         {superAdminPercent}%
                    //       </p>
                    //       <p className="text-xs text-slate-500 mt-1">
                    //         {superAdminCount} of {totalAccountCount} accounts
                    //       </p>
                    //     </div>
                    //   </div>

                    //   <div className="space-y-2">
                    //     <div>
                    //       <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    //         <span>Users</span>
                    //         <span>{userPercent}%</span>
                    //       </div>
                    //       <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    //         <div
                    //           className="h-full bg-slate-700"
                    //           style={{ width: `${userPercent}%` }}
                    //         />
                    //       </div>
                    //     </div>
                    //     <div>
                    //       <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    //         <span>Admins</span>
                    //         <span>{adminPercent}%</span>
                    //       </div>
                    //       <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    //         <div
                    //           className="h-full bg-blue-600"
                    //           style={{ width: `${adminPercent}%` }}
                    //         />
                    //       </div>
                    //     </div>
                    //     <div>
                    //       <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    //         <span>Super Admins</span>
                    //         <span>{superAdminPercent}%</span>
                    //       </div>
                    //       <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    //         <div
                    //           className="h-full bg-emerald-600"
                    //           style={{ width: `${superAdminPercent}%` }}
                    //         />
                    //       </div>
                    //     </div>
                    //   </div>

                    //   <div className="flex items-center gap-2 pt-1">
                    //     <button
                    //       type="button"
                    //       onClick={() => handleSectionChange("Users")}
                    //       className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 text-sm font-semibold"
                    //     >
                    //       Open Users
                    //     </button>
                    //     <button
                    //       type="button"
                    //       onClick={() => handleSectionChange("Admins")}
                    //       className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm font-semibold"
                    //     >
                    //       Open Admins
                    //     </button>
                    //   </div>
                    // </div>
                  )} */}

                  {(isSuperAdminsSection || isSuperApprovedRequestsSection) && (
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {isSuperApprovedRequestsSection
                            ? "Approved Admin Requests"
                            : "Admins"}
                        </h3>
                        {/* <button
                          type="button"
                          onClick={() => navigate("/admin-dashboard")}
                          className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold"
                        >
                          Open Admin Dashboard
                        </button> */}
                      </div>
                      {(isSuperApprovedRequestsSection
                        ? directory.admins?.filter(
                            (item) => item.adminApprovalStatus === "approved",
                          )
                        : directory.admins
                      )?.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          {isSuperApprovedRequestsSection
                            ? "No approved admin requests found."
                            : "No admins found."}
                        </p>
                      ) : (
                        <div className="overflow-x-auto border border-[#E2EAFC] rounded-lg">
                          <table className="min-w-215 w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-[#E3EAFA] text-slate-500">
                                <th className="py-2 px-3">Name</th>
                                <th className="py-2 px-3">Email</th>
                                
                                <th className="py-2 px-3">Status</th>
                                <th className="py-2 px-3 ">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(isSuperApprovedRequestsSection
                                ? directory.admins?.filter(
                                    (item) =>
                                      item.adminApprovalStatus === "approved",
                                  )
                                : directory.admins
                              ).map((item) => (
                                <tr
                                  key={item.id}
                                  className="border-b border-[#EDF2FD]"
                                >
                                  <td className="py-2 px-3 font-medium text-slate-800 wrap-break-word">
                                    {item.fullName}
                                  </td>
                                  <td className="py-2 px-3 text-slate-600 break-all">
                                    {item.email}
                                  </td>
                                  
                                  <td className="py-2 px-3 text-slate-600">
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                        item.adminApprovalStatus === "pending"
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-emerald-100 text-emerald-800"
                                      }`}
                                    >
                                      {item.adminApprovalStatus === "pending"
                                        ? "Pending Approval"
                                        : "Approved"}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                      {item.adminApprovalStatus === "pending" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleApproveAdminAccess(item.id)
                                          }
                                          disabled={
                                            approvingAdminId === item.id ||
                                            !item.isEmailVerified ||
                                            !item.isPhoneVerified
                                          }
                                          className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-semibold disabled:opacity-60"
                                        >
                                          {approvingAdminId === item.id
                                            ? "Approving..."
                                            : !item.isEmailVerified ||
                                                !item.isPhoneVerified
                                              ? "Verify Email & Phone First"
                                              : "Approve Access"}
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenAdminDashboard(item.id)
                                        }
                                        disabled={
                                          item.adminApprovalStatus === "pending" ||
                                          openingAdminId === item.id ||
                                          deletingUserId === item.id
                                        }
                                        className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-semibold disabled:opacity-60"
                                      >
                                        {openingAdminId === item.id
                                          ? "Opening..."
                                          : "Open Dashboard"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStartPasswordEditor(item.id)
                                        }
                                        disabled={
                                          openingAdminId === item.id ||
                                          deletingUserId === item.id ||
                                          changingPasswordAdminId === item.id
                                        }
                                        className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold disabled:opacity-60"
                                      >
                                        Change Password
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteAccount(item)}
                                        disabled={deletingUserId === item.id}
                                        className="px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-semibold disabled:opacity-60"
                                      >
                                        {deletingUserId === item.id
                                          ? "Deleting..."
                                          : "Delete"}
                                      </button>
                                    </div>

                                    {passwordEditorAdminId === item.id && (
                                      <div className="mt-2 rounded-md border border-[#DCE5FA] bg-[#F8FAFF] p-2.5">
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                          <div className="relative">
                                            <input
                                              type={
                                                showAdminPassword.newPassword
                                                  ? "text"
                                                  : "password"
                                              }
                                              name="newPassword"
                                              value={
                                                adminPasswordForm.newPassword
                                              }
                                              onChange={
                                                handleAdminPasswordInputChange
                                              }
                                              placeholder="New password"
                                              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 pr-8 text-xs text-slate-800"
                                            />
                                            <button
                                              type="button"
                                              onClick={() =>
                                                toggleAdminPasswordVisibility(
                                                  "newPassword",
                                                )
                                              }
                                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                                              aria-label={
                                                showAdminPassword.newPassword
                                                  ? "Hide new password"
                                                  : "Show new password"
                                              }
                                            >
                                              {showAdminPassword.newPassword ? (
                                                <FiEyeOff size={14} />
                                              ) : (
                                                <FiEye size={14} />
                                              )}
                                            </button>
                                          </div>
                                          <div className="relative">
                                            <input
                                              type={
                                                showAdminPassword.confirmPassword
                                                  ? "text"
                                                  : "password"
                                              }
                                              name="confirmPassword"
                                              value={
                                                adminPasswordForm.confirmPassword
                                              }
                                              onChange={
                                                handleAdminPasswordInputChange
                                              }
                                              placeholder="Confirm password"
                                              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 pr-8 text-xs text-slate-800"
                                            />
                                            <button
                                              type="button"
                                              onClick={() =>
                                                toggleAdminPasswordVisibility(
                                                  "confirmPassword",
                                                )
                                              }
                                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                                              aria-label={
                                                showAdminPassword.confirmPassword
                                                  ? "Hide confirm password"
                                                  : "Show confirm password"
                                              }
                                            >
                                              {showAdminPassword.confirmPassword ? (
                                                <FiEyeOff size={14} />
                                              ) : (
                                                <FiEye size={14} />
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                        <p className="mt-1.5 text-[11px] text-slate-500">
                                          Password must be at least 8 characters and include letters, numbers, and special characters.
                                        </p>
                                        <label className="mt-2 flex items-center gap-2 text-xs text-slate-700">
                                          <input
                                            type="checkbox"
                                            checked={Boolean(
                                              adminPasswordForm.notifyAdmin,
                                            )}
                                            onChange={handleNotifyAdminToggle}
                                            className="h-4 w-4 rounded border-slate-300 text-slate-900"
                                          />
                                          Notify admin by email about password change
                                        </label>
                                        <div className="mt-2 flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleChangeAdminPassword(item.id)
                                            }
                                            disabled={
                                              changingPasswordAdminId === item.id
                                            }
                                            className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-semibold disabled:opacity-60"
                                          >
                                            {changingPasswordAdminId === item.id
                                              ? "Saving..."
                                              : "Save Password"}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={handleCancelPasswordEditor}
                                            disabled={
                                              changingPasswordAdminId === item.id
                                            }
                                            className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold disabled:opacity-60"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {isSuperUsersSection && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Users
                      </h3>
                      {directory.users?.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          No users found.
                        </p>
                      ) : (
                        <div className="overflow-x-auto border border-[#E2EAFC] rounded-lg">
                          <table className="min-w-170 w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-[#E3EAFA] text-slate-500">
                                <th className="py-2 px-3">Name</th>
                                <th className="py-2 px-3">Email</th>
                                <th className="py-2 px-3">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {directory.users.map((item) => (
                                <tr
                                  key={item.id}
                                  className="border-b border-[#EDF2FD]"
                                >
                                  <td className="py-2 px-3 font-medium text-slate-800 wrap-break-word">
                                    {item.fullName}
                                  </td>
                                  <td className="py-2 px-3 text-slate-600 break-all">
                                    {item.email}
                                  </td>
                                  <td className="py-2 px-3">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAccount(item)}
                                      disabled={deletingUserId === item.id}
                                      className="px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-semibold disabled:opacity-60"
                                    >
                                      {deletingUserId === item.id
                                        ? "Deleting..."
                                        : "Delete"}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {isSuperPostSection && (
                    <div>
                      {!showOpportunityForm ? (
                        <div className="text-sm text-slate-500">
                          Click Post Internship or Post Global Program above to open the form.
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : activeSection === "Applications" ? (
                <div className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-5">
                  <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-800">
                        Application Forms
                      </h2>
                      <p className="text-sm text-slate-500">
                        Review and manage submitted applications.
                      </p>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={() => handleExport("csv")}
                        className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-slate-100 text-slate-900 text-sm font-semibold"
                      >
                        Download CSV
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExport("xlsx")}
                        className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm font-semibold"
                      >
                        Download Excel
                      </button>
                    </div>
                  </div>

                  {applications.length === 0 ? (
                    <p className="text-slate-500">
                      No applications submitted yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-245 w-full text-sm">
                        <thead>
                          <tr className="text-left border-b border-[#E3EAFA] text-slate-500">
                            <th className="py-2 pr-3">Applicant</th>
                            <th className="py-2 pr-3">Email</th>
                            <th className="py-2 pr-3">Phone</th>
                            <th className="py-2 pr-3">Opportunity</th>
                            <th className="py-2 pr-3">Type</th>
                            <th className="py-2 pr-3">Resume</th>
                            <th className="py-2 pr-3">Status</th>
                            <th className="py-2 pr-3">Applied At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((application) => (
                            <tr
                              key={application.id}
                              className="border-b border-[#EDF2FD] align-top"
                            >
                              <td className="py-2 pr-3 font-medium text-slate-800 wrap-break-word">
                                {application.name}
                              </td>
                              <td className="py-2 pr-3 text-slate-600 break-all">
                                {application.email}
                              </td>
                              <td className="py-2 pr-3 text-slate-600">
                                {application.phone}
                              </td>
                              <td className="py-2 pr-3 text-slate-700">
                                {application.opportunityTitle}
                              </td>
                              <td className="py-2 pr-3 text-slate-700">
                                {application.opportunityType}
                              </td>
                              <td className="py-2 pr-3 text-slate-700">
                                {application.resumeFileName ? (
                                  <div className="flex items-center gap-2">
                                    <span>{application.resumeFileName}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleViewResume(application)}
                                      className="px-2 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200"
                                    >
                                      View Resume
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">Not uploaded</span>
                                )}
                              </td>
                              <td className="py-2 pr-3">
                                <select
                                  value={application.status || "New"}
                                  onChange={(event) =>
                                    handleStatusChange(
                                      application.id,
                                      event.target.value,
                                    )
                                  }
                                  className="border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-700"
                                >
                                  <option value="New">New</option>
                                  <option value="Shortlisted">
                                    Shortlisted
                                  </option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </td>
                              <td className="py-2 pr-3 text-slate-600">
                                {new Date(
                                  application.appliedAt,
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-5">
                    <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-2xl font-semibold text-slate-800">
                        {activeSection === "Internship"
                          ? "Internship Opportunities"
                          : "Global Program Opportunities"}
                      </h2>
                      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                        <button
                          type="button"
                          onClick={handleOpenCreateForm}
                          className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-[#0B4AA6] text-white text-sm font-semibold hover:bg-[#083B85]"
                        >
                          {activeSection === "Internship"
                            ? "Create Internship"
                            : "Create Global Program"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExport("csv")}
                          className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-slate-100 text-slate-900 text-sm font-semibold"
                        >
                          Download CSV
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExport("xlsx")}
                          className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm font-semibold"
                        >
                          Download Excel
                        </button>
                      </div>
                    </div>

                    {filteredOpportunities.length === 0 ? (
                      <p className="text-slate-500">
                        No opportunities added yet.
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[42vh] overflow-y-auto pr-1">
                        {filteredOpportunities.map((item) => (
                          <div
                            key={item.id}
                            className="border border-[#E2EAFC] rounded-lg p-4 flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between"
                          >
                            <div className="min-w-0">
                              <h3 className="font-semibold text-[17px] text-slate-800">
                                {item.title}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {item.company} • {item.type}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                {item.location} • {item.duration} •{" "}
                                {item.stipend}
                              </p>
                              {isSuperDashboard && (
                                <p className="text-xs text-slate-500 mt-1">
                                  Posted by: {resolveOwnerName(item)}
                                </p>
                              )}
                            </div>

                            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                              <button
                                onClick={() => handleEdit(item)}
                                className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-slate-100 text-slate-900 text-sm font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-red-100 text-red-700 text-sm font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className={`grid gap-4 sm:gap-5 items-start ${
                      showOpportunityForm ? "grid-cols-1 xl:grid-cols-[1.2fr_1fr]" : "grid-cols-1"
                    }`}
                  >
                    <div className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-5 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h2 className="text-2xl font-semibold text-slate-800">
                            Recent Applications
                          </h2>
                          <p className="text-sm text-slate-500">
                            Latest candidate submissions.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSectionChange("Applications")}
                          className="text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white font-semibold"
                        >
                          View All
                        </button>
                      </div>
                      {recentApplications.length === 0 ? (
                        <p className="text-slate-500">
                          No applications submitted yet.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-155 w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-[#E3EAFA] text-slate-500">
                                <th className="py-2 pr-3">Name</th>
                                <th className="py-2 pr-3">Opportunity</th>
                                <th className="py-2 pr-3">Type</th>
                                <th className="py-2 pr-3">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recentApplications.map((application) => (
                                <tr
                                  key={application.id}
                                  className="border-b border-[#EDF2FD]"
                                >
                                  <td className="py-2 pr-3 font-medium text-slate-800">
                                    {application.name}
                                  </td>
                                  <td className="py-2 pr-3 text-slate-700">
                                    {application.opportunityTitle}
                                  </td>
                                  <td className="py-2 pr-3 text-slate-600">
                                    {application.opportunityType}
                                  </td>
                                  <td className="py-2 pr-3">
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-900">
                                      {application.status || "New"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {showOpportunityForm && (
                      <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-5 h-fit"
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <h2 className="text-2xl font-semibold text-slate-800">
                              {title}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                              Fields marked <span className="text-rose-600">*</span> are required.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-sm font-semibold"
                          >
                            Close
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <label className="flex flex-col gap-1 text-sm text-slate-700">
                            <span>
                              Title <span className="text-rose-600">*</span>
                            </span>
                            <input
                              name="title"
                              value={form.title}
                              onChange={handleChange}
                              placeholder="Enter internship title"
                              className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              required
                            />
                          </label>

                          <label className="flex flex-col gap-1 text-sm text-slate-700">
                            <span>
                              Company <span className="text-rose-600">*</span>
                            </span>
                            <input
                              name="company"
                              value={form.company}
                              onChange={handleChange}
                              placeholder="Enter company name"
                              className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              required
                            />
                          </label>

                          <label className="flex flex-col gap-1 text-sm text-slate-700">
                            <span>
                              Location <span className="text-rose-600">*</span>
                            </span>
                            <input
                              name="location"
                              value={form.location}
                              onChange={handleChange}
                              placeholder="e.g. Pune / Remote"
                              className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              required
                            />
                          </label>

                          <label className="flex flex-col gap-1 text-sm text-slate-700">
                            <span>
                              Duration <span className="text-rose-600">*</span>
                            </span>
                            <input
                              name="duration"
                              value={form.duration}
                              onChange={handleChange}
                              placeholder="e.g. 3 months"
                              className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              required
                            />
                          </label>

                          <label className="flex flex-col gap-1 text-sm text-slate-700">
                            <span>Stipend Text</span>
                            <input
                              name="stipend"
                              value={form.stipend}
                              onChange={handleChange}
                              placeholder="e.g. 10,000 INR / month"
                              className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                            />
                          </label>

                          {form.type === "Internship" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>
                                Work Mode <span className="text-rose-600">*</span>
                              </span>
                              <select
                                name="workMode"
                                value={form.workMode}
                                onChange={handleChange}
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                                required
                              >
                                <option value="In Office">In Office</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                              </select>
                            </label>
                          )}

                          {form.type === "Internship" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>Card Tags</span>
                              <input
                                name="cardTags"
                                value={form.cardTags}
                                onChange={handleChange}
                                placeholder="comma separated tags"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              />
                            </label>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4 col-span-2">
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>Stipend</span>
                              <input
                                name="stipend"
                                value={form.stipend}
                                onChange={handleChange}
                                placeholder="e.g. 15000"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              />
                            </label>

                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>Currency</span>
                              <select
                                name="stipendCurrency"
                                value={form.stipendCurrency}
                                onChange={handleChange}
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                              </select>
                            </label>
                          </div>

                          {form.type === "Internship" && (
                            <>
                              <label className="flex flex-col gap-1 text-sm text-slate-700">
                                <span>
                                  Work Mode <span className="text-rose-600">*</span>
                                </span>
                                <select
                                  name="workMode"
                                  value={form.workMode}
                                  onChange={handleChange}
                                  className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                                  required
                                >
                                  <option value="In Office">In Office</option>
                                  <option value="Remote">Remote</option>
                                  <option value="Hybrid">Hybrid</option>
                                </select>
                              </label>

                              <label className="flex flex-col gap-1 text-sm text-slate-700">
                                <span>Card Tags</span>
                                <input
                                  name="cardTags"
                                  value={form.cardTags}
                                  onChange={handleChange}
                                  placeholder="comma separated tags"
                                  className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                                />
                              </label>
                            </>
                          )}

                          <label className="flex flex-col gap-1 text-sm text-slate-700 col-span-2">
                            <span>
                              Description <span className="text-rose-600">*</span>
                            </span>
                            <textarea
                              name="description"
                              value={form.description}
                              onChange={handleChange}
                              placeholder="Write internship description"
                              className="border border-[#D6E2FC] rounded-lg px-3 py-2 min-h-24"
                              required
                            />
                          </label>

                          {form.type === "Internship" && (
                            <div className="col-span-2 rounded-xl border border-[#D6E2FC] p-4 bg-[#FAFCFF]">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="block text-sm font-medium text-slate-700">
                                    Required Skills <span className="text-rose-600">*</span>
                                  </span>
                                  <p className="text-xs text-slate-500 mt-1">
                                    Add at least 3 required skills. Use Add Skill for more.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={addRequiredSkillInput}
                                  className="px-3 py-1.5 rounded-md bg-[#0B4AA6] text-white text-sm font-semibold"
                                >
                                  Add Skill
                                </button>
                              </div>

                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {requiredSkillInputs.map((skill, index) => (
                                  <label key={`dashboard-required-skill-${index}`} className="flex flex-col gap-1 text-sm text-slate-700">
                                    <span>
                                      Skill {index + 1} {index < 3 ? <span className="text-rose-600">*</span> : null}
                                    </span>
                                    <input
                                      type="text"
                                      value={skill}
                                      onChange={(event) =>
                                        handleRequiredSkillChange(index, event.target.value)
                                      }
                                      placeholder={`Skill ${index + 1}`}
                                      className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                                      required={index < 3}
                                    />
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {form.type === "Internship" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700 col-span-2">
                              <span>Who Can Apply</span>
                              <textarea
                                name="whoCanApply"
                                value={form.whoCanApply}
                                onChange={handleChange}
                                placeholder="Eligibility points"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2 min-h-20"
                              />
                            </label>
                          )}

                          {form.type === "Internship" && (
                            <div className="col-span-2 rounded-xl border border-[#D6E2FC] p-4 bg-[#FAFCFF]">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="block text-sm font-medium text-slate-700">
                                    Benefits <span className="text-rose-600">*</span>
                                  </span>
                                  <p className="text-xs text-slate-500 mt-1">
                                    Add at least 4 benefits. Use Add Benefit for more.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={addBenefitInput}
                                  className="px-3 py-1.5 rounded-md bg-[#0B4AA6] text-white text-sm font-semibold"
                                >
                                  Add Benefit
                                </button>
                              </div>

                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {benefitInputs.map((benefit, index) => (
                                  <label key={`dashboard-benefit-${index}`} className="flex flex-col gap-1 text-sm text-slate-700">
                                    <span>
                                      Benefit {index + 1} {index < 4 ? <span className="text-rose-600">*</span> : null}
                                    </span>
                                    <input
                                      type="text"
                                      value={benefit}
                                      onChange={(event) =>
                                        handleBenefitChange(index, event.target.value)
                                      }
                                      placeholder={`Benefit ${index + 1}`}
                                      className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                                      required={index < 4}
                                    />
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {form.type === "Internship" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>Department</span>
                              <input
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                placeholder="e.g. Engineering"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              />
                            </label>
                          )}

                          {form.type === "Internship" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>Functional Role</span>
                              <input
                                name="functionalRole"
                                value={form.functionalRole}
                                onChange={handleChange}
                                placeholder="e.g. Frontend Development"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              />
                            </label>
                          )}

                          {form.type === "Internship" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>Company Type</span>
                              <input
                                name="companyType"
                                value={form.companyType}
                                onChange={handleChange}
                                placeholder="e.g. Startup"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              />
                            </label>
                          )}

                          {form.type === "Internship" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>Company Size</span>
                              <input
                                name="companySize"
                                value={form.companySize}
                                onChange={handleChange}
                                placeholder="e.g. 50-200"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              />
                            </label>
                          )}

                          {form.type === "Internship" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>Founded Year</span>
                              <input
                                name="foundedYear"
                                value={form.foundedYear}
                                onChange={handleChange}
                                placeholder="e.g. 2018"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              />
                            </label>
                          )}

                          {form.type === "Internship" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>Industry</span>
                              <input
                                name="industry"
                                value={form.industry}
                                onChange={handleChange}
                                placeholder="e.g. EdTech"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              />
                            </label>
                          )}

                          {form.type === "Internship" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700 col-span-2">
                              <span>Website URL</span>
                              <input
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                placeholder="https://company.com"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              />
                            </label>
                          )}

                          {form.type === "Global Program" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>Program Category</span>
                              <input
                                name="programType"
                                value={form.programType}
                                onChange={handleChange}
                                placeholder="optional"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              />
                            </label>
                          )}

                          {form.type === "Global Program" && (
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                              <span>Eligibility</span>
                              <input
                                name="eligibility"
                                value={form.eligibility}
                                onChange={handleChange}
                                placeholder="optional"
                                className="border border-[#D6E2FC] rounded-lg px-3 py-2"
                              />
                            </label>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            type="submit"
                            disabled={busy}
                            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
                          >
                            {busy
                              ? "Saving..."
                              : editingId
                                ? "Update"
                                : "Create"}
                          </button>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-900 font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
