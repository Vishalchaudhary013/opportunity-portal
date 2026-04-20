import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
    },
    opportunityTitle: {
      type: String,
      required: true,
      trim: true,
    },
    opportunityType: {
      type: String,
      enum: ["Internship", "Global Program"],
      required: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    portfolio: {
      type: String,
      default: "",
      trim: true,
    },
    linkedin: {
      type: String,
      default: "",
      trim: true,
    },
    whySelectYou: {
      type: String,
      required: true,
      trim: true,
    },
    resume: {
      fileName: {
        type: String,
        required: true,
      },
      filePath: {
        type: String,
        required: true,
      },
      mimeType: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["New", "Shortlisted", "Rejected"],
      default: "New",
    },
  },
  {
    timestamps: true,
  },
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
