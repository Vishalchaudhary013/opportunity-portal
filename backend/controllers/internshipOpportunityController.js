import InternshipOpportunity from "../models/internshipOpportunityModel.js";
import xlsx from "xlsx";

const OPPORTUNITY_TYPE = "Internship";

const getOwnerFilter = (req) => {
  if (req.user?.role === "super_admin") {
    return {};
  }

  return { createdBy: req.user?._id };
};

const parseSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((skill) => skill.trim()).filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};

const parseTextList = (value) => {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
};

const asOptionalString = (value) => String(value || "").trim();

const parseTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeWorkMode = (workMode, location) => {
  const normalized = String(workMode || "")
    .trim()
    .toLowerCase();

  if (normalized === "remote") {
    return "Remote";
  }

  if (normalized === "hybrid") {
    return "Hybrid";
  }

  if (normalized === "in office" || normalized === "office") {
    return "In Office";
  }

  const normalizedLocation = String(location || "").toLowerCase();

  if (normalizedLocation.includes("remote")) {
    return "Remote";
  }

  if (normalizedLocation.includes("hybrid")) {
    return "Hybrid";
  }

  return "In Office";
};

const normalizeStipendDetails = (details = {}) => {
  const parsedDetails =
    typeof details === "string"
      ? (() => {
          try {
            return JSON.parse(details);
          } catch {
            return {};
          }
        })()
      : details;

  const parseAmount = (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };

  const min = parseAmount(parsedDetails?.min);
  const max = parseAmount(parsedDetails?.max);

  return {
    min,
    max,
    currency: String(parsedDetails?.currency || "INR").trim() || "INR",
    period: String(parsedDetails?.period || "per month").trim() || "per month",
  };
};

const parseOptionalDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const resolveCurrencySymbol = (currency) => {
  const normalized = String(currency || "")
    .trim()
    .toUpperCase();

  if (normalized === "INR" || normalized === "RS") {
    return "₹";
  }

  if (normalized === "USD") {
    return "$";
  }

  if (normalized === "EUR") {
    return "€";
  }

  if (normalized === "GBP") {
    return "£";
  }

  return normalized ? `${normalized} ` : "₹";
};

const buildStipendLabel = (stipend, stipendDetails) => {
  const stipendText = String(stipend || "").trim();

  if (stipendText) {
    return stipendText;
  }

  const { min, max, currency, period } = stipendDetails;
  const symbol = resolveCurrencySymbol(currency);

  if (Number.isFinite(min) && Number.isFinite(max)) {
    return `${symbol}${min} - ${symbol}${max} ${period}`;
  }

  return "Not disclosed";
};

const normalizePayload = (body, logoFile) => {
  const stipendDetails = normalizeStipendDetails(body.stipendDetails);
  const logoPath = logoFile
    ? `/uploads/logos/${logoFile.filename}`
    : Object.prototype.hasOwnProperty.call(body, "logo")
      ? asOptionalString(body.logo)
      : undefined;

  return {
    ...body,
    type: OPPORTUNITY_TYPE,
    skills: parseSkills(body.skills),
    cardTags: parseTags(body.cardTags),
    requiredSkills: parseTextList(body.requiredSkills),
    whoCanApply: parseTextList(body.whoCanApply),
    benefits: parseTextList(body.benefits),
    department: asOptionalString(body.department),
    functionalRole: asOptionalString(body.functionalRole),
    companyType: asOptionalString(body.companyType),
    companySize: asOptionalString(body.companySize),
    foundedYear: asOptionalString(body.foundedYear),
    industry: asOptionalString(body.industry),
    listing: asOptionalString(body.listing),
    internshipType: asOptionalString(body.internshipType),
    stipendType:
      body.stipendType === "Unpaid" || body.stipendType === "Paid"
        ? body.stipendType
        : "Paid",
    website: asOptionalString(body.website),
    workMode: normalizeWorkMode(body.workMode, body.location),
    startDate: parseOptionalDate(body.startDate),
    stipendDetails,
    stipend: buildStipendLabel(body.stipend, stipendDetails),
    ...(logoPath !== undefined ? { logo: logoPath } : {}),
  };
};

