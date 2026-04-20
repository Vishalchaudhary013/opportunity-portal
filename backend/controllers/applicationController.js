import Application from "../models/applicationModel.js";
import InternshipOpportunity from "../models/internshipOpportunityModel.js";
import GlobalProgramOpportunity from "../models/globalProgramOpportunityModel.js";
import User from "../models/userModel.js";
import {
  sendAdminApplicationAlertEmail,
  sendApplicationConfirmationEmail,
} from "../utils/mailer.js";
import { sendApplicationWhatsAppNotifications } from "../utils/whatsapp.js";
import xlsx from "xlsx";

const findOpportunityByTypeAndId = async (opportunityType, opportunityId) => {
  if (!opportunityId) {
    return null;
  }

  if (opportunityType === "Internship") {
    return InternshipOpportunity.findById(opportunityId)
      .select("_id title company type createdBy")
      .populate("createdBy", "_id fullName email role whatsappNumber");
  }

  if (opportunityType === "Global Program") {
    return GlobalProgramOpportunity.findById(opportunityId)
      .select("_id title company type createdBy")
      .populate("createdBy", "_id fullName email role whatsappNumber");
  }

  return null;
};

const pickApplicationPayload = (body) => ({
  opportunityTitle: body.opportunityTitle,
  opportunityType: body.opportunityType,
  company: body.company,
  name: body.name,
  email: body.email,
  phone: body.phone,
  college: body.college,
  degree: body.degree,
  year: body.year,
  skills: body.skills,
  experience: body.experience,
  portfolio: body.portfolio,
  linkedin: body.linkedin,
  whySelectYou: body.whySelectYou,
});

const getOwnedOpportunityIdsForAdmin = async (adminId) => {
  const [internships, globalPrograms] = await Promise.all([
    InternshipOpportunity.find({ createdBy: adminId }).select("_id"),
    GlobalProgramOpportunity.find({ createdBy: adminId }).select("_id"),
  ]);

  return [...internships, ...globalPrograms].map((item) => item._id);
};

const getApplicationOwnershipFilter = async (req) => {
  if (req.user?.role === "super_admin") {
    return {};
  }

  const opportunityIds = await getOwnedOpportunityIdsForAdmin(req.user._id);
  return {
    opportunity: { $in: opportunityIds },
  };
};

const resolveAdminRecipient = async (opportunityDoc) => {
  const owner = opportunityDoc?.createdBy;
  if (!owner) {
    return null;
  }

  // If populate returned full user details, use them directly.
  if (typeof owner === "object" && owner.email) {
    return owner;
  }

  const ownerId =
    typeof owner === "string" ? owner : owner?._id || owner?.id || null;
  if (!ownerId) {
    return null;
  }

  return User.findById(ownerId)
    .select("_id fullName email role whatsappNumber")
    .lean();
};

export const submitApplication = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Resume PDF is required." });
      return;
    }

    const payload = pickApplicationPayload(req.body);

    if (!payload.opportunityTitle || !payload.opportunityType) {
      res.status(400).json({ message: "Opportunity details are required." });
      return;
    }

    let opportunityId = null;
    let opportunityDoc = null;
    let applicantAccount = null;
    if (req.body.opportunityId) {
      const opportunity = await findOpportunityByTypeAndId(
        payload.opportunityType,
        req.body.opportunityId,
      );
      if (opportunity) {
        opportunityId = opportunity._id;
        opportunityDoc = opportunity;
      }
    }

    if (payload.email) {
      applicantAccount = await User.findOne({ email: payload.email })
        .select("_id whatsappNumber")
        .lean();
    }

    const adminRecipient = await resolveAdminRecipient(opportunityDoc);

    const application = await Application.create({
      ...payload,
      opportunity: opportunityId,
      resume: {
        fileName: req.file.originalname,
        filePath: `/uploads/resumes/${req.file.filename}`,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });

    let emailConfirmation = {
      sent: false,
      message:
        "Confirmation email was skipped because SMTP settings are not configured.",
    };

    try {
      emailConfirmation = await sendApplicationConfirmationEmail(application);
    } catch (emailError) {
      console.error("Application confirmation email failed:", emailError);
      emailConfirmation = {
        sent: false,
        message:
          "Application was submitted, but the confirmation email could not be sent.",
      };
    }

    const whatsappNotification = await sendApplicationWhatsAppNotifications({
      application,
      applicantRecipient: applicantAccount?.whatsappNumber || payload.phone,
      adminRecipient,
    });

    const adminEmailNotification = await sendAdminApplicationAlertEmail({
      application,
      adminRecipient,
    });

    res.status(201).json({
      application,
      emailConfirmation,
      whatsappNotification,
      adminEmailNotification,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const filter = {
      ...(await getApplicationOwnershipFilter(req)),
    };

    if (req.query.opportunityType) {
      filter.opportunityType = req.query.opportunityType;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const applications = await Application.find(filter).sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["New", "Shortlisted", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid application status." });
      return;
    }

    const ownershipFilter = await getApplicationOwnershipFilter(req);
    const application = await Application.findOneAndUpdate(
      {
        _id: req.params.id,
        ...ownershipFilter,
      },
      { status },
      { new: true, runValidators: true },
    );

    if (!application) {
      res.status(404).json({ message: "Application not found." });
      return;
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

export const exportApplications = async (req, res, next) => {
  try {
    const format = String(req.query.format || "csv").toLowerCase();
    if (format !== "csv" && format !== "xlsx") {
      res.status(400).json({ message: "Invalid format. Use csv or xlsx." });
      return;
    }

    const filter = {
      ...(await getApplicationOwnershipFilter(req)),
    };

    if (req.query.opportunityType) {
      filter.opportunityType = req.query.opportunityType;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const applications = await Application.find(filter).sort({ createdAt: -1 });

    const rows = applications.map((item) => ({
      name: item.name,
      email: item.email,
      phone: item.phone,
      college: item.college,
      degree: item.degree,
      year: item.year,
      skills: item.skills,
      experience: item.experience,
      portfolio: item.portfolio || "",
      linkedin: item.linkedin || "",
      whySelectYou: item.whySelectYou,
      opportunityTitle: item.opportunityTitle,
      opportunityType: item.opportunityType,
      company: item.company || "",
      resumeFileName: item.resume?.fileName || "",
      resumePath: item.resume?.filePath || "",
      status: item.status,
      appliedAt: item.createdAt ? new Date(item.createdAt).toISOString() : "",
    }));

    const worksheet = xlsx.utils.json_to_sheet(rows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Applications");

    if (format === "xlsx") {
      const fileBuffer = xlsx.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="applications.xlsx"',
      );
      res.status(200).send(fileBuffer);
      return;
    }

    const fileBuffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: "csv",
    });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="applications.csv"',
    );
    res.status(200).send(fileBuffer);
  } catch (error) {
    next(error);
  }
};
