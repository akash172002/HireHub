import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../utils/upload.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getProfile);

router.put(
  "/me",
  protect,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateProfile
);

export default router;
