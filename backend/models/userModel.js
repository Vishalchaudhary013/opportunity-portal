import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      enum: ["student", "employer", "user", "admin", "super_admin"],
      default: "student",
      trim: true,
    },
    firstName: {
      type: String,
      default: "",
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCodeHash: {
      type: String,
      default: "",
      select: false,
    },
    emailVerificationCodeExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
    password: {
      type: String,
      required: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: true, // Commented out requirement: was false
    },
    phoneVerificationCodeHash: {
      type: String,
      default: "",
      select: false,
    },
    phoneVerificationCodeExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
    passwordResetCodeHash: {
      type: String,
      default: "",
      select: false,
    },
    passwordResetCodeExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
    latestQualification: {
      type: String,
      default: "",
      trim: true,
    },
    yearOfPassing: {
      type: String,
      default: "",
      trim: true,
    },
    collegeName: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: "",
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: "",
      trim: true,
    },
    resumeFileName: {
      type: String,
      default: "",
      trim: true,
    },
    resumeFilePath: {
      type: String,
      default: "",
      trim: true,
    },
    organizationName: {
      type: String,
      default: "",
      trim: true,
    },
    organizationType: {
      type: String,
      default: "",
      trim: true,
    },
    username: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    agreeToWhatsAppUpdates: {
      type: Boolean,
      default: false,
    },
    agreeToTerms: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    adminApprovalStatus: {
      type: String,
      enum: ["pending", "approved"],
      default: "approved",
    },
    adminApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    adminApprovedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
