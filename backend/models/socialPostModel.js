import mongoose from "mongoose";

const socialPostSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["linkedin", "instagram"],
      required: true,
    },
    postId: {
      type: String,
      required: true,
      unique: true, 
    },
    text1: {
      type: String,
      default: null,
    },
    text2: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    singleImage: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    postUrl: {
      type: String,
      default: null,
    },
    postedAt: {
      type: Date,
      required: true,
    },
    authorName: {
      type: String,
      default: null,
    },
    authorUsername: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const SocialPost = mongoose.model("SocialPost", socialPostSchema);
export default SocialPost;
