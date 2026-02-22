import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import { validate, v } from "../middlewares/validate.js";

const router = express.Router();

const registerSchema = { body: { name: [v.required], email: [v.required, v.email], password: [v.required, v.minLen(6)] } };
const loginSchema = { body: { email: [v.required, v.email], password: [v.required] } };
const forgotSchema = { body: { email: [v.required, v.email] } };
const resetSchema = { body: { token: [v.required], newPassword: [v.required, v.minLen(6)] } };

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotSchema), forgotPassword);
router.post("/reset-password", validate(resetSchema), resetPassword);

export default router;
