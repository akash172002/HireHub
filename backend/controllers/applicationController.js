import Application from "../models/Application.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { getMatchScore } from "../utils/mlClient.js";

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || !user.resume) {
      return res
        .status(400)
        .json({ message: "Upload resume in profile first" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existing = await Application.findOne({
      jobId,
      userId: req.user.id,
    });
    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    // 🔥 ML PART
    const resumeText = await extractTextFromPDF(user.resume);
    const jobText = `${job.title} ${job.description} ${job.skills.join(" ")}`;

    const mlResult = await getMatchScore(resumeText, jobText);

    const application = await Application.create({
      jobId,
      userId: req.user.id,
      resume: user.resume,
      matchScore: mlResult.match_score,
      recommended: mlResult.recommended,
    });

    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const application = await Application.findById(req.params.id)
    .populate("jobId")
    .populate("userId");

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  application.status = status;
  await application.save();

  await sendEmail({
    to: application.userId.email,
    subject: `Application Status Updated | ${application.jobId.title}`,
    html: `
      <h3>Application Status Update</h3>
      <p>Your application status has been updated.</p>
      <ul>
        <li><b>Role:</b> ${application.jobId.title}</li>
        <li><b>Company:</b> ${application.jobId.company}</li>
        <li><b>Salary:</b> ${application.jobId.salary}</li>
        <li><b>Location:</b> ${application.jobId.location}</li>
        <li><b>Status:</b> ${application.status}</li>
        <li><b>Job ID:</b> ${application.jobId._id}</li>
      </ul>
    `,
  });

  res.json(application);
};

export const getApplicationsByJob = async (req, res) => {
  const applications = await Application.find({
    jobId: req.params.jobId,
  })
    .populate("userId", "name email profilePhoto resume")
    .populate("jobId", "title company");

  res.json(applications);
};
