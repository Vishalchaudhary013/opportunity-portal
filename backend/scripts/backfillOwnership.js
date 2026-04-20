import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import InternshipOpportunity from "../models/internshipOpportunityModel.js";
import GlobalProgramOpportunity from "../models/globalProgramOpportunityModel.js";

dotenv.config({ path: "./.env" });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({
    email: "vishalchoudhary82194@gmail.com",
  }).select("_id");

  if (!user) {
    throw new Error("user  not found.");
  }

  const internshipsResult = await InternshipOpportunity.updateMany(
    { createdBy: null },
    { $set: { createdBy: user._id } },
  );

  const globalProgramsResult = await GlobalProgramOpportunity.updateMany(
    { createdBy: null },
    { $set: { createdBy: user._id } },
  );

  const verifyInternships = await InternshipOpportunity.countDocuments({
    createdBy: user._id,
  });
  const verifyGlobalPrograms = await GlobalProgramOpportunity.countDocuments({
    createdBy: user._id,
  });

  console.log(
    JSON.stringify(
      {
        updated: {
          internships: internshipsResult.modifiedCount,
          globalPrograms: globalProgramsResult.modifiedCount,
        },
        userOwnedAfter: {
          internships: verifyInternships,
          globalPrograms: verifyGlobalPrograms,
        },
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
    // Ignore disconnect errors during cleanup.
  }
  process.exit(1);
});
