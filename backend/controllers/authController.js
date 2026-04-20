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

const buildOtpEmailContent = ({ fullName, code, reason }) => {
  const actionText =
    reason === "password_reset" ? "reset your password" : "verify your email";

  const subject =
    reason === "password_reset"
      ? "Password reset code"
      : "Verify your email address";

  const text = [
    `Hi ${fullName || "there"},`,
    "",
    `Use this one-time code to ${actionText}: ${code}`,
    "",
    `The code expires in ${OTP_EXPIRES_IN_MINUTES} minutes.`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <p>Hi ${fullName || "there"},</p>
      <p>Use this one-time code to ${actionText}:</p>
      <p style="font-size: 24px; font-weight: 700; letter-spacing: 2px;">${code}</p>
      <p>This code expires in ${OTP_EXPIRES_IN_MINUTES} minutes.</p>
    </div>
  `;

  return {
    subject,
    text,
    html,
  };
};

const buildRegistrationSuccessEmailContent = ({ fullName, accountLabel }) => {
  const subject = "Registration successful";
  const text = [
    `Hi ${fullName || "there"},`,
    "",
    `Your ${accountLabel} account was created successfully on EDECO.`,
    "You can now continue with email and phone verification to activate login access.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <p>Hi ${fullName || "there"},</p>
      <p>Your <strong>${accountLabel}</strong> account was created successfully on EDECO.</p>
      <p>You can now continue with email and phone verification to activate login access.</p>
    </div>
  `;

  return {
    subject,
    text,
    html,
  };
};

const buildAdminAccessRequestEmailContent = ({ adminName, adminEmail }) => {
  const subject = "New admin access request";
  const text = [
    "A new admin account is waiting for approval.",
    "",
    `Name: ${adminName || "N/A"}`,
    `Email: ${adminEmail || "N/A"}`,
    "",
    "Please review and approve from the super admin dashboard.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <p>A new admin account is waiting for approval.</p>
      <p><strong>Name:</strong> ${adminName || "N/A"}</p>
      <p><strong>Email:</strong> ${adminEmail || "N/A"}</p>
      <p>Please review and approve from the super admin dashboard.</p>
    </div>
  `;

  return { subject, text, html };
};

const buildAdminApprovedEmailContent = ({ adminName, approverName }) => {
  const subject = "Admin access approved";
  const text = [
    `Hi ${adminName || "Admin"},`,
    "",
    `Your admin account has been approved by ${approverName || "Super Admin"}.`,
    "You can now login to the admin panel.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <p>Hi ${adminName || "Admin"},</p>
      <p>
        Your admin account has been approved by
        <strong>${approverName || "Super Admin"}</strong>.
      </p>
      <p>You can now login to the admin panel.</p>
    </div>
  `;

  return { subject, text, html };
};

const sendEmailOtp = async ({ user, code, reason }) => {
  const emailContent = buildOtpEmailContent({
    fullName: user.fullName,
    code,
    reason,
  });

  const result = await sendTransactionalEmail({
    to: user.email,
    ...emailContent,
  });

  return result;
};

const sendPhoneOtp = async ({ user, code }) => {
  const body = [
    `Hi ${user.fullName || "there"},`,
    `Your verification code is: ${code}`,
    `It expires in ${OTP_EXPIRES_IN_MINUTES} minutes.`,
  ].join("\n");

  const whatsappResult = await sendWhatsAppText({
    to: user.phoneNumber || user.whatsappNumber,
    body,
  });

  if (whatsappResult.sent) {
    return whatsappResult;
  }

  const emailFallback = await sendTransactionalEmail({
    to: user.email,
    subject: "Phone verification code",
    text: body,
    html: `<div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;"><p>${body
      .split("\n")
      .join("<br />")}</p></div>`,
  });

  return {
    sent: emailFallback.sent,
    message: emailFallback.sent
      ? "Phone verification code was sent to your email because phone delivery is unavailable."
      : whatsappResult.message || emailFallback.message,
  };
};

const sendRegistrationSuccessNotifications = async ({ user, accountLabel }) => {
  const emailContent = buildRegistrationSuccessEmailContent({
    fullName: user.fullName,
    accountLabel,
  });

  const email = await sendTransactionalEmail({
    to: user.email,
    ...emailContent,
  });

  const whatsappBody = [
    `Hi ${user.fullName || "there"},`,
    `Your ${accountLabel} account registration is successful on EDECO.`,
    "Please complete your email and phone OTP verification to activate your login.",
  ].join("\n");

  let whatsapp = {
    sent: false,
    message: "WhatsApp number not available.",
  };

  const toNumber = user.phoneNumber || user.whatsappNumber;

  if (toNumber) {
    whatsapp = await sendWhatsAppText({
      to: toNumber,
      body: whatsappBody,
    });
  }

  return {
    email,
    whatsapp,
  };
};

const sendAdminAccessRequestNotifications = async ({ adminUser }) => {
  const superAdmins = await User.find({ role: "super_admin" }).select(
    "_id fullName email phoneNumber whatsappNumber",
  );

  const emailContent = buildAdminAccessRequestEmailContent({
    adminName: adminUser.fullName,
    adminEmail: adminUser.email,
  });

  const notificationTargets = superAdmins.length
    ? superAdmins.map((item) => ({
        fullName: item.fullName,
        email: item.email,
        phoneNumber: item.phoneNumber || item.whatsappNumber || "",
      }))
    : [
        {
          fullName: "Super Admin",
          email: process.env.SUPER_ADMIN_EMAIL || "",
          phoneNumber: "",
        },
      ];

  const deliveries = await Promise.all(
    notificationTargets
      .filter((target) => target.email)
      .map(async (target) => {
        const email = await sendTransactionalEmail({
          to: target.email,
          ...emailContent,
        });

        let whatsapp = {
          sent: false,
          message: "WhatsApp number not available.",
        };

        if (target.phoneNumber) {
          whatsapp = await sendWhatsAppText({
            to: target.phoneNumber,
            body: [
              "New admin access request pending approval.",
              `Name: ${adminUser.fullName || "N/A"}`,
              `Email: ${adminUser.email || "N/A"}`,
              "Open super admin dashboard to approve.",
            ].join("\n"),
          });
        }

        return {
          recipientEmail: target.email,
          email,
          whatsapp,
        };
      }),
  );

  return {
    recipients: deliveries,
    totalRecipients: deliveries.length,
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
    (!user.isEmailVerified || !user.isPhoneVerified)
  ) {
    const error = new Error(
      "Please verify your email and phone number with OTP before login.",
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
    sendPhoneOtp({ user, code: phoneCode }),
  ]);

  return {
    email: emailResult,
    phone: phoneResult,
  };
};

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
      resumeFileName,
      resumeFilePath,
      agreeToWhatsAppUpdates,
      agreeToTerms,
    });

    const verificationDispatch = await issueInitialVerificationCodes(
      result.user.id,
    );

    let registrationNotificationDispatch = {
      email: { sent: false, message: "Registration email not sent." },
      whatsapp: {
        sent: false,
        message: "Registration WhatsApp message not sent.",
      },
    };

    try {
      registrationNotificationDispatch =
        await sendRegistrationSuccessNotifications({
          user: result.user,
          accountLabel: "student",
        });
    } catch (notificationError) {
      registrationNotificationDispatch = {
        email: {
          sent: false,
          message:
            notificationError?.message || "Registration email dispatch failed.",
        },
        whatsapp: {
          sent: false,
          message:
            notificationError?.message ||
            "Registration WhatsApp dispatch failed.",
        },
      };
    }

    res.status(201).json({
      ...result,
      verificationDispatch,
      registrationNotificationDispatch,
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

    let registrationNotificationDispatch = {
      email: { sent: false, message: "Registration email not sent." },
      whatsapp: {
        sent: false,
        message: "Registration WhatsApp message not sent.",
      },
    };

    try {
      registrationNotificationDispatch =
        await sendRegistrationSuccessNotifications({
          user: result.user,
          accountLabel: "admin",
        });
    } catch (notificationError) {
      registrationNotificationDispatch = {
        email: {
          sent: false,
          message:
            notificationError?.message || "Registration email dispatch failed.",
        },
        whatsapp: {
          sent: false,
          message:
            notificationError?.message ||
            "Registration WhatsApp dispatch failed.",
        },
      };
    }

    res.status(201).json({
      ...result,
      token: "",
      verificationDispatch,
      registrationNotificationDispatch,
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

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          isEmailVerified: true,
          emailVerificationCodeHash: "",
          emailVerificationCodeExpiresAt: null,
        },
      },
    );

    res.status(200).json({
      message: "Email verified successfully.",
      user: {
        ...sanitizeUser(user),
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

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          isPhoneVerified: true,
          phoneVerificationCodeHash: "",
          phoneVerificationCodeExpiresAt: null,
        },
      },
    );

    res.status(200).json({
      message: "Phone verified successfully.",
      user: {
        ...sanitizeUser(user),
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
    const users = await User.find({})
      .select(
        "_id fullName email role whatsappNumber phoneNumber createdAt adminApprovalStatus adminApprovedAt isEmailVerified isPhoneVerified",
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
      isPhoneVerified: Boolean(item.isPhoneVerified),
      createdAt: item.createdAt,
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
