import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/userModel.js";
import { generateToken } from "../utils/token.js";
import { sendTransactionalEmail } from "../utils/mailer.js";
import {
  getWhatsAppRuntimeStatus,
  sendWhatsAppText,
} from "../utils/whatsapp.js";

const PASSWORD_RULE_MESSAGE =
  "Password must be at least 8 characters and include letters, numbers, and special characters.";
const OTP_EXPIRES_IN_MINUTES = 10;

const getOtpExpiryDate = () =>
  new Date(Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000);

const generateOtpCode = () => `${Math.floor(100000 + Math.random() * 900000)}`;

const hashCode = (code) =>
  crypto.createHash("sha256").update(String(code)).digest("hex");

const buildAdminPasswordChangedEmail = ({ adminName, changedByName }) => {
  const subject = "Your admin password was changed";
  const text = [
    `Hi ${adminName || "Admin"},`,
    "",
    `Your admin account password was changed by ${changedByName || "Super Admin"}.`,
    "If you did not expect this change, contact support immediately.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <p>Hi ${adminName || "Admin"},</p>
      <p>
        Your admin account password was changed by
        <strong>${changedByName || "Super Admin"}</strong>.
      </p>
      <p>If you did not expect this change, contact support immediately.</p>
    </div>
  `;

  return { subject, text, html };
};

const isStrongPassword = (password) => {
  if (typeof password !== "string") {
    return false;
  }

  return (
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

const sanitizeUser = (userDoc) => ({
  id: userDoc._id,
  accountType: userDoc.accountType || "",
  firstName: userDoc.firstName || "",
  lastName: userDoc.lastName || "",
  fullName: userDoc.fullName,
  email: userDoc.email,
  latestQualification: userDoc.latestQualification || "",
  yearOfPassing: userDoc.yearOfPassing || "",
  collegeName: userDoc.collegeName || "",
  location: userDoc.location || "",
  phoneNumber: userDoc.phoneNumber || "",
  whatsappNumber: userDoc.whatsappNumber || "",
  resumeFileName: userDoc.resumeFileName || "",
  resumeFilePath: userDoc.resumeFilePath || "",
  agreeToWhatsAppUpdates: Boolean(userDoc.agreeToWhatsAppUpdates),
  isEmailVerified: Boolean(userDoc.isEmailVerified),
  isPhoneVerified: Boolean(userDoc.isPhoneVerified),
  role: userDoc.role,
  adminApprovalStatus:
    userDoc.role === "admin"
      ? userDoc.adminApprovalStatus || "approved"
      : "approved",
  adminApprovedAt: userDoc.adminApprovedAt || null,
});

// ─── OTP Email Content Builder ────────────────────────────────────────────────

const buildOtpEmailContent = ({ fullName, code, reason }) => {
  const isReset = reason === "password_reset";

  const subject = isReset
    ? "Your password reset code"
    : "Your email verification code";

  const purposeLabel = isReset
    ? "reset your password"
    : "verify your email address";

  const text = [
    `Hi ${fullName || "there"},`,
    "",
    `Your ${isReset ? "password reset" : "email verification"} code is: ${code}`,
    `It expires in ${OTP_EXPIRES_IN_MINUTES} minutes.`,
    "",
    `If you did not request this code, please ignore this email.`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6; max-width: 480px;">
      <p>Hi ${fullName || "there"},</p>
      <p>Use the code below to ${purposeLabel}:</p>
      <div style="
        display: inline-block;
        background: #f3f4f6;
        border-radius: 8px;
        padding: 12px 24px;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #111827;
        margin: 8px 0;
      ">${code}</div>
      <p style="color: #6b7280; font-size: 14px;">
        This code expires in <strong>${OTP_EXPIRES_IN_MINUTES} minutes</strong>.
      </p>
      <p style="color: #6b7280; font-size: 14px;">
        If you did not request this code, you can safely ignore this email.
      </p>
    </div>
  `;

  return { subject, text, html };
};

// ─── Send Email OTP ───────────────────────────────────────────────────────────

const sendEmailOtp = async ({ user, code, reason }) => {
  const content = buildOtpEmailContent({
    fullName: user.fullName,
    code,
    reason,
  });

  const result = await sendTransactionalEmail({
    to: user.email,
    ...content,
  });

  return {
    sent: Boolean(result?.sent),
    message: result?.message || (result?.sent ? "OTP sent." : "OTP delivery failed."),
  };
};

// ─── Admin Approved Email Content Builder ─────────────────────────────────────

const buildAdminApprovedEmailContent = ({ adminName, approverName }) => {
  const subject = "Your admin account has been approved";

  const text = [
    `Hi ${adminName || "Admin"},`,
    "",
    `Your admin account has been approved by ${approverName || "Super Admin"}.`,
    "You can now log in to the admin panel.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6; max-width: 480px;">
      <p>Hi ${adminName || "Admin"},</p>
      <p>
        Your admin account has been approved by
        <strong>${approverName || "Super Admin"}</strong>.
      </p>
      <p>You can now <a href="${process.env.ADMIN_LOGIN_URL || "#"}">log in to the admin panel</a>.</p>
    </div>
  `;

  return { subject, text, html };
};

// ─── Registration Success Notifications ───────────────────────────────────────

const sendRegistrationSuccessNotifications = async ({ user, accountLabel }) => {
  const label = accountLabel || "user";
  const isAdmin = label === "admin";

  const subject = `Welcome${isAdmin ? " — your admin request is under review" : ""}! Account created successfully`;

  const adminNote = isAdmin
    ? "\n\nYour account is pending approval by a super admin. You will be notified once approved."
    : "";

  const text = [
    `Hi ${user.fullName || "there"},`,
    "",
    `Your ${label} account has been created successfully.`,
    `Please verify your email and phone number to complete setup.${adminNote}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6; max-width: 480px;">
      <p>Hi ${user.fullName || "there"},</p>
      <p>Your <strong>${label}</strong> account has been created successfully.</p>
      <p>Please verify your email and phone number to complete setup.</p>
      ${isAdmin ? `<p style="color: #6b7280;">Your account is pending approval by a super admin. You will be notified once approved.</p>` : ""}
    </div>
  `;

  const email = await sendTransactionalEmail({
    to: user.email,
    subject,
    text,
    html,
  });

  let whatsapp = {
    sent: false,
    message: "WhatsApp number not available.",
  };

  const toNumber = user.phoneNumber || user.whatsappNumber;

  if (toNumber) {
    whatsapp = await sendWhatsAppText({
      to: toNumber,
      body: text,
    });
  }

  return { email, whatsapp };
};

// ─── Admin Access Request Notifications (to Super Admins) ─────────────────────

const sendAdminAccessRequestNotifications = async ({ adminUser }) => {
  const superAdmins = await User.find({ role: "super_admin" }).select(
    "_id fullName email phoneNumber whatsappNumber",
  );

  if (!superAdmins.length) {
    return {
      recipients: [],
      totalRecipients: 0,
    };
  }

  const subject = "New admin account request pending approval";

  const results = await Promise.all(
    superAdmins.map(async (superAdmin) => {
      const text = [
        `Hi ${superAdmin.fullName || "Super Admin"},`,
        "",
        `A new admin account has been registered and requires your approval.`,
        `Name: ${adminUser.fullName}`,
        `Email: ${adminUser.email}`,
        "",
        "Please log in to the super admin panel to review this request.",
      ].join("\n");

      const html = `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6; max-width: 480px;">
          <p>Hi ${superAdmin.fullName || "Super Admin"},</p>
          <p>A new admin account has been registered and requires your approval.</p>
          <table style="border-collapse: collapse; width: 100%; margin: 8px 0;">
            <tr>
              <td style="padding: 4px 8px; font-weight: bold;">Name</td>
              <td style="padding: 4px 8px;">${adminUser.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px; font-weight: bold;">Email</td>
              <td style="padding: 4px 8px;">${adminUser.email}</td>
            </tr>
          </table>
          <p>Please log in to the super admin panel to review this request.</p>
        </div>
      `;

      const email = await sendTransactionalEmail({
        to: superAdmin.email,
        subject,
        text,
        html,
      });

      let whatsapp = {
        sent: false,
        message: "WhatsApp number not available.",
      };

      const toNumber = superAdmin.phoneNumber || superAdmin.whatsappNumber;

      if (toNumber) {
        whatsapp = await sendWhatsAppText({
          to: toNumber,
          body: text,
        });
      }

      return {
        recipientEmail: superAdmin.email,
        email,
        whatsapp,
      };
    }),
  );

  return {
    recipients: results,
    totalRecipients: results.length,
  };
};

// ─── Phone OTP ────────────────────────────────────────────────────────────────

const sendPhoneOtp = async ({ user, code }) => {
  const body = [
    `Hi ${user.fullName || "there"},`,
    `Your verification code is: ${code}`,
    `It expires in ${OTP_EXPIRES_IN_MINUTES} minutes.`,
  ].join("\n");

  const toNumber = user.phoneNumber || user.whatsappNumber;
  let whatsappResult;

  if (process.env.WHATSAPP_PROVIDER === "meta-cloud") {
    // For Meta Cloud API, we use a template for the first message (OTP)
    // The user must configure WHATSAPP_CLOUD_OTP_TEMPLATE_NAME in .env
    const templateName = process.env.WHATSAPP_CLOUD_OTP_TEMPLATE_NAME || "otp_verification";
    const isHelloWorld = templateName === "hello_world";

    whatsappResult = await sendWhatsAppText({
      to: toNumber,
      template: {
        name: templateName,
        language: { code: "en_US" },
        components: isHelloWorld
          ? []
          : [
              {
                type: "body",
                parameters: [
                  { type: "text", text: user.fullName || "User" },
                  { type: "text", text: code },
                  { type: "text", text: String(OTP_EXPIRES_IN_MINUTES) },
                ],
              },
            ],
      },
    });
  } else {
    whatsappResult = await sendWhatsAppText({
      to: toNumber,
      body,
    });
  }

  if (whatsappResult.sent) {
    return whatsappResult;
  }

  return {
    sent: false,
    message: whatsappResult.message || "WhatsApp delivery failed and no email fallback is configured for phone OTP.",
  };
};

const sendAdminApprovedNotifications = async ({ adminUser, approverName }) => {
  const emailContent = buildAdminApprovedEmailContent({
    adminName: adminUser.fullName,
    approverName,
  });

  const email = await sendTransactionalEmail({
    to: adminUser.email,
    ...emailContent,
  });

  let whatsapp = {
    sent: false,
    message: "WhatsApp number not available.",
  };

  const toNumber = adminUser.phoneNumber || adminUser.whatsappNumber;

  if (toNumber) {
    whatsapp = await sendWhatsAppText({
      to: toNumber,
      body: [
        `Hi ${adminUser.fullName || "Admin"},`,
        `Your admin account has been approved by ${approverName || "Super Admin"}.`,
        "You can now login to the admin panel.",
      ].join("\n"),
    });
  }

  return {
    email,
    whatsapp,
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildFullName = ({ fullName, firstName, lastName }) => {
  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  const parts = [firstName, lastName]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  return parts.join(" ").trim();
};

const buildContactNumber = ({ whatsappNumber, phoneNumber, mobileNumber }) => {
  return [whatsappNumber, phoneNumber, mobileNumber]
    .find((value) => typeof value === "string" && value.trim())
    ?.trim();
};

const getNormalizedEnvValue = (value) => String(value || "").trim();

// ─── Super Admin Env Login ────────────────────────────────────────────────────

const tryEnvSuperAdminLogin = async ({ email, password }) => {
  const envEmail = getNormalizedEnvValue(
    process.env.SUPER_ADMIN_EMAIL,
  ).toLowerCase();
  const envPassword = getNormalizedEnvValue(process.env.SUPER_ADMIN_PASSWORD);
  const normalizedEmail = getNormalizedEnvValue(email).toLowerCase();
  const normalizedPassword = getNormalizedEnvValue(password);

  if (!envEmail || !envPassword) {
    return null;
  }

  if (normalizedEmail !== envEmail || normalizedPassword !== envPassword) {
    return null;
  }

  let user = await User.findOne({ email: envEmail });

  if (!user) {
    const hashedPassword = await bcrypt.hash(envPassword, 10);
    user = await User.create({
      accountType: "super_admin",
      firstName: "Super",
      lastName: "Admin",
      fullName: "Super Admin",
      email: envEmail,
      password: hashedPassword,
      role: "super_admin",
      whatsappNumber: "",
    });
  } else {
    const updates = {};

    if (user.role !== "super_admin") {
      updates.role = "super_admin";
    }

    if (user.accountType !== "super_admin") {
      updates.accountType = "super_admin";
    }

    if (!user.fullName) {
      updates.fullName = "Super Admin";
    }

    if (Object.keys(updates).length > 0) {
      await User.updateOne({ _id: user._id }, { $set: updates });
      user = await User.findById(user._id);
    }
  }

  const token = generateToken({ id: user._id, role: user.role });

  return {
    token,
    user: sanitizeUser(user),
  };
};

// ─── Core Auth Helpers ────────────────────────────────────────────────────────

const authenticateUser = async ({ email, password, allowedRoles = null }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      const error = new Error("You are not allowed to login from this portal.");
      error.statusCode = 403;
      throw error;
    }
  }

  if (user.role === "admin" && user.adminApprovalStatus === "pending") {
    const error = new Error(
      "Your admin account is pending super admin approval. Login is disabled until approval.",
    );
    error.statusCode = 403;
    throw error;
  }

  if (
    ["user", "admin"].includes(user.role) &&
    (!user.isEmailVerified /* || !user.isPhoneVerified */) // Commented out phone requirement
  ) {
    const error = new Error(
      "Please verify your email with OTP before login.", // Removed phone from message
    );
    error.statusCode = 403;
    throw error;
  }

  const token = generateToken({ id: user._id, role: user.role });

  return {
    token,
    user: sanitizeUser(user),
  };
};

const registerUser = async ({
  accountType,
  firstName,
  lastName,
  fullName,
  email,
  password,
  role,
  latestQualification,
  yearOfPassing,
  collegeName,
  location,
  phoneNumber,
  whatsappNumber,
  resumeFileName,
  resumeFilePath,
  organizationName,
  organizationType,
  username,
  agreeToWhatsAppUpdates,
  agreeToTerms,
}) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const error = new Error("Email already in use.");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    accountType: accountType || role || "student",
    firstName: firstName || "",
    lastName: lastName || "",
    fullName,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
    adminApprovalStatus: role === "admin" ? "pending" : "approved",
    adminApprovedBy: null,
    adminApprovedAt: role === "admin" ? null : new Date(),
    latestQualification: latestQualification || "",
    yearOfPassing: yearOfPassing || "",
    collegeName: collegeName || "",
    location: location || "",
    phoneNumber: phoneNumber || "",
    whatsappNumber: whatsappNumber || "",
    resumeFileName: resumeFileName || "",
    resumeFilePath: resumeFilePath || "",
    organizationName: organizationName || "",
    organizationType: organizationType || "",
    username: username || "",
    agreeToWhatsAppUpdates: Boolean(agreeToWhatsAppUpdates),
    agreeToTerms: Boolean(agreeToTerms),
  });

  const token = generateToken({ id: user._id, role: user.role });

  return {
    token,
    user: sanitizeUser(user),
  };
};

// ─── OTP Code Setters ─────────────────────────────────────────────────────────

const setEmailVerificationCode = async (user) => {
  const code = generateOtpCode();
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        emailVerificationCodeHash: hashCode(code),
        emailVerificationCodeExpiresAt: getOtpExpiryDate(),
      },
    },
  );
  return code;
};

const setPhoneVerificationCode = async (user) => {
  const code = generateOtpCode();
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        phoneVerificationCodeHash: hashCode(code),
        phoneVerificationCodeExpiresAt: getOtpExpiryDate(),
      },
    },
  );
  return code;
};

const setPasswordResetCode = async (user) => {
  const code = generateOtpCode();
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        passwordResetCodeHash: hashCode(code),
        passwordResetCodeExpiresAt: getOtpExpiryDate(),
      },
    },
  );
  return code;
};

const validateCode = ({ providedCode, storedHash, expiresAt }) => {
  if (!storedHash || !expiresAt) {
    return false;
  }

  if (expiresAt.getTime() < Date.now()) {
    return false;
  }

  return hashCode(providedCode) === storedHash;
};

const issueInitialVerificationCodes = async (userId) => {
  const user = await User.findById(userId).select(
    "+emailVerificationCodeHash +emailVerificationCodeExpiresAt +phoneVerificationCodeHash +phoneVerificationCodeExpiresAt",
  );

  if (!user) {
    return {
      email: { sent: false, message: "User not found for email verification." },
      phone: { sent: false, message: "User not found for phone verification." },
    };
  }

  const emailCode = await setEmailVerificationCode(user);
  const phoneCode = await setPhoneVerificationCode(user);

  const [emailResult, phoneResult] = await Promise.all([
    sendEmailOtp({ user, code: emailCode, reason: "email_verification" }),
    // sendPhoneOtp({ user, code: phoneCode }), // Commented out phone OTP
    Promise.resolve({ sent: true, message: "Phone OTP bypassed (commented out)" }),
  ]);

  return {
    email: emailResult,
    phone: phoneResult,
  };
};

// ─── Route Handlers ───────────────────────────────────────────────────────────

export const signup = async (req, res, next) => {
  try {
    const {
      accountType,
      fullName,
      firstName,
      lastName,
      email,
      password,
      latestQualification,
      yearOfPassing,
      collegeName,
      location,
      whatsappNumber,
      phoneNumber,
      mobileNumber,
      resumeFileName,
      resumeFilePath,
      agreeToWhatsAppUpdates,
      agreeToTerms,
    } = req.body;
    const resolvedFullName = buildFullName({ fullName, firstName, lastName });
    const resolvedContactNumber = buildContactNumber({
      whatsappNumber,
      phoneNumber,
      mobileNumber,
    });

    if (!resolvedFullName || !email || !password) {
      res
        .status(400)
        .json({ message: "fullName, email and password are required." });
      return;
    }

    if (!resolvedContactNumber) {
      res
        .status(400)
        .json({ message: "whatsappNumber is required for user signup." });
      return;
    }

    if (!isStrongPassword(password)) {
      res.status(400).json({ message: PASSWORD_RULE_MESSAGE });
      return;
    }

    const resolvedResumeFileName = req.file
      ? req.file.originalname
      : String(req.body.resumeFileName || "").trim();

    const resolvedResumeFilePath = req.file
      ? `/uploads/resumes/${req.file.filename}`
      : String(req.body.resumeFilePath || "").trim();

    const result = await registerUser({
      accountType: accountType || "student",
      firstName,
      lastName,
      fullName: resolvedFullName,
      email,
      password,
      role: "user",
      latestQualification,
      yearOfPassing,
      collegeName,
      location,
      phoneNumber: mobileNumber || phoneNumber || "",
      whatsappNumber: resolvedContactNumber,
      resumeFileName: resolvedResumeFileName,
      resumeFilePath: resolvedResumeFilePath,
      agreeToWhatsAppUpdates,
      agreeToTerms,
    });

    const verificationDispatch = await issueInitialVerificationCodes(
      result.user.id,
    );

    res.status(201).json({
      ...result,
      verificationDispatch,
      message:
        "Account created. Please verify your email and phone number to secure your account.",
    });
  } catch (error) {
    next(error);
  }
};

export const userSignup = signup;

export const adminSignup = async (req, res, next) => {
  try {
    const {
      accountType,
      fullName,
      firstName,
      lastName,
      email,
      password,
      organizationName,
      organizationType,
      username,
      whatsappNumber,
      phoneNumber,
      mobileNumber,
      agreeToWhatsAppUpdates,
      agreeToTerms,
    } = req.body;
    const resolvedFullName = buildFullName({ fullName, firstName, lastName });
    const resolvedContactNumber = buildContactNumber({
      whatsappNumber,
      phoneNumber,
      mobileNumber,
    });

    if (!resolvedFullName || !email || !password) {
      res
        .status(400)
        .json({ message: "fullName, email and password are required." });
      return;
    }

    if (!resolvedContactNumber) {
      res
        .status(400)
        .json({ message: "whatsappNumber is required for admin signup." });
      return;
    }

    if (!isStrongPassword(password)) {
      res.status(400).json({ message: PASSWORD_RULE_MESSAGE });
      return;
    }

    const result = await registerUser({
      accountType: accountType || "employer",
      firstName,
      lastName,
      fullName: resolvedFullName,
      email,
      password,
      role: "admin",
      organizationName,
      organizationType,
      username,
      phoneNumber: mobileNumber || phoneNumber || "",
      whatsappNumber: resolvedContactNumber,
      agreeToWhatsAppUpdates,
      agreeToTerms,
    });

    const verificationDispatch = await issueInitialVerificationCodes(
      result.user.id,
    );

    let accessRequestNotificationDispatch = {
      recipients: [],
      totalRecipients: 0,
    };

    try {
      accessRequestNotificationDispatch =
        await sendAdminAccessRequestNotifications({
          adminUser: result.user,
        });
    } catch (notificationError) {
      accessRequestNotificationDispatch = {
        recipients: [
          {
            recipientEmail: "",
            email: {
              sent: false,
              message:
                notificationError?.message ||
                "Failed to notify super admin about admin request.",
            },
            whatsapp: {
              sent: false,
              message:
                notificationError?.message ||
                "Failed to notify super admin on WhatsApp.",
            },
          },
        ],
        totalRecipients: 0,
      };
    }

    res.status(201).json({
      ...result,
      token: "",
      verificationDispatch,
      accessRequestNotificationDispatch,
      message:
        "Admin account created and sent for super admin approval. Please verify your email and phone number. Login will be enabled after approval.",
    });
  } catch (error) {
    next(error);
  }
};

export const superAdminSignup = async (req, res, next) => {
  try {
    const {
      accountType,
      fullName,
      firstName,
      lastName,
      email,
      password,
      superAdminSecret,
      organizationName,
      organizationType,
      username,
      whatsappNumber,
      phoneNumber,
      mobileNumber,
      agreeToWhatsAppUpdates,
      agreeToTerms,
    } = req.body;
    const resolvedFullName = buildFullName({ fullName, firstName, lastName });
    const resolvedContactNumber = buildContactNumber({
      whatsappNumber,
      phoneNumber,
      mobileNumber,
    });

    if (!resolvedFullName || !email || !password) {
      res
        .status(400)
        .json({ message: "fullName, email and password are required." });
      return;
    }

    if (!resolvedContactNumber) {
      res.status(400).json({
        message: "whatsappNumber is required for super admin signup.",
      });
      return;
    }

    if (!process.env.SUPER_ADMIN_SIGNUP_SECRET) {
      res
        .status(500)
        .json({ message: "SUPER_ADMIN_SIGNUP_SECRET not configured." });
      return;
    }

    if (superAdminSecret !== process.env.SUPER_ADMIN_SIGNUP_SECRET) {
      res.status(403).json({ message: "Invalid super admin signup secret." });
      return;
    }

    if (!isStrongPassword(password)) {
      res.status(400).json({ message: PASSWORD_RULE_MESSAGE });
      return;
    }

    const result = await registerUser({
      accountType: accountType || "super_admin",
      firstName,
      lastName,
      fullName: resolvedFullName,
      email,
      password,
      role: "super_admin",
      organizationName,
      organizationType,
      username,
      phoneNumber: mobileNumber || phoneNumber || "",
      whatsappNumber: resolvedContactNumber,
      agreeToWhatsAppUpdates,
      agreeToTerms,
    });

    const verificationDispatch = await issueInitialVerificationCodes(
      result.user.id,
    );

    res.status(201).json({
      ...result,
      verificationDispatch,
      message:
        "Account created. Please verify your email and phone number to secure your account.",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email and password are required." });
      return;
    }

    const envSuperAdminLogin = await tryEnvSuperAdminLogin({
      email,
      password,
    });

    if (envSuperAdminLogin) {
      res.status(200).json(envSuperAdminLogin);
      return;
    }

    const result = await authenticateUser({ email, password });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email and password are required." });
      return;
    }

    const result = await authenticateUser({
      email,
      password,
      allowedRoles: ["user"],
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email and password are required." });
      return;
    }

    const result = await authenticateUser({
      email,
      password,
      allowedRoles: ["admin", "super_admin"],
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const requestEmailVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "email is required." });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+emailVerificationCodeHash +emailVerificationCodeExpiresAt",
    );

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (user.isEmailVerified) {
      res.status(200).json({ message: "Email is already verified." });
      return;
    }

    const code = await setEmailVerificationCode(user);
    const delivery = await sendEmailOtp({
      user,
      code,
      reason: "email_verification",
    });

    res.status(200).json({
      message: delivery.sent
        ? "Verification code sent to email."
        : "Verification code generated but email delivery failed.",
      delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: "email and code are required." });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+emailVerificationCodeHash +emailVerificationCodeExpiresAt",
    );

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const valid = validateCode({
      providedCode: code,
      storedHash: user.emailVerificationCodeHash,
      expiresAt: user.emailVerificationCodeExpiresAt,
    });

    if (!valid) {
      res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
      return;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          isEmailVerified: true,
          emailVerificationCodeHash: "",
          emailVerificationCodeExpiresAt: null,
        },
      },
      { returnDocument: "after" },
    );

    let registrationNotificationDispatch = null;
    if (updatedUser.isEmailVerified /* && updatedUser.isPhoneVerified */) { // Commented out phone check
      try {
        registrationNotificationDispatch =
          await sendRegistrationSuccessNotifications({
            user: updatedUser,
            accountLabel: updatedUser.role === "admin" ? "admin" : "student",
          });
      } catch (e) {
        console.error("Failed to send welcome notification after email verification:", e);
      }
    }

    res.status(200).json({
      message: "Email verified successfully.",
      registrationNotificationDispatch,
      user: {
        ...sanitizeUser(updatedUser),
        isEmailVerified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const requestPhoneVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "email is required." });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+phoneVerificationCodeHash +phoneVerificationCodeExpiresAt",
    );

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (user.isPhoneVerified) {
      res.status(200).json({ message: "Phone number is already verified." });
      return;
    }

    const code = await setPhoneVerificationCode(user);
    const delivery = await sendPhoneOtp({ user, code });

    res.status(200).json({
      message: delivery.sent
        ? "Verification code sent to phone."
        : "Verification code generated but phone delivery failed.",
      delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPhoneCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: "email and code are required." });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+phoneVerificationCodeHash +phoneVerificationCodeExpiresAt",
    );

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const valid = validateCode({
      providedCode: code,
      storedHash: user.phoneVerificationCodeHash,
      expiresAt: user.phoneVerificationCodeExpiresAt,
    });

    if (!valid) {
      res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
      return;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          isPhoneVerified: true,
          phoneVerificationCodeHash: "",
          phoneVerificationCodeExpiresAt: null,
        },
      },
      { returnDocument: "after" },
    );

    let registrationNotificationDispatch = null;
    if (updatedUser.isEmailVerified && updatedUser.isPhoneVerified) {
      try {
        registrationNotificationDispatch =
          await sendRegistrationSuccessNotifications({
            user: updatedUser,
            accountLabel: updatedUser.role === "admin" ? "admin" : "student",
          });
      } catch (e) {
        console.error("Failed to send welcome notification after phone verification:", e);
      }
    }

    res.status(200).json({
      message: "Phone verified successfully.",
      registrationNotificationDispatch,
      user: {
        ...sanitizeUser(updatedUser),
        isPhoneVerified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "email is required." });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordResetCodeHash +passwordResetCodeExpiresAt",
    );

    if (!user) {
      res.status(200).json({
        message:
          "If an account exists for this email, a password reset code has been sent.",
      });
      return;
    }

    const code = await setPasswordResetCode(user);
    const delivery = await sendEmailOtp({
      user,
      code,
      reason: "password_reset",
    });

    res.status(200).json({
      message:
        "If an account exists for this email, a password reset code has been sent.",
      delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      res
        .status(400)
        .json({ message: "email, code and newPassword are required." });
      return;
    }

    if (!isStrongPassword(newPassword)) {
      res.status(400).json({ message: PASSWORD_RULE_MESSAGE });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordResetCodeHash +passwordResetCodeExpiresAt",
    );

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const valid = validateCode({
      providedCode: code,
      storedHash: user.passwordResetCodeHash,
      expiresAt: user.passwordResetCodeExpiresAt,
    });

    if (!valid) {
      res.status(400).json({ message: "Invalid or expired reset code." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          passwordResetCodeHash: "",
          passwordResetCodeExpiresAt: null,
        },
      },
    );

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const hasField = (name) =>
      Object.prototype.hasOwnProperty.call(req.body || {}, name);

    if (hasField("firstName")) {
      user.firstName = String(req.body.firstName || "").trim();
    }

    if (hasField("lastName")) {
      user.lastName = String(req.body.lastName || "").trim();
    }

    if (hasField("fullName")) {
      user.fullName = String(req.body.fullName || "").trim();
    } else {
      const recomputedFullName = buildFullName({
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      if (recomputedFullName) {
        user.fullName = recomputedFullName;
      }
    }

    if (!String(user.fullName || "").trim()) {
      res.status(400).json({ message: "fullName cannot be empty." });
      return;
    }

    if (hasField("whatsappNumber")) {
      user.whatsappNumber = String(req.body.whatsappNumber || "").trim();
    }

    if (hasField("phoneNumber")) {
      user.phoneNumber = String(req.body.phoneNumber || "").trim();
    }

    if (hasField("location")) {
      user.location = String(req.body.location || "").trim();
    }

    if (hasField("latestQualification")) {
      user.latestQualification = String(
        req.body.latestQualification || "",
      ).trim();
    }

    if (hasField("yearOfPassing")) {
      user.yearOfPassing = String(req.body.yearOfPassing || "").trim();
    }

    if (hasField("collegeName")) {
      user.collegeName = String(req.body.collegeName || "").trim();
    }

    if (hasField("resumeFileName")) {
      user.resumeFileName = String(req.body.resumeFileName || "").trim();
    }

    if (hasField("resumeFilePath")) {
      user.resumeFilePath = String(req.body.resumeFilePath || "").trim();
    }

    if (hasField("agreeToWhatsAppUpdates")) {
      user.agreeToWhatsAppUpdates = Boolean(req.body.agreeToWhatsAppUpdates);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const getWhatsAppStatus = async (req, res) => {
  res.status(200).json(getWhatsAppRuntimeStatus());
};

export const getUserDirectory = async (req, res, next) => {
  try {
    const users = await User.find({
      $or: [
        { role: "super_admin" },
        { isEmailVerified: true /*, isPhoneVerified: true */ }, // Commented out phone requirement for directory
      ],
    })
      .select(
        "_id fullName email role whatsappNumber phoneNumber createdAt adminApprovalStatus adminApprovedAt isEmailVerified isPhoneVerified latestQualification resumeFilePath resumeFileName",
      )
      .sort({ createdAt: -1 });

    const toPublicShape = (item) => ({
      id: item._id,
      fullName: item.fullName,
      email: item.email,
      role: item.role,
      whatsappNumber: item.whatsappNumber || "",
      phoneNumber: item.phoneNumber || "",
      adminApprovalStatus:
        item.role === "admin" ? item.adminApprovalStatus || "approved" : null,
      adminApprovedAt: item.adminApprovedAt || null,
      isEmailVerified: Boolean(item.isEmailVerified),
      isPhoneVerified: true, // Commented out requirement: was Boolean(item.isPhoneVerified)
      createdAt: item.createdAt,
      latestQualification: item.latestQualification || "",
      resumeFilePath: item.resumeFilePath || "",
      resumeFileName: item.resumeFileName || "",
    });

    const admins = users
      .filter((item) => item.role === "admin")
      .map(toPublicShape);
    const normalUsers = users
      .filter((item) => item.role === "user")
      .map(toPublicShape);
    const superAdmins = users
      .filter((item) => item.role === "super_admin")
      .map(toPublicShape);

    res.status(200).json({
      admins,
      users: normalUsers,
      superAdmins,
      counts: {
        admins: admins.length,
        users: normalUsers.length,
        superAdmins: superAdmins.length,
        total: users.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserAccount = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "User id is required." });
      return;
    }

    if (String(req.user?._id) === String(id)) {
      res.status(400).json({ message: "You cannot delete your own account." });
      return;
    }

    const user = await User.findById(id).select("_id role fullName email");

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (user.role === "super_admin") {
      res
        .status(403)
        .json({ message: "Super admin accounts cannot be deleted." });
      return;
    }

    await User.deleteOne({ _id: id });

    res.status(200).json({
      message: "Account deleted successfully.",
      deleted: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changeAdminPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword, notifyAdmin } = req.body;

    if (!id) {
      res.status(400).json({ message: "Admin id is required." });
      return;
    }

    if (!newPassword) {
      res.status(400).json({ message: "newPassword is required." });
      return;
    }

    if (!isStrongPassword(newPassword)) {
      res.status(400).json({ message: PASSWORD_RULE_MESSAGE });
      return;
    }

    const adminUser = await User.findById(id).select("_id role fullName email");

    if (!adminUser) {
      res.status(404).json({ message: "Admin account not found." });
      return;
    }

    if (adminUser.role !== "admin") {
      res.status(400).json({
        message: "Password can only be changed for admin accounts.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id: adminUser._id },
      {
        $set: {
          password: hashedPassword,
          passwordResetCodeHash: "",
          passwordResetCodeExpiresAt: null,
        },
      },
    );

    const shouldNotifyAdmin = Boolean(notifyAdmin);
    let notification = {
      requested: shouldNotifyAdmin,
      sent: false,
      message: "Admin email notification was not requested.",
    };

    if (shouldNotifyAdmin) {
      const changedByName = req.user?.fullName || "Super Admin";
      const emailContent = buildAdminPasswordChangedEmail({
        adminName: adminUser.fullName,
        changedByName,
      });

      const emailResult = await sendTransactionalEmail({
        to: adminUser.email,
        ...emailContent,
      });

      notification = {
        requested: true,
        sent: Boolean(emailResult?.sent),
        message:
          emailResult?.message ||
          "Admin notification email status is unavailable.",
      };
    }

    const responseMessage = shouldNotifyAdmin
      ? notification.sent
        ? "Admin password changed and notification email sent."
        : `Admin password changed, but email notification failed: ${notification.message}`
      : "Admin password changed successfully.";

    res.status(200).json({
      message: responseMessage,
      admin: {
        id: adminUser._id,
        fullName: adminUser.fullName,
        email: adminUser.email,
      },
      notification,
    });
  } catch (error) {
    next(error);
  }
};

export const impersonateAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      res.status(400).json({ message: "adminId is required." });
      return;
    }

    const adminUser = await User.findById(adminId).select(
      "_id fullName email role adminApprovalStatus",
    );

    if (!adminUser) {
      res.status(404).json({ message: "Admin user not found." });
      return;
    }

    if (adminUser.role !== "admin") {
      res.status(400).json({
        message: "Only admin accounts can be opened from this action.",
      });
      return;
    }

    if (adminUser.adminApprovalStatus === "pending") {
      res.status(403).json({
        message: "Selected admin is pending approval and cannot be opened yet.",
      });
      return;
    }

    const token = generateToken({ id: adminUser._id, role: adminUser.role });

    res.status(200).json({
      token,
      user: sanitizeUser(adminUser),
    });
  } catch (error) {
    next(error);
  }
};

export const approveAdminAccess = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Admin id is required." });
      return;
    }

    const adminUser = await User.findById(id).select(
      "_id fullName email role phoneNumber whatsappNumber adminApprovalStatus isEmailVerified isPhoneVerified",
    );

    if (!adminUser) {
      res.status(404).json({ message: "Admin account not found." });
      return;
    }

    if (adminUser.role !== "admin") {
      res.status(400).json({
        message: "Access approval can only be performed for admin accounts.",
      });
      return;
    }

    if (!adminUser.isEmailVerified || !adminUser.isPhoneVerified) {
      res.status(400).json({
        message:
          "Admin must verify both email and phone number before approval.",
      });
      return;
    }

    if (adminUser.adminApprovalStatus !== "approved") {
      adminUser.adminApprovalStatus = "approved";
      adminUser.adminApprovedBy = req.user?._id || null;
      adminUser.adminApprovedAt = new Date();
      await adminUser.save();
    }

    let approvalNotification = {
      email: { sent: false, message: "Approval email not sent." },
      whatsapp: { sent: false, message: "Approval WhatsApp message not sent." },
    };

    try {
      approvalNotification = await sendAdminApprovedNotifications({
        adminUser,
        approverName: req.user?.fullName || "Super Admin",
      });
    } catch (notificationError) {
      approvalNotification = {
        email: {
          sent: false,
          message:
            notificationError?.message || "Failed to send approval email.",
        },
        whatsapp: {
          sent: false,
          message:
            notificationError?.message ||
            "Failed to send approval WhatsApp message.",
        },
      };
    }

    res.status(200).json({
      message: "Admin access approved successfully.",
      admin: sanitizeUser(adminUser),
      approvalNotification,
    });
  } catch (error) {
    next(error);
  }
};