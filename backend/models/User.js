import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: String,
      enum: ["SEEKER", "RECRUITER", "ADMIN"],
      default: "SEEKER",
    },
    bio: String,
    skills: [String],
    profilePhoto: String,
    resume: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
