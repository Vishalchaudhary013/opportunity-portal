import InternshipOpportunity from "../models/internshipOpportunityModel.js";
import xlsx from "xlsx";
import ExcelJS from "exceljs";
import Application from "../models/applicationModel.js";

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

const mapRows = (opportunities, responseCounts = {}) =>
  opportunities.map((item) => ({
    "Name": item.title,
    "Company": item.company,
    "Location": item.location,
    "Responses": responseCounts[item._id.toString()] || 0,
    "Date": item.deadline
      ? new Date(item.deadline).toISOString().split("T")[0]
      : "",
    "Status": item.listing === "active" ? "Active" : "Closed",
  }));

const sendFile = async (res, format, rows, filename) => {
  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    if (rows.length > 0) {
      // Add headers
      const headers = Object.keys(rows[0]);
      const headerRow = worksheet.addRow(headers);
      
      // Style headers: Bold and centered
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE9ECEF' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { bottom: { style: 'thin' } };
      });

      // Add data rows
      rows.forEach(rowData => {
        worksheet.addRow(Object.values(rowData));
      });

      // Auto-width columns
      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) maxLength = columnLength;
        });
        column.width = maxLength < 12 ? 12 : maxLength > 50 ? 50 : maxLength + 2;
      });
    }

    const fileBuffer = await workbook.xlsx.writeBuffer();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}.xlsx"`);
    res.status(200).send(fileBuffer);
    return;
  }

  // Fallback to xlsx for CSV
  const worksheet = xlsx.utils.json_to_sheet(rows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Data");
  const fileBuffer = xlsx.write(workbook, { type: "buffer", bookType: "csv" });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}.csv"`);
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
        returnDocument: "after",
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

    // Get application counts for each opportunity
    const opportunityIds = opportunities.map(o => o._id);
    const counts = await Application.aggregate([
      { $match: { opportunity: { $in: opportunityIds } } },
      { $group: { _id: "$opportunity", count: { $sum: 1 } } }
    ]);

    const responseCounts = {};
    counts.forEach(c => {
      responseCounts[c._id.toString()] = c.count;
    });

    const rows = mapRows(opportunities, responseCounts);
    await sendFile(res, format, rows, "internships");
  } catch (error) {
    next(error);
  }
};

export const attachForm = async (req, res, next) => {
  try {
    const { formId } = req.body;
    const internshipId = req.params.id;

    const internship = await InternshipOpportunity.findOneAndUpdate(
      { _id: internshipId, ...getOwnerFilter(req) },
      { formId },
      { returnDocument: "after" }
    );

    if (!internship) {
      res.status(404).json({ message: "Internship not found or unauthorized" });
      return;
    }

    res.status(200).json({ 
      message: "Form attached successfully", 
      internship 
    });
  } catch (error) {
    next(error);
  }
};
