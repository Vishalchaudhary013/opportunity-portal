import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    formSchema: {
      fields: {
        type: Array,
        default: [],
      },
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    publishedUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Form", formSchema);