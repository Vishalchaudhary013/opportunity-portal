import GlobalProgramOpportunity from "../models/globalProgramOpportunityModel.js";
import xlsx from "xlsx";

const OPPORTUNITY_TYPE = "Global Program";

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

const normalizePayload = (body) => ({
  ...body,
  type: OPPORTUNITY_TYPE,
  skills: parseSkills(body.skills),
});

const mapRows = (opportunities) =>
  opportunities.map((item) => ({
    title: item.title,
    company: item.company,
    description: item.description,
    location: item.location,
    duration: item.duration,
    stipend: item.stipend,
    type: item.type,
    skills: (item.skills || []).join(", "),
    deadline: item.deadline
      ? new Date(item.deadline).toISOString().split("T")[0]
      : "",
    logo: item.logo || "",
    programType: item.programType || "",
    eligibility: item.eligibility || "",
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
      'attachment; filename="global-programs.xlsx"',
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
    'attachment; filename="global-programs.csv"',
  );
  res.status(200).send(fileBuffer);
};

export const getGlobalPrograms = async (req, res, next) => {
  try {
    const opportunities = await GlobalProgramOpportunity.find({
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

export const getGlobalProgramById = async (req, res, next) => {
  try {
    const opportunity = await GlobalProgramOpportunity.findOne({
      _id: req.params.id,
      type: OPPORTUNITY_TYPE,
    }).populate({ path: "createdBy", select: "fullName email role" });

    if (!opportunity) {
      res
        .status(404)
        .json({ message: "Global program opportunity not found." });
      return;
    }

    res.status(200).json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const createGlobalProgram = async (req, res, next) => {
  try {
    const payload = {
      ...normalizePayload(req.body),
      createdBy: req.user._id,
    };
    const opportunity = await GlobalProgramOpportunity.create(payload);
    await opportunity.populate({
      path: "createdBy",
      select: "fullName email role",
    });
    res.status(201).json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const updateGlobalProgram = async (req, res, next) => {
  try {
    const payload = normalizePayload(req.body);

    const opportunity = await GlobalProgramOpportunity.findOneAndUpdate(
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
      res
        .status(404)
        .json({ message: "Global program opportunity not found." });
      return;
    }

    res.status(200).json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const deleteGlobalProgram = async (req, res, next) => {
  try {
    const opportunity = await GlobalProgramOpportunity.findOneAndDelete({
      _id: req.params.id,
      type: OPPORTUNITY_TYPE,
      ...getOwnerFilter(req),
    });

    if (!opportunity) {
      res
        .status(404)
        .json({ message: "Global program opportunity not found." });
      return;
    }

    res.status(200).json({ message: "Global program deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const exportGlobalPrograms = async (req, res, next) => {
  try {
    const format = String(req.query.format || "csv").toLowerCase();
    if (format !== "csv" && format !== "xlsx") {
      res.status(400).json({ message: "Invalid format. Use csv or xlsx." });
      return;
    }

    const opportunities = await GlobalProgramOpportunity.find({
      type: OPPORTUNITY_TYPE,
      ...getOwnerFilter(req),
    }).sort({
      createdAt: -1,
    });

    const rows = mapRows(opportunities);
    const worksheet = xlsx.utils.json_to_sheet(rows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Global Programs");

    sendFile(res, format, workbook);
  } catch (error) {
    next(error);
  }
};
