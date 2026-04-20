import dotenv from "dotenv";
import mongoose from "mongoose";
import InternshipOpportunity from "../models/internshipOpportunityModel.js";

dotenv.config({ path: "./.env" });

const resolveWorkMode = (workMode, location) => {
  const normalizedMode = String(workMode || "")
    .trim()
    .toLowerCase();

  if (normalizedMode === "remote") {
    return "Remote";
  }

  if (normalizedMode === "hybrid") {
    return "Hybrid";
  }

  if (normalizedMode === "in office" || normalizedMode === "office") {
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

const parseStipendFromText = (stipendText) => {
  const input = String(stipendText || "");
  const matches = input.match(/\d+(?:\.\d+)?/g) || [];

  if (matches.length < 2) {
    return { min: null, max: null };
  }

  return {
    min: Number(matches[0]),
    max: Number(matches[1]),
  };
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const internships = await InternshipOpportunity.find({
    type: "Internship",
  });

  let updatedCount = 0;

  for (const internship of internships) {
    const stipendMinMissing =
      internship?.stipendDetails?.min === null ||
      internship?.stipendDetails?.min === undefined;
    const stipendMaxMissing =
      internship?.stipendDetails?.max === null ||
      internship?.stipendDetails?.max === undefined;

    const parsedStipend = parseStipendFromText(internship.stipend);

    const nextStipendDetails = {
      min: stipendMinMissing
        ? parsedStipend.min
        : internship.stipendDetails?.min,
      max: stipendMaxMissing
        ? parsedStipend.max
        : internship.stipendDetails?.max,
      currency: internship.stipendDetails?.currency || "INR",
      period: internship.stipendDetails?.period || "per month",
    };

    const nextWorkMode = resolveWorkMode(
      internship.workMode,
      internship.location,
    );
    const nextTags = Array.isArray(internship.cardTags)
      ? internship.cardTags.filter(Boolean)
      : [];

    const changed =
      nextWorkMode !== internship.workMode ||
      nextStipendDetails.min !== internship?.stipendDetails?.min ||
      nextStipendDetails.max !== internship?.stipendDetails?.max ||
      nextStipendDetails.currency !== internship?.stipendDetails?.currency ||
      nextStipendDetails.period !== internship?.stipendDetails?.period ||
      nextTags.length !== (internship.cardTags || []).length;

    if (!changed) {
      continue;
    }

    internship.workMode = nextWorkMode;
    internship.stipendDetails = nextStipendDetails;
    internship.cardTags = nextTags;
    await internship.save();
    updatedCount += 1;
  }

  console.log(
    JSON.stringify(
      {
        scanned: internships.length,
        updated: updatedCount,
      },
      null,
      2,
    ),
  );

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch {
    // Ignore cleanup errors.
  }
  process.exit(1);
});
