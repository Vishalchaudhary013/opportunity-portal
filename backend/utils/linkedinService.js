import axios from "axios";
import SocialPost from "../models/socialPostModel.js";


export const syncLinkedinPosts = async () => {
  try {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const organizationId = process.env.LINKEDIN_ORGANIZATION_ID;

    if (!accessToken || !organizationId) {
      console.log("LinkedIn sync skipped: missing credentials in .env");
      return;
    }

    console.log("Starting LinkedIn posts sync...");

    
    let authorName = process.env.LINKEDIN_AUTHOR_NAME || "Company Name";
    let authorUsername = process.env.LINKEDIN_AUTHOR_USERNAME || "@company";
    try {
      const orgResponse = await axios.get(`https://api.linkedin.com/v2/organizations/${organizationId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (orgResponse.data && orgResponse.data.localizedName) {
        authorName = orgResponse.data.localizedName;
        authorUsername = `@${orgResponse.data.vanityName || authorName.replace(/\s+/g, '').toLowerCase()}`;
      }
    } catch (e) {
      console.log("Could not fetch org details for dynamic name, using fallbacks.");
    }

    // Fetch posts from LinkedIn UGC/Share API
    const response = await axios.get(
      `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=urn:li:organization:${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
        params: {
          count: 20,
        },
      }
    );

    const elements = response.data.elements || [];

    for (const post of elements) {
      const postId = post.id;
      let textContent = "";
      
     
      if (post.specificContent && post.specificContent["com.linkedin.ugc.ShareContent"]) {
        const shareContent = post.specificContent["com.linkedin.ugc.ShareContent"];
        if (shareContent.shareCommentary && shareContent.shareCommentary.text) {
          textContent = shareContent.shareCommentary.text;
        }
      }

      let text1 = null;
      let text2 = null;

      if (textContent) {
        const paragraphs = textContent.split('\n\n');
        text1 = paragraphs[0] || null;
        text2 = paragraphs.slice(1).join('\n\n') || null;
      }

      let images = [];
      let singleImage = true;

      // for media
      if (post.specificContent && post.specificContent["com.linkedin.ugc.ShareContent"]) {
        const shareContent = post.specificContent["com.linkedin.ugc.ShareContent"];
        if (shareContent.media && shareContent.media.length > 0) {
           
           images = shareContent.media.map(m => m.thumbnails?.[0]?.url || m.media).filter(Boolean);
           singleImage = images.length <= 1;
        }
      }

     
      await SocialPost.findOneAndUpdate(
        { postId, source: "linkedin" },
        {
          source: "linkedin",
          postId,
          text1,
          text2,
          images,
          singleImage,
          likes: 0,
          comments: 0,
          shares: 0,
          postUrl: `https://www.linkedin.com/feed/update/${postId}`,
          postedAt: new Date(post.created.time),
          authorName: authorName,
          authorUsername: authorUsername,
        },
        { upsert: true, new: true }
      );
    }

    console.log(`Successfully synced ${elements.length} LinkedIn posts.`);
  } catch (error) {
    console.error("Error syncing LinkedIn posts:", error.response?.data || error.message);
  }
};
