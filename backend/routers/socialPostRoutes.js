import express from "express";
import { getSocialPosts } from "../controllers/socialPostController.js";

const router = express.Router();

router.get("/posts", getSocialPosts);

export default router;
