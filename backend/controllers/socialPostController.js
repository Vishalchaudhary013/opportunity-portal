import SocialPost from "../models/socialPostModel.js";

export const getSocialPosts = async (req, res) => {
  try {
    const { source, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (source) {
      if (!["linkedin", "instagram"].includes(source)) {
        return res.status(400).json({ message: "Invalid source. Must be 'linkedin' or 'instagram'." });
      }
      query.source = source;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await SocialPost.find(query)
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SocialPost.countDocuments(query);

    res.status(200).json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
