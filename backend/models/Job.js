import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    skills: [String],
    salary: String,
    location: String,
    company: String,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
    },
  },
  { timestamps: true }
);

jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ title: "text", description: "text" });

export default mongoose.model("Job", jobSchema);
