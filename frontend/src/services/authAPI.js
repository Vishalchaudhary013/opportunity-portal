import apiClient from "./apiClient";

export const socialAuthURL = {
  google: "/api/auth/google",
  linkedin: "/api/auth/linkedin",
  facebook: "/api/auth/facebook",
  instagram: "/api/auth/instagram",
};

export const authAPI = {
  signup: async (payload) => apiClient.post("/api/auth/signup", payload),

  userSignup: async (payload) => apiClient.post("/api/auth/user-signup", payload),

  adminSignup: async (payload) => apiClient.post("/api/auth/admin-signup", payload),

  superAdminSignup: async (payload) =>
    apiClient.post("/api/auth/super-admin-signup", payload),

  login: async ({ email, password }) =>
    apiClient.post("/api/auth/login", {
      email,
      password,
    }),

  userLogin: async ({ email, password }) =>
    apiClient.post("/api/auth/user-login", {
      email,
      password,
    }),

  adminLogin: async ({ email, password }) =>
    apiClient.post("/api/auth/admin-login", {
      email,
      password,
    }),

  requestEmailVerification: async ({ email }) =>
    apiClient.post("/api/auth/request-email-verification", {
      email,
    }),

  verifyEmailCode: async ({ email, code }) =>
    apiClient.post("/api/auth/verify-email", {
      email,
      code,
    }),

  requestPhoneVerification: async ({ email }) =>
    apiClient.post("/api/auth/request-phone-verification", {
      email,
    }),

  verifyPhoneCode: async ({ email, code }) =>
    apiClient.post("/api/auth/verify-phone", {
      email,
      code,
    }),

  forgotPassword: async ({ email }) =>
    apiClient.post("/api/auth/forgot-password", {
      email,
    }),

  resetPassword: async ({ email, code, newPassword }) =>
    apiClient.post("/api/auth/reset-password", {
      email,
      code,
      newPassword,
    }),

  me: async () => apiClient.get("/api/auth/me"),

  updateMe: async (payload) => apiClient.patch("/api/auth/me", payload),

  getUserDirectory: async () => apiClient.get("/api/auth/directory"),

  getWhatsAppStatus: async () => apiClient.get("/api/auth/whatsapp-status"),

  impersonateAdmin: async ({ adminId }) =>
    apiClient.post("/api/auth/impersonate-admin", {
      adminId,
    }),

  deleteUserAccount: async ({ userId }) =>
    apiClient.delete(`/api/auth/users/${userId}`),

  changeAdminPassword: async ({ adminId, newPassword, notifyAdmin = false }) =>
    apiClient.patch(`/api/auth/admins/${adminId}/password`, {
      newPassword,
      notifyAdmin,
    }),

  approveAdminAccess: async ({ adminId }) =>
    apiClient.patch(`/api/auth/admins/${adminId}/approve-access`),

  checkUsername: async () => ({
    data: {
      available: true,
      message: "Username availability checks are not configured.",
    },
  }),
  checkEmail: async () => ({
    data: {
      available: true,
      message: "Email availability checks are not configured.",
    },
  }),
  getDecryptedAdminPassword: async (adminId) =>
    apiClient.get(`/api/auth/admins/${adminId}/decrypted-password`),
};

export default authAPI;
