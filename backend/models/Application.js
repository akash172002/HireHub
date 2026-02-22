import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resume: String,
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected"],
      default: "Applied",
    },
    matchScore: {
      type: Number,
    },
    recommended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
applicationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Application", applicationSchema);
