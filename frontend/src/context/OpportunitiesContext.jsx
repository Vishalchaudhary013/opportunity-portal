import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import apiClient, {
  API_BASE_URL,
  getErrorMessage,
  setAuthToken,
} from "../services/apiClient";
import { authAPI } from "../services/authAPI";

const AUTH_TOKEN_KEY = "auth_token_v1";
const IMPERSONATOR_TOKEN_KEY = "impersonator_token_v1";
const SAVED_INTERNSHIPS_KEY = "saved_internship_ids_v1";

const OpportunitiesContext = createContext(null);

const normalizeOpportunityPayload = (payload) => {
  const { logoFile, ...rest } = payload || {};
  const parsedSkills = Array.isArray(rest.skills)
    ? rest.skills
    : String(rest.skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

  return {
    ...rest,
    skills: parsedSkills,
    logo: rest.logo || "",
  };
};

const resolveLogoUrl = (logo) => {
  const raw = String(logo || "").trim();

  if (!raw) {
    return "";
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  if (raw.startsWith("/")) {
    return `${API_BASE_URL}${raw}`;
  }

  return raw;
};

const mapOpportunityFromApi = (item) => ({
  ...item,
  id: item._id || item.id,
  logo: resolveLogoUrl(item.logo),
  skills: Array.isArray(item.skills) ? item.skills : [],
  requiredSkills: Array.isArray(item.requiredSkills)
    ? item.requiredSkills
    : String(item.requiredSkills || "")
        .split(/\r?\n|,/) 
        .map((entry) => entry.trim())
        .filter(Boolean),
  whoCanApply: Array.isArray(item.whoCanApply)
    ? item.whoCanApply
    : String(item.whoCanApply || "")
        .split(/\r?\n|,/) 
        .map((entry) => entry.trim())
        .filter(Boolean),
  benefits: Array.isArray(item.benefits)
    ? item.benefits
    : String(item.benefits || "")
        .split(/\r?\n|,/) 
        .map((entry) => entry.trim())
        .filter(Boolean),
  cardTags: Array.isArray(item.cardTags)
    ? item.cardTags
    : String(item.cardTags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
  stipendDetails:
    item.stipendDetails && typeof item.stipendDetails === "object"
      ? item.stipendDetails
      : {
          min: null,
          max: null,
          currency: "INR",
          period: "per month",
        },
});

const buildOpportunityRequest = (body, originalPayload) => {
  const logoFile = originalPayload?.logoFile;
  const needsMultipart = body.type === "Internship" && logoFile instanceof File;

  if (!needsMultipart) {
    return { data: body, config: undefined };
  }

  const formData = new FormData();

  Object.entries(body).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  formData.append("logoFile", logoFile);

  return {
    data: formData,
    config: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  };
};

const mapApplicationFromApi = (item) => ({
  ...item,
  id: item._id || item.id,
  appliedAt: item.createdAt || item.appliedAt,
  resumeFileName: item?.resume?.fileName || item.resumeFileName || "",
  resumeFilePath: item?.resume?.filePath || item.resumeFilePath || "",
});

const getOpportunityApiBase = (type) => {
  if (type === "Internship") {
    return "/api/internships";
  }

  if (type === "Global Program") {
    return "/api/global-programs";
  }

  return null;
};

export const OpportunitiesProvider = ({ children }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [authToken, setAuthTokenState] = useState(
    localStorage.getItem(AUTH_TOKEN_KEY) || "",
  );
  const [impersonatorToken, setImpersonatorToken] = useState(
    localStorage.getItem(IMPERSONATOR_TOKEN_KEY) || "",
  );
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [savedInternshipIds, setSavedInternshipIds] = useState(() => {
    try {
      const raw = localStorage.getItem(SAVED_INTERNSHIPS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map((item) => String(item));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setAuthToken(authToken);
  }, [authToken]);

  useEffect(() => {
    localStorage.setItem(
      SAVED_INTERNSHIPS_KEY,
      JSON.stringify(savedInternshipIds),
    );
  }, [savedInternshipIds]);

  const saveSession = (token, currentUser) => {
    setAuthTokenState(token);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setAuthToken(token);
    setUser(currentUser);
  };

  const clearImpersonation = () => {
    setImpersonatorToken("");
    localStorage.removeItem(IMPERSONATOR_TOKEN_KEY);
  };

  const clearSession = () => {
    clearImpersonation();
    setAuthTokenState("");
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthToken("");
    setUser(null);
    setApplications([]);
  };

  const loadOpportunities = async () => {
    const [internshipsResponse, globalProgramsResponse] = await Promise.all([
      apiClient.get("/api/internships"),
      apiClient.get("/api/global-programs"),
    ]);

    const merged = [
      ...(internshipsResponse.data || []),
      ...(globalProgramsResponse.data || []),
    ];

    setOpportunities(merged.map(mapOpportunityFromApi));
  };

  const loadApplications = async () => {
    const response = await apiClient.get("/api/applications");
    setApplications((response.data || []).map(mapApplicationFromApi));
  };

  const bootstrap = async () => {
    try {
      if (authToken) {
        const me = await apiClient.get("/api/auth/me");
        setUser(me.data?.user || null);
      }
    } catch (error) {
      clearSession();
    } finally {
      try {
        await loadOpportunities();
      } catch (error) {
        setOpportunities([]);
      }
      setIsBootstrapping(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const signup = async (payload) => {
    clearImpersonation();
    const response = await authAPI.signup(payload);
    return response.data;
  };

  const adminSignup = async (payload) => {
    clearImpersonation();
    const response = await authAPI.adminSignup(payload);
    return response.data;
  };

  const superAdminSignup = async (payload) => {
    clearImpersonation();
    const response = await authAPI.superAdminSignup(payload);
    return response.data;
  };

  const login = async ({ email, password }) => {
    clearImpersonation();
    const response = await authAPI.login({
      email,
      password,
    });
    saveSession(response.data.token, response.data.user);
    return response.data;
  };

  const userLogin = async ({ email, password }) => {
    clearImpersonation();
    const response = await authAPI.userLogin({
      email,
      password,
    });
    saveSession(response.data.token, response.data.user);
    return response.data;
  };

  const adminLogin = async ({ email, password }) => {
    clearImpersonation();
    const response = await authAPI.adminLogin({
      email,
      password,
    });
    saveSession(response.data.token, response.data.user);
    return response.data;
  };

  const requestEmailVerification = async ({ email }) => {
    const response = await authAPI.requestEmailVerification({ email });
    return response.data;
  };

  const verifyEmailCode = async ({ email, code }) => {
    const response = await authAPI.verifyEmailCode({ email, code });
    return response.data;
  };

  const requestPhoneVerification = async ({ email }) => {
    const response = await authAPI.requestPhoneVerification({ email });
    return response.data;
  };

  const verifyPhoneCode = async ({ email, code }) => {
    const response = await authAPI.verifyPhoneCode({ email, code });
    return response.data;
  };

  const forgotPassword = async ({ email }) => {
    const response = await authAPI.forgotPassword({ email });
    return response.data;
  };

  const resetPassword = async ({ email, code, newPassword }) => {
    const response = await authAPI.resetPassword({ email, code, newPassword });
    return response.data;
  };

  const updateMyProfile = async (payload) => {
    const response = await authAPI.updateMe(payload || {});
    const nextUser = response.data?.user || null;

    if (nextUser) {
      setUser(nextUser);
    }

    return response.data;
  };

  const impersonateAdmin = async (adminId) => {
    if (!impersonatorToken && authToken) {
      setImpersonatorToken(authToken);
      localStorage.setItem(IMPERSONATOR_TOKEN_KEY, authToken);
    }

    const response = await authAPI.impersonateAdmin({
      adminId,
    });

    saveSession(response.data.token, response.data.user);
    return response.data;
  };

  const stopImpersonation = async () => {
    if (!impersonatorToken) {
      return null;
    }

    setAuthTokenState(impersonatorToken);
    localStorage.setItem(AUTH_TOKEN_KEY, impersonatorToken);
    setAuthToken(impersonatorToken);

    clearImpersonation();

    const me = await authAPI.me();
    setUser(me.data?.user || null);
    return me.data?.user || null;
  };

  const getUserDirectory = async () => {
    const response = await authAPI.getUserDirectory();
    return response.data;
  };

  const getWhatsAppStatus = async () => {
    const response = await authAPI.getWhatsAppStatus();
    return response.data;
  };

  const deleteUserAccount = async (userId) => {
    const response = await authAPI.deleteUserAccount({ userId });
    return response.data;
  };

  const changeAdminPassword = async (
    adminId,
    newPassword,
    notifyAdmin = false,
  ) => {
    const response = await authAPI.changeAdminPassword({
      adminId,
      newPassword,
      notifyAdmin,
    });
    return response.data;
  };

  const approveAdminAccess = async (adminId) => {
    const response = await authAPI.approveAdminAccess({ adminId });
    return response.data;
  };

  const logout = () => {
    clearSession();
  };

  const saveInternship = (id) => {
    const normalizedId = String(id || "").trim();

    if (!normalizedId) {
      return;
    }

    setSavedInternshipIds((prev) => {
      if (prev.includes(normalizedId)) {
        return prev;
      }

      return [...prev, normalizedId];
    });
  };

  const unsaveInternship = (id) => {
    const normalizedId = String(id || "").trim();

    if (!normalizedId) {
      return;
    }

    setSavedInternshipIds((prev) =>
      prev.filter((itemId) => itemId !== normalizedId),
    );
  };

  const toggleSavedInternship = (id) => {
    const normalizedId = String(id || "").trim();

    if (!normalizedId) {
      return false;
    }

    let nextSavedState = false;
    setSavedInternshipIds((prev) => {
      if (prev.includes(normalizedId)) {
        nextSavedState = false;
        return prev.filter((itemId) => itemId !== normalizedId);
      }

      nextSavedState = true;
      return [...prev, normalizedId];
    });

    return nextSavedState;
  };

  const isInternshipSaved = (id) => {
    const normalizedId = String(id || " ").trim();
    return savedInternshipIds.includes(normalizedId);
  };

  const addOpportunity = async (payload) => {
    const body = normalizeOpportunityPayload(payload);
    const apiBase = getOpportunityApiBase(body.type);

    if (!apiBase) {
      throw new Error("Opportunity type is required.");
    }

    const request = buildOpportunityRequest(body, payload);
    const response = await apiClient.post(apiBase, request.data, request.config);
    setOpportunities((prev) => [mapOpportunityFromApi(response.data), ...prev]);
    return response.data;
  };

  const updateOpportunity = async (id, payload) => {
    const body = normalizeOpportunityPayload(payload);
    const current = opportunities.find((item) => item.id === id);
    const apiBase = getOpportunityApiBase(body.type || current?.type);

    if (!apiBase) {
      throw new Error("Unable to resolve opportunity type for update.");
    }

    const request = buildOpportunityRequest(body, payload);
    const response = await apiClient.put(`${apiBase}/${id}`, request.data, request.config);
    const updated = mapOpportunityFromApi(response.data);
    setOpportunities((prev) =>
      prev.map((item) => (item.id === id ? updated : item)),
    );
    return response.data;
  };

  const deleteOpportunity = async (id) => {
    const current = opportunities.find((item) => item.id === id);
    const apiBase = getOpportunityApiBase(current?.type);

    if (!apiBase) {
      throw new Error("Unable to resolve opportunity type for delete.");
    }

    await apiClient.delete(`${apiBase}/${id}`);
    setOpportunities((prev) => prev.filter((item) => item.id !== id));
  };

  const submitApplication = async (payload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);
    formData.append("college", payload.college);
    formData.append("degree", payload.degree);
    formData.append("year", payload.year);
    formData.append("skills", payload.skills);
    formData.append("experience", payload.experience);
    formData.append("portfolio", payload.portfolio || "");
    formData.append("linkedin", payload.linkedin || "");
    formData.append("whySelectYou", payload.whySelectYou);
    formData.append("opportunityTitle", payload.opportunityTitle);
    formData.append("opportunityType", payload.opportunityType);
    formData.append("company", payload.company || "");
    if (payload.opportunityId) {
      formData.append("opportunityId", payload.opportunityId);
    }
    formData.append("resume", payload.resumeFile);

    const response = await apiClient.post("/api/applications", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  const updateApplicationStatus = async (id, status) => {
    const response = await apiClient.patch(`/api/applications/${id}/status`, {
      status,
    });

    const updated = mapApplicationFromApi(response.data);
    setApplications((prev) =>
      prev.map((item) => (item.id === id ? updated : item)),
    );
    return response.data;
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  };

  const exportOpportunities = async (format = "csv", type) => {
    const apiBase = getOpportunityApiBase(type);

    if (!apiBase) {
      throw new Error("Opportunity type is required for export.");
    }

    const response = await apiClient.get(`${apiBase}/export`, {
      params: {
        format,
      },
      responseType: "blob",
    });

    const suffix = format === "xlsx" ? "xlsx" : "csv";
    const label = type ? type.toLowerCase().replace(/\s+/g, "-") : "all";
    downloadBlob(response.data, `opportunities-${label}.${suffix}`);
  };

  const exportApplications = async (format = "csv") => {
    const response = await apiClient.get("/api/applications/export", {
      params: { format },
      responseType: "blob",
    });

    const suffix = format === "xlsx" ? "xlsx" : "csv";
    downloadBlob(response.data, `applications.${suffix}`);
  };

  const getApiErrorMessage = (error, fallback) =>
    getErrorMessage(error, fallback);

  const value = useMemo(
    () => ({
      opportunities,
      applications,
      user,
      authToken,
      isImpersonating: Boolean(impersonatorToken),
      isBootstrapping,
      savedInternshipIds,
      isAdmin: ["admin", "super_admin"].includes(user?.role),
      isSuperAdmin: user?.role === "super_admin",
      login,
      userLogin,
      adminLogin,
      signup,
      adminSignup,
      superAdminSignup,
      requestEmailVerification,
      verifyEmailCode,
      requestPhoneVerification,
      verifyPhoneCode,
      forgotPassword,
      resetPassword,
      updateMyProfile,
      getUserDirectory,
      deleteUserAccount,
      changeAdminPassword,
      approveAdminAccess,
      getWhatsAppStatus,
      impersonateAdmin,
      stopImpersonation,
      logout,
      saveInternship,
      unsaveInternship,
      toggleSavedInternship,
      isInternshipSaved,
      loadOpportunities,
      loadApplications,
      addOpportunity,
      updateOpportunity,
      deleteOpportunity,
      submitApplication,
      updateApplicationStatus,
      exportOpportunities,
      exportApplications,
      getApiErrorMessage,
    }),
    [
      opportunities,
      applications,
      user,
      authToken,
      impersonatorToken,
      isBootstrapping,
      savedInternshipIds,
    ],
  );

  return (
    <OpportunitiesContext.Provider value={value}>
      {children}
    </OpportunitiesContext.Provider>
  );
};

export const useOpportunities = () => {
  const ctx = useContext(OpportunitiesContext);
  if (!ctx) {
    throw new Error(
      "useOpportunities must be used inside OpportunitiesProvider",
    );
  }
  return ctx;
};
