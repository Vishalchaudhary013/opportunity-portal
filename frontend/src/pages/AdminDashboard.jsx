import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  durationUnit: "Months",
  stipend: "",
  isUnpaid: false,
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
  internshipType: "",
  formId: null,
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

const isOpportunityClosed = (opportunity) => {
  const deadline = opportunity?.deadline;

  if (!deadline) {
    return false;
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date.getTime() < today.getTime();
};

const AdminDashboard = ({ dashboardType = "admin" }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
    getDecryptedAdminPassword,
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
  const [activeSection, setActiveSection] = useState("Internship");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [closedApplicationView, setClosedApplicationView] =
    useState("Internship");
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  // visiblePasswords: { [adminId]: true | "loading" | "error" | decryptedPassword }
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Fetch decrypted password for super admin
  const fetchDecryptedPassword = async (adminId) => {
    try {
      setVisiblePasswords((prev) => ({ ...prev, [adminId]: "loading" }));
      const data = await getDecryptedAdminPassword(adminId);
      setVisiblePasswords((prev) => ({ ...prev, [adminId]: data.password }));
    } catch (apiError) {
      const message = getApiErrorMessage(apiError);
      if (message === "Password not available for decryption") {
        setVisiblePasswords((prev) => ({ ...prev, [adminId]: "N/A" }));
      } else {
        setVisiblePasswords((prev) => ({ ...prev, [adminId]: "error" }));
      }
    }
  };

  // Handle navigation state (e.g. from Form Builder back to Program Details)
  useEffect(() => {
    if (location.state?.editId && opportunities.length > 0) {
      const item = opportunities.find(o => (o.id || o._id) === location.state.editId);
      if (item) {
        handleEdit(item);
      }
      // Clear the state so it doesn't reopen on every render
      navigate(location.pathname, { replace: true, state: { ...location.state, editId: null } });
    }
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
      // Clear the state
      navigate(location.pathname, { replace: true, state: { ...location.state, activeSection: null } });
    }
  }, [location.state, opportunities, navigate, location.pathname]);

  const title = editingId
    ? `Edit ${form.type === "Global Program" ? "Global Program" : "Internship"}`
    : `Create ${form.type === "Global Program" ? "Global Program" : "Internship"}`;

  // Only show internships created by this super admin in super admin panel
  // AFTER
  const sorted = useMemo(() => {
    const userId = String(user?.id || user?._id || "");
    return [...opportunities]
      .filter(
        (item) =>
          resolveOwnerId(item) === userId &&
          (item.type === "Internship" || item.type === "Global Program"),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || a.updatedAt || 0).getTime(),
      );
  }, [opportunities, user?.id]);

  const filteredOpportunities = useMemo(() => {
    if (activeSection === "Internship") {
      return sorted.filter(
        (item) => item.type === "Internship" && !isOpportunityClosed(item),
      );
    }

    if (activeSection === "Global Program") {
      return sorted.filter(
        (item) => item.type === "Global Program" && !isOpportunityClosed(item),
      );
    }

    if (activeSection === "Closed Application") {
      return sorted.filter((item) => isOpportunityClosed(item));
    }

    return sorted;
  }, [sorted, activeSection]);

  const isInternshipPanel = activeSection === "Internship";
  const isGlobalProgramPanel = activeSection === "Global Program";
  const isClosedApplicationPanel = activeSection === "Closed Application";
  const isSuperStatsSection = isSuperDashboard && activeSection === "Overview";
  const isSuperPostSection =
    isSuperDashboard && activeSection === "Post Opportunity";
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
  const closedInternships = sorted.filter(
    (item) =>
      item.type === "Internship" &&
      isOpportunityClosed(item) &&
      item.title &&
      item.company,
  );
  const closedGlobalPrograms = sorted.filter(
    (item) =>
      item.type === "Global Program" &&
      isOpportunityClosed(item) &&
      item.title &&
      item.company,
  );
  const closedApplicationItems =
    closedApplicationView === "Internship"
      ? closedInternships
      : closedGlobalPrograms;
  const closedApplicationTitle =
    closedApplicationView === "Internship"
      ? "Closed Internship"
      : "Closed Global Program";
  // Only applications for internships created by this super admin
  const ownedOpportunityIds = useMemo(
    () =>
      new Set(
        sorted.map((item) => String(item.id || "").trim()).filter(Boolean),
      ),
    [sorted],
  );
  const scopedApplications = useMemo(
    () =>
      applications.filter((application) => {
        const directOpportunityId = String(
          application.opportunityId ||
            application.opportunity ||
            application?.opportunity?._id ||
            application?.opportunity?.id ||
            "",
        ).trim();
        return (
          directOpportunityId && ownedOpportunityIds.has(directOpportunityId)
        );
      }),
    [applications, ownedOpportunityIds],
  );
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
  const ownerNameById = useMemo(() => {
    const entries = [
      ...(directory.admins || []),
      ...(directory.superAdmins || []),
      ...(directory.users || []),
    ];
    const map = new Map();

    entries.forEach((entry) => {
      const id = String(entry?._id || entry?.id || "").trim();

      if (!id) {
        return;
      }

      map.set(id, entry.fullName || entry.email || "Unknown admin");
    });

    const currentUserId = String(user?.id || user?._id || "").trim();

    if (currentUserId && !map.has(currentUserId)) {
      map.set(currentUserId, user?.fullName || user?.email || "Unknown admin");
    }

    return map;
  }, [directory.admins, directory.superAdmins, directory.users, user]);
  const resolveOwnerName = (opportunity) => {
    const owner = opportunity?.createdBy;

    if (!owner) {
      return "Unknown admin";
    }

    if (typeof owner === "object") {
      return owner.fullName || owner.email || "Unknown admin";
    }

    const ownerId = String(owner).trim();

    if (!ownerId) {
      return "Unknown admin";
    }

    // Fallback: if createdBy is current user, always show their name/email
    const currentUserId = String(user?.id || user?._id || "").trim();
    if (ownerId && currentUserId && ownerId === currentUserId) {
      return user?.fullName || user?.email || "You";
    }

    return ownerNameById.get(ownerId) || "Unknown admin";
  };

  const recentApplications = useMemo(() => {
    const sectionApplications =
      activeSection === "Applications"
        ? scopedApplications
        : scopedApplications.filter(
            (item) => item.opportunityType === activeSection,
          );

    return [...sectionApplications]
      .sort(
        (a, b) =>
          new Date(b.appliedAt || 0).getTime() -
          new Date(a.appliedAt || 0).getTime(),
      )
      .slice(0, 5);
  }, [scopedApplications, activeSection]);

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
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRequiredSkillChange = (index, value) => {
    setRequiredSkillInputs((prev) =>
      prev.map((item, currentIndex) => (currentIndex === index ? value : item)),
    );
  };

  const addRequiredSkillInput = () => {
    setRequiredSkillInputs((prev) => [...prev, ""]);
  };

  const removeRequiredSkillInput = (index) => {
    setRequiredSkillInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBenefitChange = (index, value) => {
    setBenefitInputs((prev) =>
      prev.map((item, currentIndex) => (currentIndex === index ? value : item)),
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

    setForm({
      ...initialForm,
      type: nextType,
    });
    setEditingId(null);
    setCurrentStep(1);
    setShowOpportunityForm(true);
  };

  const handleSuperCreateInternship = () => {
    setForm({
      ...initialForm,
      type: "Internship",
    });
    setEditingId(null);
    setCurrentStep(1);
    setShowOpportunityForm(true);
  };

  const handleSuperCreateGlobalProgram = () => {
    setForm({
      ...initialForm,
      type: "Global Program",
    });
    setEditingId(null);
    setCurrentStep(1);
    setShowOpportunityForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowPreviewModal(true);
  };

  const handleConfirmSubmit = async () => {
    setError("");
    setBusy(true);

    const shouldIncludeInternshipCardFields = form.type === "Internship";
    const stipendCurrencySymbol = form.stipendCurrency === "USD" ? "$" : "₹";
    const requiredSkillsValue = requiredSkillInputs
      .map((skill) => String(skill || "").trim())
      .filter(Boolean)
      .join(", ");

    const payload = {
      ...form,
      skills: form.skills,
      requiredSkills: shouldIncludeInternshipCardFields
        ? requiredSkillsValue
        : form.requiredSkills,
      benefits: form.benefits,
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
      let res;
      if (editingId) {
        res = await updateOpportunity(editingId, payload);
        setShowPreviewModal(false);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate(`/admin-dashboard/build-form/${editingId}`);
        }, 3000);
        return;
      }

      res = await addOpportunity(payload);
      setShowPreviewModal(false);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        const createdId = res.id || res._id;
        navigate(`/admin-dashboard/build-form/${createdId}`);
      }, 3000);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to save opportunity."));
      setShowPreviewModal(false);
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (item) => {
    // 1. Prepare the form data from the item
    const formattedForm = {
      ...initialForm,
      ...item,
      // Handle date formatting for input fields (YYYY-MM-DD)
      deadline: item.deadline ? new Date(item.deadline).toISOString().split('T')[0] : "",
      startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : "",
      // Stipend handling: strip currency symbols if they were prepended
      stipend: String(item.stipend || "").replace(/[₹$]/g, "").trim(),
      stipendCurrency: String(item.stipend || "").includes("$") ? "USD" : "INR",
      isUnpaid: String(item.stipend || "").toLowerCase().includes("unpaid") || item.stipend === "0" || !item.stipend,
    };

    // 2. Set arrays for dynamic inputs
    const skillsArray = Array.isArray(item.requiredSkills) 
      ? item.requiredSkills 
      : String(item.requiredSkills || "").split(/,|\n/).map(s => s.trim()).filter(Boolean);
    
    setRequiredSkillInputs(skillsArray.length > 0 ? skillsArray : ["", "", ""]);

    const benefitsArray = Array.isArray(item.benefits) 
      ? item.benefits 
      : String(item.benefits || "").split(/,|\n/).map(b => b.trim()).filter(Boolean);
    
    setBenefitInputs(benefitsArray.length > 0 ? benefitsArray : ["", "", "", ""]);

    // 3. Update state to show form
    setForm({
      ...formattedForm,
      formId: typeof item.formId === 'object' ? item.formId._id : item.formId
    });
    setEditingId(item.id || item._id);
    setCurrentStep(1);
    setShowOpportunityForm(true);

    if (isSuperDashboard) {
      setActiveSection("Post Opportunity");
    }

    // 4. Scroll to top/form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewResponses = (id) => {
    // Navigate to build-form page to see responses/submissions
    navigate(`/admin-dashboard/build-form/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this opportunity?");
    if (!confirmed) return;
    try {
      setError("");
      await deleteOpportunity(id);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to delete opportunity."));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedIds.length} selected opportunities?`);
    if (!confirmed) return;

    setBusy(true);
    try {
      setError("");
      // Using Promise.all for bulk deletion
      await Promise.all(selectedIds.map(id => deleteOpportunity(id)));
      setSelectedIds([]);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to delete some opportunities."));
    } finally {
      setBusy(false);
    }
  };

  const handleSelectAll = (items) => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
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
    setSelectedIds([]);
    setCurrentStep(1);
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
      const result = await changeAdminPassword(
        adminId,
        newPassword,
        notifyAdmin,
      );
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
    { key: "Closed Application", label: "Closed Application" },
  ];

  const closedApplicationContent = isClosedApplicationPanel ? (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setClosedApplicationView("Internship");
              setSelectedIds([]);
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              closedApplicationView === "Internship"
                ? "bg-[#0B4AA6] text-white"
                : "bg-white text-slate-700 border border-[#DCE5FA]"
            }`}
          >
            Closed Internship
          </button>
          <button
            type="button"
            onClick={() => {
              setClosedApplicationView("Global Program");
              setSelectedIds([]);
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              closedApplicationView === "Global Program"
                ? "bg-[#0B4AA6] text-white"
                : "bg-white text-slate-700 border border-[#DCE5FA]"
            }`}
          >
            Closed Global Program
          </button>
        </div>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={handleBulkDelete}
            className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 flex items-center gap-2 shadow-sm"
          >
            <FiTrash2 size={14} />
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="rounded-xl border border-[#E2EAFC] bg-white">
        <div className="p-4 border-b border-[#E2EAFC] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            {closedApplicationTitle}
          </h3>
          <span className="text-xs font-medium text-slate-500">
            {closedApplicationItems.length} items
          </span>
        </div>

        {closedApplicationItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No closed {closedApplicationView.toLowerCase()} found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#E3EAFA] text-slate-500 bg-slate-50/50">
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                      checked={
                        closedApplicationItems.length > 0 &&
                        selectedIds.length === closedApplicationItems.length
                      }
                      onChange={() => handleSelectAll(closedApplicationItems)}
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Company</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF2FD]">
                {closedApplicationItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.company}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.location}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.deadline
                        ? new Date(item.deadline).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-red-100 text-red-700">
                        Closed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-rose-500 hover:text-rose-700 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  ) : null;

  if (isSuperDashboard && isSuperAdmin) {
    menuItems.splice(
      0,
      menuItems.length,
      { key: "Overview", label: "Overview" },
      // { key: "Post Opportunity", label: "Post Opportunity" },

      { key: "Admins", label: "Admins" },
      { key: "Users", label: "Users" },
      { key: "Internship", label: "Internships" },
      { key: "Global Program", label: "Global Programs" },
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

  return (
    <>
      <div className="min-h-screen bg-[#EEF3FF]">
        <div className="w-full px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-5">
            <aside className="bg-[#E4EBFB] border border-[#D8E2F7] rounded-2xl p-4 xl:sticky xl:top-6 h-[calc(100vh-3rem)] flex flex-col overflow-hidden">
              <div className="mb-7">
                <p className="text-slate-900 text-xl font-semibold">
                  Admin Control
                </p>
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
                    {item.key === "Internship" && <FiGrid size={16} />}
                    {item.key === "Global Program" && <FiPieChart size={16} />}
                    {item.key === "Closed Application" && (
                      <FiEyeOff size={16} />
                    )}
                    {item.key === "Applications" && <FiFileText size={16} />}
                    {item.key === "Overview" && <FiPieChart size={16} />}
                    {item.key === "Post Opportunity" && (
                      <FiBriefcase size={16} />
                    )}
                    {item.key === "Admins" && <FiShield size={16} />}

                    {item.key === "Users" && <FiUsers size={16} />}

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

              {/* PREMIUM HEADER */}
              <div className="bg-white border border-[#DCE5FA] rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm mb-5">
                <div className="flex items-center gap-8">
                  {/* LOGO */}
                 
                  
                  
                  
                  <div>
                    <h1 className="text-xl font-bold text-slate-800">
                      {isSuperDashboard
                        ? "Super Admin Control"
                        : "Admin Dashboard"}
                    </h1>
                    <p className="text-[10px] tracking-[0.1em] text-slate-400 font-bold uppercase">
                      Operational Excellence
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 rounded-xl bg-[#F5F8FF] border border-[#DEE8FF] px-3 py-1.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
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

              {!showOpportunityForm && isSuperStatsSection ? (
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

              {!showOpportunityForm && isSuperPostSection ? (
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
                    <button
                      type="button"
                      onClick={() => handleSectionChange("Closed Application")}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
                    >
                      Closed Applications
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

              {!showOpportunityForm && isAnySuperDirectorySection ? (
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
                                <th className="py-2 px-3">Phone</th>
                                <th className="py-2 px-3">Organization</th>
                                <th className="py-2 px-3">Password</th>
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

                                  <td className="py-2 px-3 text-slate-600 break-all">
                                    {item.whatsappNumber || <span className="text-slate-400">N/A</span>}
                                  </td>
                                  <td className="py-2 px-3 text-slate-600">
                                    {item.organizationName || <span className="text-slate-400">N/A</span>}
                                    
                                  </td>
                                  <td className="py-2 px-3 text-slate-600">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono">
                                        {visiblePasswords[item.id] === true
                                          ? "••••••••"
                                          : visiblePasswords[item.id] === "loading"
                                          ? "Loading..."
                                          : visiblePasswords[item.id] === "error"
                                          ? "Error"
                                          : visiblePasswords[item.id] === "N/A"
                                          ? "N/A"
                                          : visiblePasswords[item.id] || "••••••••"}
                                      </span>
                                      {isSuperAdmin ? (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (!visiblePasswords[item.id] || visiblePasswords[item.id] === true || visiblePasswords[item.id] === "error" || visiblePasswords[item.id] === "N/A") {
                                              fetchDecryptedPassword(item.id);
                                            } else {
                                              setVisiblePasswords((prev) => ({ ...prev, [item.id]: true }));
                                            }
                                          }}
                                          className="text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                          {visiblePasswords[item.id] && 
                                           visiblePasswords[item.id] !== true && 
                                           visiblePasswords[item.id] !== "loading" && 
                                           visiblePasswords[item.id] !== "error" && 
                                           visiblePasswords[item.id] !== "N/A" ? (
                                            <FiEyeOff size={14} />
                                          ) : (
                                            <FiEye size={14} />
                                          )}
                                        </button>
                                      ) : (
                                        <FiEyeOff size={14} className="text-slate-300" />
                                      )}
                                    </div>
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
                                    <div className="flex items-center gap-3">
                                      {item.adminApprovalStatus === "pending" && (
                                        <div className="relative group">
                                          <button
                                            type="button"
                                            onClick={() => handleApproveAdminAccess(item.id)}
                                            disabled={
                                              approvingAdminId === item.id ||
                                              !item.isEmailVerified ||
                                              !item.isPhoneVerified
                                            }
                                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                                          >
                                            {approvingAdminId === item.id ? (
                                              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                              <FiCheck size={16} />
                                            )}
                                          </button>
                                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm z-10">
                                            {!item.isEmailVerified || !item.isPhoneVerified
                                              ? "Verify Email & Phone First"
                                              : "Approve Access"}
                                          </span>
                                        </div>
                                      )}

                                      <div className="relative group">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenAdminDashboard(item.id)}
                                          disabled={
                                            item.adminApprovalStatus === "pending" ||
                                            openingAdminId === item.id ||
                                            deletingUserId === item.id
                                          }
                                          className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50"
                                        >
                                          {openingAdminId === item.id ? (
                                            <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                                          ) : (
                                            <FiExternalLink size={16} />
                                          )}
                                        </button>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm z-10">
                                          {openingAdminId === item.id ? "Opening..." : "Open Dashboard"}
                                        </span>
                                      </div>

                                      <div className="relative group">
                                        <button
                                          type="button"
                                          onClick={() => handleStartPasswordEditor(item.id)}
                                          disabled={
                                            openingAdminId === item.id ||
                                            deletingUserId === item.id ||
                                            changingPasswordAdminId === item.id
                                          }
                                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                                        >
                                          <FiKey size={16} />
                                        </button>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm z-10">
                                          Change Password
                                        </span>
                                      </div>

                                      <div className="relative group">
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteAccount(item)}
                                          disabled={deletingUserId === item.id}
                                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                                        >
                                          {deletingUserId === item.id ? (
                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                          ) : (
                                            <FiTrash2 size={16} />
                                          )}
                                        </button>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm z-10">
                                          Delete Account
                                        </span>
                                      </div>
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
                                          Password must be at least 8 characters
                                          and include letters, numbers, and
                                          special characters.
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
                                          Notify admin by email about password
                                          change
                                        </label>
                                        <div className="mt-2 flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleChangeAdminPassword(item.id)
                                            }
                                            disabled={
                                              changingPasswordAdminId ===
                                              item.id
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
                                              changingPasswordAdminId ===
                                              item.id
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
                          <table className="min-w-[800px] w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-[#E3EAFA] text-slate-500">
                                <th className="py-2 px-3">Name</th>
                                <th className="py-2 px-3">Email</th>
                                <th className="py-2 px-3">Phone</th>
                                <th className="py-2 px-3">Qualification</th>
                                <th className="py-2 px-3">Resume</th>
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

                                  <td className="py-2 px-3 text-slate-600">
                                    {item.whatsappNumber || (
                                      <span className="text-slate-400">
                                        N/A
                                      </span>
                                    )}
                                  </td>
                                  
                                  <td className="py-2 px-3 text-slate-600">
                                    {item.latestQualification || (
                                      <span className="text-slate-400">
                                        N/A
                                      </span>
                                    )}
                                  </td>

                                  <td className="py-2 px-3">
                                    {item.resumeFilePath ? (
                                      <a
                                        href={`${API_BASE_URL}${item.resumeFilePath.startsWith("/") ? "" : "/"}${item.resumeFilePath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B4AA6] text-white text-xs font-semibold hover:bg-[#083D8B] transition shadow-sm"
                                      >
                                        <FiFileText size={14} />
                                        View 
                                      </a>
                                    ) : (
                                      <span className="text-slate-400">
                                        N/A
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="relative group">
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteAccount(item)}
                                          disabled={deletingUserId === item.id}
                                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                                        >
                                          {deletingUserId === item.id ? (
                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                          ) : (
                                            <FiTrash2 size={16} />
                                          )}
                                        </button>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm z-10">
                                          Delete Account
                                        </span>
                                      </div>
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
                          Click Post Internship or Post Global Program above to
                          open the form.
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

                  {scopedApplications.length === 0 ? (
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
                          {scopedApplications.map((application) => (
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
                                      onClick={() =>
                                        handleViewResume(application)
                                      }
                                      className="px-2 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200"
                                    >
                                      View Resume
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">
                                    Not uploaded
                                  </span>
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
                  {!showOpportunityForm && (
                  <div className="bg-white rounded-2xl border border-[#DCE5FA] p-4 sm:p-5">
                    <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-2xl font-semibold text-slate-800">
                        {activeSection === "Internship"
                          ? "Internship Opportunities"
                          : activeSection === "Global Program"
                            ? "Global Program Opportunities"
                            : activeSection === "Closed Application"
                              ? "Closed Application"
                              : "Application Forms"}
                      </h2>
                      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                        {!isClosedApplicationPanel && (
                          <>
                            <button
                              type="button"
                              onClick={handleOpenCreateForm}
                              className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-[#0B4AA6] text-white text-sm font-semibold hover:bg-[#083B85]"
                            >
                              {activeSection === "Internship"
                                ? "Create Internship"
                                : "Create Global Program"}
                            </button>
                            {selectedIds.length > 0 && (
                              <button
                                type="button"
                                onClick={handleBulkDelete}
                                className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
                              >
                                <FiTrash2 size={14} />
                                Delete Selected ({selectedIds.length})
                              </button>
                            )}
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
                          </>
                        )}
                      </div>
                    </div>

                    {isClosedApplicationPanel ? (
                      closedApplicationContent
                    ) : filteredOpportunities.length === 0 ? (
                      <p className="text-slate-500">
                        No opportunities added yet.
                      </p>
                    ) : (
                      <div className="overflow-x-auto border border-[#E2EAFC] rounded-xl bg-white">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-left border-b border-[#E3EAFA] text-slate-500 bg-slate-50/50">
                              <th className="py-3 px-4 w-10 text-center">
                                <input
                                  type="checkbox"
                                  className="rounded border-slate-300"
                                  checked={
                                    filteredOpportunities.length > 0 &&
                                    selectedIds.length ===
                                      filteredOpportunities.length
                                  }
                                  onChange={() =>
                                    handleSelectAll(filteredOpportunities)
                                  }
                                />
                              </th>
                              <th className="py-3 px-4 font-semibold">Name</th>
                              <th className="py-3 px-4 font-semibold">Company</th>
                              <th className="py-3 px-4 font-semibold">Location</th>
                              <th className="py-3 px-4 font-semibold">Date</th>
                              <th className="py-3 px-4 font-semibold">Status</th>
                              <th className="py-3 px-4 font-semibold text-center">Responses</th>
                              <th className="py-3 px-4 font-semibold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#EDF2FD]">
                            {filteredOpportunities.map((item) => {
                              const isClosed = isOpportunityClosed(item);
                              return (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3 px-4 text-center">
                                    <input
                                      type="checkbox"
                                      className="rounded border-slate-300"
                                      checked={selectedIds.includes(item.id)}
                                      onChange={() => handleSelectItem(item.id)}
                                    />
                                  </td>
                                  <td className="py-3 px-4 font-medium text-slate-800">
                                    {item.title}
                                  </td>
                                  <td className="py-3 px-4 text-slate-600">
                                    {item.company}
                                  </td>
                                  <td className="py-3 px-4 text-slate-600">
                                    {item.location}
                                  </td>
                                  <td className="py-3 px-4 text-slate-600">
                                    {item.deadline ? new Date(item.deadline).toLocaleDateString() : "N/A"}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                                      isClosed 
                                        ? "bg-rose-100 text-rose-700" 
                                        : "bg-emerald-100 text-emerald-700"
                                    }`}>
                                      {isClosed ? "Inactive" : "Active"}
                                    </span>
                                  </td>

                                  {/*Responses button*/}
                                  <td className="py-3 px-4 text-center">
  {item.submissionIds && item.submissionIds.length > 0 ? (
    <button
      onClick={() => handleViewResponses(item.id)}
      className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-2 justify-center"
      title="View Responses"
    >
      <span>{item.submissionIds.length}</span>
      <FiEye size={16} />
    </button>
  ) : (
    <span className="text-slate-300 flex items-center gap-2 justify-center">
      <span>0</span>
      <FiEye size={16} />
    </span>
  )}
</td>

                                
                                  

                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                      <button
                                        onClick={() => handleEdit(item)}
                                        className="text-blue-500 hover:text-blue-700 transition-colors"
                                        title="Edit"
                                      >
                                        <FiEdit2 size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-rose-500 hover:text-rose-700 transition-colors"
                                        title="Delete"
                                      >
                                        <FiTrash2 size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                    {showOpportunityForm && (
                      <div className="bg-white rounded-3xl border border-[#DCE5FA] overflow-hidden flex flex-col xl:flex-row min-h-[600px] shadow-sm">
                        {/* LEFT STEPPER SIDEBAR */}
                        <div className="w-full xl:w-[230px] bg-white border-r border-[#E2EAFC] p-8 flex flex-col">
                          <h2 className="text-xl font-bold text-slate-800 mb-6">
                            {editingId ? "Edit" : "Create"} {form.type === "Global Program" ? "Program" : "Internship"}
                          </h2>
                          
                          <div className="w-full bg-[#E2EAFC] h-1.5 rounded-full mb-10 overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full transition-all duration-300" 
                              style={{ width: currentStep === 1 ? "40%" : "100%" }}
                            ></div>
                          </div>

                          <div className="space-y-10 relative">
                            {/* Connector Line */}
                            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[#E2EAFC]"></div>

                            <button 
                              type="button"
                              onClick={() => setCurrentStep(1)}
                              className={`flex items-center gap-4 relative z-10 w-full text-left group ${editingId ? "cursor-pointer" : "cursor-default"}`}
                              disabled={!editingId && currentStep !== 1}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                currentStep === 1 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                              }`}>
                                1
                              </div>
                              <span className={`font-semibold text-sm transition-colors ${
                                currentStep === 1 ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                              }`}>
                                Program Details
                              </span>
                            </button>

                            <button 
                              type="button"
                              onClick={() => {
                                if (editingId) {
                                  navigate(`/admin-dashboard/build-form/${editingId}`);
                                } else {
                                  // For new opportunities, save first
                                  alert("Please save the opportunity details first before building the form.");
                                }
                              }}
                              className={`flex items-center gap-4 relative z-10 w-full text-left group ${editingId ? "cursor-pointer" : "cursor-default"}`}
                              disabled={!editingId}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                currentStep === 2 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                              }`}>
                                2
                              </div>
                              <span className={`font-semibold text-sm transition-colors ${
                                currentStep === 2 ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                              }`}>
                                Application Form
                              </span>
                            </button>
                          </div>

                          <div className="mt-auto pt-10">
                            <button
                              onClick={resetForm}
                              className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                            >
                              Discard
                            </button>
                          </div>
                        </div>

                        {/* RIGHT FORM CONTENT */}
                        <div className="flex-1 p-8 bg-[#F8FBFF]/50 overflow-y-auto custom-scrollbar max-h-[calc(100vh-10rem)]">
                          {/* <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-slate-800">
                              {currentStep === 1 ? "Program Details" : "Application Form Setup"}
                            </h3>
                            <button
                              type="submit"
                              form="opportunity-form"
                              disabled={busy}
                              className={`px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 ${currentStep === 1 ? 'hidden' : ''}`}
                            >
                              {busy ? "Saving..." : editingId ? "Update Listing" : "Publish Now"}
                            </button>
                          </div> */}

                          <form id="opportunity-form" onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-8">
                                {/* Type Selection */}
                                <div className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                    <span>Internship Type <span className="text-rose-600">*</span></span>
                                    <select
                                      name="internshipType"
                                      value={form.internshipType}
                                      onChange={handleChange}
                                      className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                      required
                                    >
                                      <option value="">Select</option>
                                      <option value="Internship">Internship</option>
                                      <option value="Global Program">Global Program</option>
                                      <option value="Summer (Courses)">Summer Internship</option>
                                      <option value="Winter (Courses)">Winter Internship</option>
                                      <option value="NGO / Social Work">NGO / Social Work</option>
                                      <option value="Campus Ambassador">Campus Ambassador</option>
                                      <option value="Apprenticeships">Apprenticeships</option>
                                      <option value="Externships">Externships</option>
                                      <option value="Government Internship">Government Internship</option>
                                      <option value="Research Internships">Research Internships</option>
                                      <option value="Assessment Internships">Assessment Internships</option>
                                    </select>
                                  </label>
                                </div>

                                {/* Basic Info */}
                                <div className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                                  <h4 className="text-md font-bold text-slate-800 mb-6">Basic Info</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Title <span className="text-rose-600">*</span></span>
                                      <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Software Engineer"
                                        className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        required
                                      />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Company <span className="text-rose-600">*</span></span>
                                      <input
                                        name="company"
                                        value={form.company}
                                        onChange={handleChange}
                                        placeholder="Company Name"
                                        className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        required
                                      />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Location <span className="text-rose-600">*</span></span>
                                      <input
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="City / Remote"
                                        className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        required
                                      />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Website URL</span>
                                      <input
                                        name="website"
                                        value={form.website}
                                        onChange={handleChange}
                                        placeholder="https://company.com"
                                        className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                      />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Start Date <span className="text-rose-600">*</span></span>
                                      <input
                                        type="date"
                                        name="startDate"
                                        value={form.startDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                        className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        required
                                      />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Deadline <span className="text-rose-600">*</span></span>
                                      <input
                                        type="date"
                                        name="deadline"
                                        value={form.deadline}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                        className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        required
                                      />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Duration <span className="text-rose-600">*</span></span>
                                      <div className="flex gap-2">
                                        <input
                                          name="duration"
                                          type="number"
                                          value={form.duration}
                                          onChange={handleChange}
                                          placeholder="e.g. 3"
                                          className="flex-1 border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                          required
                                        />
                                        <select
                                          name="durationUnit"
                                          value={form.durationUnit}
                                          onChange={handleChange}
                                          className="w-[120px] border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        >
                                          <option value="Weeks">Weeks</option>
                                          <option value="Months">Months</option>
                                          <option value="Years">Years</option>
                                        </select>
                                      </div>
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Work Mode <span className="text-rose-600">*</span></span>
                                      <select
                                        name="workMode"
                                        value={form.workMode}
                                        onChange={handleChange}
                                        className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        required
                                      >
                                        <option value="In Office">In Office</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                      </select>
                                    </label>
                                  </div>
                                </div>
                                
                                {/* Logo Upload Section - Added after Basic Details */}
                                <div className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                                  <h4 className="text-md font-bold text-slate-800 mb-6">Company Logo</h4>
                                  <div className="flex flex-col sm:flex-row items-center gap-8">
                                    <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-[#D6E2FC] flex items-center justify-center overflow-hidden flex-shrink-0">
                                      {form.logo ? (
                                        <img src={form.logo} alt="Preview" className="w-full h-full object-contain" />
                                      ) : (
                                        <FiGlobe className="text-slate-300" size={32} />
                                      )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                      <p className="text-sm text-slate-500">
                                        Upload your company logo. PNG, JPG or SVG (Max 2MB).
                                      </p>
                                      <label className="inline-flex items-center px-6 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm cursor-pointer hover:bg-blue-100 transition-all border border-blue-100">
                                        <span>Choose Logo File</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={handleLogoChange}
                                          className="hidden"
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {/* Compensation */}
                                <div className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                                  <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-md font-bold text-slate-800">Stipend Details</h4>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                      <div className="relative flex items-center">
                                        <input
                                          type="checkbox"
                                          name="isUnpaid"
                                          checked={form.isUnpaid}
                                          onChange={handleChange}
                                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition-all checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
                                        />
                                        <FiCheck className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" size={14} />
                                      </div>
                                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">Unpaid Internship</span>
                                    </label>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className={`flex flex-col gap-2 text-sm font-semibold transition-opacity ${form.isUnpaid ? 'opacity-50 pointer-events-none' : 'text-slate-700'}`}>
                                      <span>Stipend Amount</span>
                                      <input
                                        name="stipend"
                                        value={form.isUnpaid ? "0" : form.stipend}
                                        onChange={handleChange}
                                        placeholder="e.g. 10000"
                                        disabled={form.isUnpaid}
                                        className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                      />
                                    </label>
                                    <label className={`flex flex-col gap-2 text-sm font-semibold transition-opacity ${form.isUnpaid ? 'opacity-50 pointer-events-none' : 'text-slate-700'}`}>
                                      <span>Currency</span>
                                      <select
                                        name="stipendCurrency"
                                        value={form.stipendCurrency}
                                        onChange={handleChange}
                                        disabled={form.isUnpaid}
                                        className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                      >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                      </select>
                                    </label>
                                  </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm space-y-6">
                                  <h4 className="text-md font-bold text-slate-800 mb-0">Role Description</h4>
                                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                    <span>Detailed Description <span className="text-rose-600">*</span></span>
                                    <textarea
                                      name="description"
                                      value={form.description}
                                      onChange={handleChange}
                                      placeholder="Responsibilities, expectations, etc."
                                      className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-h-[150px]"
                                      required
                                    />
                                  </label>
                                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                    <span>Who Can Apply (Eligibility)</span>
                                    <textarea
                                      name="whoCanApply"
                                      value={form.whoCanApply}
                                      onChange={handleChange}
                                      placeholder="Eligibility criteria"
                                      className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-h-[100px]"
                                    />
                                  </label>
                                </div>

                                {/* Skills & Benefits Section */}
                                <div className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm space-y-6">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-md font-bold text-slate-800">Required Skills</h4>
                                    <button type="button" onClick={addRequiredSkillInput} className="text-sm text-blue-600 font-bold">+ Add Skill</button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {requiredSkillInputs.map((skill, index) => (
                                      <div key={index} className="relative group">
                                        <input
                                          value={skill}
                                          onChange={(e) => handleRequiredSkillChange(index, e.target.value)}
                                          placeholder={`Skill ${index + 1}`}
                                          className="w-full border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                                          required={index < 3}
                                        />
                                        {requiredSkillInputs.length > 3 && (
                                          <button
                                            type="button"
                                            onClick={() => removeRequiredSkillInput(index)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                            title="Remove Skill"
                                          >
                                            <FiTrash2 size={16} />
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                    <span>Primary Skills / Tags (Comma separated) <span className="text-rose-600">*</span></span>
                                    <input
                                      name="skills"
                                      value={form.skills}
                                      onChange={handleChange}
                                      placeholder="React, JavaScript, CSS"
                                      className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                      required
                                    />
                                  </label>
                                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                    <span>Highlight Tags</span>
                                    <input
                                      name="cardTags"
                                      value={form.cardTags}
                                      onChange={handleChange}
                                      placeholder="Immediate Joiner, PPO"
                                      className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                  </label>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm space-y-6">
                                  <h4 className="text-md font-bold text-slate-800">Benefits</h4>
                                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                    <span>Perks & Benefits (Use commas or new lines)</span>
                                    <textarea
                                      name="benefits"
                                      value={form.benefits}
                                      onChange={handleChange}
                                      placeholder="e.g. Flexible hours, Certificate, PPO, Health insurance..."
                                      className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-h-[120px]"
                                    />
                                  </label>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm">
                                  <h4 className="text-md font-bold text-slate-800 mb-6">Company Details</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Department</span>
                                      <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 outline-none"/>
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Functional Role</span>
                                      <input name="functionalRole" value={form.functionalRole} onChange={handleChange} placeholder="e.g. Developer" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 outline-none"/>
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Company Type</span>
                                      <input name="companyType" value={form.companyType} onChange={handleChange} placeholder="e.g. Startup" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 outline-none"/>
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Company Size</span>
                                      <input name="companySize" value={form.companySize} onChange={handleChange} placeholder="e.g. 50-200" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 outline-none"/>
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Founded Year</span>
                                      <input name="foundedYear" value={form.foundedYear} onChange={handleChange} placeholder="e.g. 2015" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 outline-none"/>
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                      <span>Industry</span>
                                      <input name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. Tech" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 outline-none"/>
                                    </label>
                                  </div>
                                </div>

                                {form.type === "Global Program" && (
                                  <div className="bg-white p-6 rounded-2xl border border-[#E2EAFC] shadow-sm space-y-6">
                                    <h4 className="text-md font-bold text-slate-800">Program Specifics</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                        <span>Program Type</span>
                                        <input name="programType" value={form.programType} onChange={handleChange} placeholder="e.g. Fellowship" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 outline-none"/>
                                      </label>
                                      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                                        <span>Eligibility Criteria</span>
                                        <input name="eligibility" value={form.eligibility} onChange={handleChange} placeholder="Who can join" className="border border-[#D6E2FC] rounded-xl px-4 py-3 bg-slate-50 outline-none"/>
                                      </label>
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-end pt-8 border-t border-[#E2EAFC]">
                                  <button
                                    type="submit"
                                    disabled={busy}
                                    className="px-12 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-black shadow-xl transition-all active:scale-95 disabled:opacity-50"
                                  >
                                    {busy ? "Publishing..." : editingId ? "Update Opportunity" : "Preview & Publish Internship"}
                                  </button>
                                </div>
                              </div>
                          </form>
                        </div>
                      </div>
                    )}

                  {/* PREVIEW MODAL */}
                  {showPreviewModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                          <h2 className="text-xl font-bold text-slate-800">Confirm Program Details</h2>
                          <button onClick={() => setShowPreviewModal(false)} className="text-blue-600 font-bold hover:underline text-sm">Edit</button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                          {[
                            { label: "Internship Type", value: form.internshipType },
                            { label: "Listing Type", value: form.type },
                            { label: "Work Profile", value: form.title },
                            { label: "Company Name", value: form.company },
                            { label: "Location", value: form.location },
                            { label: "Company Website Url", value: form.website || "-" },
                            { label: "Detailed Description", value: form.description },
                            { label: "Eligibility Criteria", value: form.whoCanApply || "-" },
                            { label: "Stipend", value: `${form.stipendCurrency} ${form.stipend || "Unpaid"}` },
                            { label: "Work Mode", value: form.workMode },
                            { label: "Company Founded", value: form.foundedYear || "-" },
                            { label: "Company Type", value: form.companyType || "-" }
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-sm font-medium text-slate-500">{item.label}</span>
                              <span className="text-sm font-semibold text-slate-800 text-right max-w-[60%] truncate">{item.value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-4 bg-white">
                          <button 
                            type="button"
                            onClick={() => setShowPreviewModal(false)}
                            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                          >
                            Edit
                          </button>
                          <button 
                            type="button"
                            onClick={handleConfirmSubmit}
                            disabled={busy}
                            className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 min-w-[160px]"
                          >
                            {busy ? "Publishing..." : "Confirm & Create"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUCCESS MESSAGE */}
                  {showSuccessMessage && (
                    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-top duration-300">
                      <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <FiCheck className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-bold">Successfully Published!</p>
                          <p className="text-xs text-emerald-100">Your opportunity is now live on the portal.</p>
                        </div>
                      </div>
                    </div>
                  )}
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
