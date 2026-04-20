import express from "express";
import {
  approveAdminAccess,
  adminLogin,
  adminSignup,
  changeAdminPassword,
  deleteUserAccount,
  forgotPassword,
  getMe,
  getUserDirectory,
  getWhatsAppStatus,
  impersonateAdmin,
  login,
  requestEmailVerification,
  requestPhoneVerification,
  resetPassword,
  signup,
  superAdminSignup,
  updateMe,
  userLogin,
  userSignup,
  verifyEmailCode,
  verifyPhoneCode,
} from "../controllers/authController.js";
import { protect, requireSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/user-signup", userSignup);
router.post("/admin-signup", adminSignup);
router.post("/super-admin-signup", superAdminSignup);
router.post("/login", login);
router.post("/user-login", userLogin);
router.post("/admin-login", adminLogin);
router.post("/request-email-verification", requestEmailVerification);
router.post("/verify-email", verifyEmailCode);
router.post("/request-phone-verification", requestPhoneVerification);
router.post("/verify-phone", verifyPhoneCode);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/impersonate-admin", protect, requireSuperAdmin, impersonateAdmin);
router.delete("/users/:id", protect, requireSuperAdmin, deleteUserAccount);
router.patch(
  "/admins/:id/password",
  protect,
  requireSuperAdmin,
  changeAdminPassword,
);
router.patch(
  "/admins/:id/approve-access",
  protect,
  requireSuperAdmin,
  approveAdminAccess,
);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.get("/whatsapp-status", protect, getWhatsAppStatus);
router.get("/directory", protect, requireSuperAdmin, getUserDirectory);

export default router;
