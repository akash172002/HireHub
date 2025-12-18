import express from "express";
import {
  applyJob,
  getApplicationsByJob,
  updateStatus,
} from "../controllers/applicationController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("SEEKER"), applyJob);

router.get(
  "/job/:jobId",
  protect,
  authorize("RECRUITER"),
  getApplicationsByJob
);

router.put("/:id", protect, authorize("RECRUITER"), updateStatus);

export default router;
