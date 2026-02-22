import User from "../models/User.js";
import ResetToken, { createResetToken } from "../models/ResetToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const body = req.body || {};
    console.log("[Register] Request body keys:", Object.keys(body), "| hasData:", Object.keys(body).length > 0);
    if (Object.keys(body).length === 0) {
      console.error("[Register] Empty body – is Content-Type: application/json set? Is the request reaching this backend?");
      return res.status(400).json({ message: "Request body is empty" });
    }
    const { name, email, password, role } = body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const doc = { name: name || email.split("@")[0], email, password: hashed, role: role === "RECRUITER" || role === "ADMIN" ? role : "SEEKER" };
    console.log("[Register] Creating user:", doc.email, doc.role);
    const user = await User.create(doc);
    console.log("[Register] OK – User saved to DB | _id:", user._id, "| email:", user.email);

    // Verify write: read back from DB
    const readBack = await User.findById(user._id).select("email name role").lean();
    if (readBack) {
      console.log("[Register] Verified in DB (read back):", readBack.email);
    } else {
      console.error("[Register] WARNING: Could not read user back from DB – write may not have persisted.");
    }

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    if (err.code === 11000) {
      console.log("[Register] Duplicate email – not saved:", req.body?.email);
      return res.status(400).json({ message: "Email already registered" });
    }
    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors || {}).map((e) => e.message).join(", ");
      console.error("[Register] ValidationError – not saved:", msg);
      return res.status(400).json({ message: msg || "Validation failed" });
    }
    console.error("[Register] Error – data NOT saved to DB:", err.name, err.message, err.stack);
    res.status(500).json({ message: err.message || "Registration failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("[Login] Attempt for email:", email);
  const user = await User.findOne({ email });
  if (!user) {
    console.log("[Login] No user in DB for email:", email);
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("[Login] Wrong password for email:", email);
    return res.status(400).json({ message: "Invalid credentials" });
  }
  console.log("[Login] OK – user from DB | _id:", user._id, "| email:", user.email);
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  const safe = { _id: userObj._id, name: userObj.name, email: userObj.email, role: userObj.role, bio: userObj.bio, skills: userObj.skills, profilePhoto: userObj.profilePhoto, resume: userObj.resume };
  res.json({ token, user: safe });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: "If that email exists, we sent a reset link." });
  const { token } = await createResetToken(user._id);
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "HireHub – Reset your password",
    html: `
      <h2>Password reset</h2>
      <p>Click the link below to set a new password (valid 1 hour):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
  res.status(200).json({ message: "If that email exists, we sent a reset link." });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const resetDoc = await ResetToken.findOne({ token });
  if (!resetDoc || resetDoc.expiresAt < new Date())
    return res.status(400).json({ message: "Invalid or expired reset link." });
  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(resetDoc.userId, { password: hashed });
  await ResetToken.deleteOne({ _id: resetDoc._id });
  res.status(200).json({ message: "Password updated. You can log in now." });
};
