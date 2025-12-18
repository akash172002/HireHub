import express from "express";
import { createJob, getJobs } from "../controllers/jobController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("RECRUITER"), createJob);

router.get("/", getJobs);

export default router;
