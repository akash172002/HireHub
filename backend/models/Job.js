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

export default mongoose.model("Job", jobSchema);
