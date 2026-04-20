import express from "express";
import {
  createInternship,
  deleteInternship,
  exportInternships,
  getInternshipById,
  getInternships,
  updateInternship,
} from "../controllers/internshipOpportunityController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import logoUpload from "../middleware/logoUpload.js";

const router = express.Router();

router.get("/", getInternships);
router.get("/export", protect, requireAdmin, exportInternships);
router.get("/:id", getInternshipById);
router.post(
  "/",
  protect,
  requireAdmin,
  logoUpload.single("logoFile"),
  createInternship,
);
router.put(
  "/:id",
  protect,
  requireAdmin,
  logoUpload.single("logoFile"),
  updateInternship,
);
router.delete("/:id", protect, requireAdmin, deleteInternship);

export default router;
