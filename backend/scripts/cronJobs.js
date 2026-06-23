import cron from "node-cron";
import { syncInstagramPosts } from "../utils/instagramService.js";
import { syncLinkedinPosts } from "../utils/linkedinService.js";

export const startSocialSyncCron = () => {
  console.log("Starting social media sync cron jobs...");

  // Run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    console.log("Running scheduled social media sync...");
    await syncInstagramPosts();
    await syncLinkedinPosts();
  });
};
