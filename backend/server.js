import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDb from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import User from "./models/User.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  if (req.method === "POST" && req.path === "/api/auth/register") {
    console.log("[Server] POST /api/auth/register received");
  }
  next();
});

// Health + DB status (no auth – use this to verify DB and user count)
app.get("/api/health", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
    const dbName = mongoose.connection.db?.databaseName || "unknown";
    const usersCount = await User.countDocuments();
    res.json({
      ok: true,
      db: states[dbState] ?? dbState,
      database: dbName,
      usersCount,
      message: dbState === 1 ? `DB connected. ${usersCount} user(s) in 'users'.` : "DB not connected.",
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5004;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("[Server] Listening on port", PORT, "| DB connected – check logs above for [DB] and [Register]/[Login] to confirm saves.");
    });
  })
  .catch((err) => {
    console.error("[Server] Startup failed – DB not connected:", err.message);
    process.exit(1);
  });