const mapRows = (opportunities) =>
  opportunities.map((item) => ({
    title: item.title,
    company: item.company,
    description: item.description,
    requiredSkills: (item.requiredSkills || []).join(" | "),
    whoCanApply: (item.whoCanApply || []).join(" | "),
    benefits: (item.benefits || []).join(" | "),
    department: item.department || "",
    functionalRole: item.functionalRole || "",
    companyType: item.companyType || "",
    companySize: item.companySize || "",
    foundedYear: item.foundedYear || "",
    industry: item.industry || "",
    listing: item.listing || "",
    internshipType: item.internshipType || "",
    stipendType: item.stipendType || "Paid",
    website: item.website || "",
    location: item.location,
    duration: item.duration,
    stipend: item.stipend,
    stipendMin: item.stipendDetails?.min,
    stipendMax: item.stipendDetails?.max,
    stipendCurrency: item.stipendDetails?.currency || "",
    stipendPeriod: item.stipendDetails?.period || "",
    workMode: item.workMode || "",
    cardTags: (item.cardTags || []).join(", "),
    type: item.type,
    skills: (item.skills || []).join(", "),
    deadline: item.deadline
      ? new Date(item.deadline).toISOString().split("T")[0]
      : "",
    startDate: item.startDate
      ? new Date(item.startDate).toISOString().split("T")[0]
      : "",
    logo: item.logo || "",
    createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : "",
  }));

const sendFile = (res, format, workbook) => {
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
      'attachment; filename="internships.xlsx"',
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
    'attachment; filename="internships.csv"',
  );
  res.status(200).send(fileBuffer);
};

export const getInternships = async (req, res, next) => {
  try {
    const opportunities = await InternshipOpportunity.find({
      type: OPPORTUNITY_TYPE,
    })
      .populate({ path: "createdBy", select: "fullName email role" })
      .sort({
        createdAt: -1,
      });
    res.status(200).json(opportunities);
  } catch (error) {
    next(error);
  }
};

export const getInternshipById = async (req, res, next) => {
  try {
    const opportunity = await InternshipOpportunity.findOne({
      _id: req.params.id,
      type: OPPORTUNITY_TYPE,
    }).populate({ path: "createdBy", select: "fullName email role" });

    if (!opportunity) {
      res.status(404).json({ message: "Internship opportunity not found." });
      return;
    }

    res.status(200).json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const createInternship = async (req, res, next) => {
  try {
    const payload = {
      ...normalizePayload(req.body, req.file),
      createdBy: req.user._id,
    };
    const opportunity = await InternshipOpportunity.create(payload);
    await opportunity.populate({
      path: "createdBy",
      select: "fullName email role",
    });
    res.status(201).json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const updateInternship = async (req, res, next) => {
  try {
    const payload = normalizePayload(req.body, req.file);

    const opportunity = await InternshipOpportunity.findOneAndUpdate(
      {
        _id: req.params.id,
        type: OPPORTUNITY_TYPE,
        ...getOwnerFilter(req),
      },
      payload,
      {
        new: true,
        runValidators: true,
      },
    ).populate({ path: "createdBy", select: "fullName email role" });

    if (!opportunity) {
      res.status(404).json({ message: "Internship opportunity not found." });
      return;
    }

    res.status(200).json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const deleteInternship = async (req, res, next) => {
  try {
    const opportunity = await InternshipOpportunity.findOneAndDelete({
      _id: req.params.id,
      type: OPPORTUNITY_TYPE,
      ...getOwnerFilter(req),
    });

    if (!opportunity) {
      res.status(404).json({ message: "Internship opportunity not found." });
      return;
    }

    res.status(200).json({ message: "Internship deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const exportInternships = async (req, res, next) => {
  try {
    const format = String(req.query.format || "csv").toLowerCase();
    if (format !== "csv" && format !== "xlsx") {
      res.status(400).json({ message: "Invalid format. Use csv or xlsx." });
      return;
    }

    const opportunities = await InternshipOpportunity.find({
      type: OPPORTUNITY_TYPE,
      ...getOwnerFilter(req),
    }).sort({
      createdAt: -1,
    });

    const rows = mapRows(opportunities);
    const worksheet = xlsx.utils.json_to_sheet(rows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Internships");

    sendFile(res, format, workbook);
  } catch (error) {
    next(error);
  }
};
