import express from "express";
import { createJob, getJobs, getJobById, getMyJobs } from "../controllers/jobController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("RECRUITER"), createJob);
router.get("/", getJobs);
router.get("/my", protect, authorize("RECRUITER"), getMyJobs);
router.get("/:id", getJobById);

export default router;
