import mongoose from "mongoose";

const internshipOpportunitySchema = new mongoose.Schema(
  {
    //   Program Specifics 
    title: { type: String, required: true, trim: true },
    departmentCategory: { type: String, default: "", trim: true },
    openings: { type: Number, default: null },
    cityState: { type: String, default: "", trim: true },
    googleLocationLink: { type: String, default: "", trim: true },
    workMode: { type: String, enum: ["Remote", "Hybrid", "In Office", "On-site"], default: "In Office", trim: true },
    duration: { type: String, required: true, trim: true },
    internshipType: { type: String, default: "", trim: true },
    workingHours: { type: String, enum: ["Full-time", "Part-time", ""], default: "", trim: true },

    //   Program Timeline 
    applicationsOpenDate: { type: Date, default: null },
    deadline: { type: Date, required: true }, 
    selectionAnnouncementDate: { type: Date, default: null },
    startDate: { type: Date, default: null },

    //  Financials & Incentives 
    stipendType: { type: String, enum: ["Fixed", "Performance-based", "Unpaid", "Paid"], default: "Fixed", trim: true },
    stipend: { type: String, default: "", trim: true }, // Amount
    stipendCurrency: { type: String, default: "INR", trim: true },
    incentivesBonuses: { type: String, default: "", trim: true },
    perks: { type: [String], default: [] }, // Multi-select Checkbox (Benefits)

    //   Candidate Requirements 
    targetEducation: { type: [String], default: [] },
    batchEligibility: { type: [String], default: [] },
    minimumCGPA: { type: Number, default: null },
    requiredSkills: { type: [String], default: [] },
    experienceLevel: { type: String, default: "", trim: true },

    //   Qualifications 
    minimumRequirements: { type: String, default: "", trim: true }, // Bullet points
    preferredQualifications: { type: String, default: "", trim: true }, // Bullet points

    //   Job Description 
    aboutProgram: { type: String, default: "", trim: true },
    description: { type: String, required: true, trim: true }, // Key Responsibilities
    whatYouWillLearn: { type: String, default: "", trim: true },

    //   Selection Process 
    selectionRounds: { type: [String], default: [] },
    assignmentLink: { type: String, default: "", trim: true },
    customScreeningQuestion: { type: String, default: "", trim: true },

    //   About the company 
    company: { type: String, required: true, trim: true },
    website: { type: String, default: "", trim: true },
    industry: { type: String, default: "", trim: true },
    headquarters: { type: String, default: "", trim: true },
    foundedYear: { type: String, default: "", trim: true },
    companySize: { type: String, default: "", trim: true }, // Number of employees
    companyClassification: { type: String, default: "", trim: true }, // company type like startup, etc.
    logo: { type: String, default: "", trim: true },
    featuredListing: { type: Boolean, default: false },
    hiringManager: { type: String, default: "", trim: true },
    socialProofLinks: {
      linkedin: { type: String, default: "", trim: true },
      twitter: { type: String, default: "", trim: true },
      instagram: { type: String, default: "", trim: true },
    },
    cultureVideos: { type: [String], default: [] },
    virtualTour: { type: String, default: "", trim: true },
    companyOverview: { type: String, default: "", trim: true },
    specialties: { type: String, default: "", trim: true },

    
    location: { type: String, default: "Remote", trim: true }, 
    type: { type: String, default: "Internship", enum: ["Internship", "Global Program", "Jobs", "Bootcamps", "Masterclasses", "Degree Programs", "PG Programs"], required: true },
    skills: { type: [String], default: [] }, 
    cardTags: { type: [String], default: [] },
    department: { type: String, default: "", trim: true }, 
    functionalRole: { type: String, default: "", trim: true }, 
    companyType: { type: String, default: "", trim: true }, 
    whoCanApply: { type: [String], default: [] }, 
    benefits: { type: [String], default: [] }, 
    stipendDetails: { 
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      currency: { type: String, default: "INR", trim: true },
      period: { type: String, default: "per month", trim: true },
    },
    listing: { type: String, default: "", trim: true },
    programType: { type: String, default: "", trim: true },
    eligibility: { type: String, default: "", trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", default: null },
    submissionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  },
  {
    timestamps: true,
    collection: "opportunities",
  }
);

const InternshipOpportunity = mongoose.model("InternshipOpportunity", internshipOpportunitySchema);
export default InternshipOpportunity;
