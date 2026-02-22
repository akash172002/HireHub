import mongoose from "mongoose";
import crypto from "crypto";

const resetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

// TTL: MongoDB deletes doc when expiresAt has passed
resetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
resetTokenSchema.index({ token: 1 });

export const createResetToken = async (userId) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await mongoose.model("ResetToken").create({ userId, token, expiresAt });
  return { token, expiresAt };
};

export default mongoose.model("ResetToken", resetTokenSchema);
