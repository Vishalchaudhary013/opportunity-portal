import axios from "axios";
import SocialPost from "../models/socialPostModel.js";


export const syncInstagramPosts = async () => {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID;

    if (!accessToken || !instagramAccountId) {
      console.log("Instagram sync skipped: missing credentials in .env");
      return;
    }

    console.log("Starting Instagram posts sync...");

   
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${instagramAccountId}/media`,
      {
        params: {
          fields: "id,caption,media_type,media_url,permalink,timestamp,username,children{media_url}",
          access_token: accessToken,
          limit: 20, // limit of post that show in ui
        },
      }
    );

    const posts = response.data.data;

    for (const post of posts) {
      
      let text1 = null;
      let text2 = null;

      if (post.caption) {
        
        const paragraphs = post.caption.split('\n\n');
        text1 = paragraphs[0] || null;
        text2 = paragraphs.slice(1).join('\n\n') || null;
      }

      let images = [];
      let singleImage = true;

      if (post.media_type === "CAROUSEL_ALBUM" && post.children) {
        images = post.children.data.map(child => child.media_url);
        singleImage = false;
      } else if (post.media_url) {
        images = [post.media_url];
      }

      
      await SocialPost.findOneAndUpdate(
        { postId: post.id, source: "instagram" },
        {
          source: "instagram",
          postId: post.id,
          text1,
          text2,
          images,
          singleImage,
          likes: 0, 
          comments: 0,
          shares: 0,
          postUrl: post.permalink,
          postedAt: new Date(post.timestamp),
          authorName: post.username || "Saurabh Dutta",
          authorUsername: post.username ? `@${post.username}` : "@username",
        },
        { upsert: true, new: true }
      );
    }

    console.log(`Successfully synced ${posts.length} Instagram posts.`);
  } catch (error) {
    console.error("Error syncing Instagram posts:", error.response?.data || error.message);
  }
};
