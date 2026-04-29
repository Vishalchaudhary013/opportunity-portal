import mongoose from "mongoose";

const internshipOpportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    whoCanApply: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    department: {
      type: String,
      default: "",
      trim: true,
    },
    functionalRole: {
      type: String,
      default: "",
      trim: true,
    },
    companyType: {
      type: String,
      default: "",
      trim: true,
    },
    companySize: {
      type: String,
      default: "",
      trim: true,
    },
    foundedYear: {
      type: String,
      default: "",
      trim: true,
    },
    industry: {
      type: String,
      default: "",
      trim: true,
    },
    listing: {
      type: String,
      default: "",
      trim: true,
    },
    internshipType: {
      type: String,
      default: "",
      trim: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    stipend: {
      type: String,
      required: true,
      trim: true,
    },
    stipendType: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Paid",
      trim: true,
    },
    stipendDetails: {
      min: {
        type: Number,
        default: null,
      },
      max: {
        type: Number,
        default: null,
      },
      currency: {
        type: String,
        default: "INR",
        trim: true,
      },
      period: {
        type: String,
        default: "per month",
        trim: true,
      },
    },
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "In Office"],
      default: "In Office",
      trim: true,
    },
    cardTags: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      default: "Internship",
      enum: ["Internship"],
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    logo: {
      type: String,
      default: "",
      trim: true,
    },
    programType: {
      type: String,
      default: "",
      trim: true,
    },
    eligibility: {
      type: String,
      default: "",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "opportunities",
  },
);

const InternshipOpportunity = mongoose.model(
  "InternshipOpportunity",
  internshipOpportunitySchema,
);

export default InternshipOpportunity;
