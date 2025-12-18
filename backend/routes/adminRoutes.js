import express from "express";
import {
  approvalChart,
  dashboardCounts,
  jobsPostedChart,
  updateJobStatus,
} from "../controllers/adminController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard/counts", protect, authorize("ADMIN"), dashboardCounts);

router.get(
  "/dashboard/jobs-chart",
  protect,
  authorize("ADMIN"),
  jobsPostedChart
);

router.get(
  "/dashboard/approval-chart",
  protect,
  authorize("ADMIN"),
  approvalChart
);

router.put("/job/:id/status", protect, authorize("ADMIN"), updateJobStatus);

export default router;
