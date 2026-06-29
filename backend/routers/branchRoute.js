import express from "express";
import {
  createBranch,
  deleteBranch,
  getAllBranch,
  getSingleBranch,
  updateBranch,
} from "../controllers/branchController.js";

import { protect, requireSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, requireSuperAdmin, createBranch);

router.get("/", getAllBranch);

router.get("/:id", getSingleBranch);
router.put("/:id", protect, requireSuperAdmin, updateBranch);
router.delete("/:id", protect, requireSuperAdmin, deleteBranch);

export default router;
