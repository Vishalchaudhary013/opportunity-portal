import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      res.status(401).json({ message: "Unauthorized. Token missing." });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret_change_me",
    );

    const user = await User.findById(decoded.id).select(
      "_id accountType firstName lastName fullName email latestQualification yearOfPassing collegeName location phoneNumber whatsappNumber agreeToWhatsAppUpdates isEmailVerified isPhoneVerified role adminApprovalStatus",
    );

    if (!user) {
      res.status(401).json({ message: "Unauthorized. User not found." });
      return;
    }

    if (user.role === "admin" && user.adminApprovalStatus === "pending") {
      res.status(403).json({
        message:
          "Admin access pending. Please wait for super admin approval before using this account.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || !["admin", "super_admin"].includes(req.user.role)) {
    res
      .status(403)
      .json({ message: "Forbidden. Admin or super admin access required." });
    return;
  }

  next();
};

export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "super_admin") {
    res
      .status(403)
      .json({ message: "Forbidden. Super admin access required." });
    return;
  }

  next();
};
