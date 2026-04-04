import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { getMatchScore } from "../utils/matchScore.js";

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    console.log("[Application] Apply request | jobId:", jobId, "| userId:", req.user?.id);

    const user = await User.findById(req.user.id);
    if (!user || !user.resume) {
      console.log("[Application] Rejected – no resume in profile for user:", req.user?.id);
      return res
        .status(400)
        .json({ message: "Upload resume in profile first" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      console.log("[Application] Job not found:", jobId);
      return res.status(404).json({ message: "Job not found" });
    }

    const existing = await Application.findOne({
      jobId,
      userId: req.user.id,
    });
    if (existing) {
      console.log("[Application] Rejected – already applied | jobId:", jobId);
      return res.status(400).json({ message: "Already applied" });
    }

    const resumeUrl = user.resume;
    const resumeText = await extractTextFromPDF(resumeUrl);
    const jobText = `${job.title} ${job.description} ${(job.skills || []).join(" ")}`;
    const mlResult = getMatchScore(resumeText, jobText);
    console.log("[Application] Match score:", mlResult.match_score, "| recommended:", mlResult.recommended);

    const application = await Application.create({
      jobId,
      userId: req.user.id,
      resume: user.resume,
      matchScore: mlResult.match_score,
      recommended: mlResult.recommended,
    });
    console.log("[Application] OK – Application saved to DB | _id:", application._id, "| jobId:", jobId);

    try {
      await sendEmail({
        to: user.email,
        subject: `Application submitted – ${job.title} at ${job.company}`,
        html: `
          <h3>Application submitted</h3>
          <p>Hi ${user.name || "there"},</p>
          <p>Your application for the following job has been submitted successfully.</p>
          <ul>
            <li><b>Role:</b> ${job.title}</li>
            <li><b>Company:</b> ${job.company}</li>
            <li><b>Location:</b> ${job.location || "—"}</li>
            <li><b>Salary:</b> ${job.salary || "—"}</li>
          </ul>
          <p>Match score: <b>${mlResult.match_score}%</b> ${mlResult.recommended ? "– Recommended match!" : ""}</p>
          <p>We'll notify you when the recruiter updates your application status.</p>
          <p>— HireHub</p>
        `,
      });
    } catch (e) {
      console.error("[Application] Failed to send confirmation email to applicant:", e.message);
    }

    res.status(201).json(application);
  } catch (err) {
    console.error("[Application] Error – application NOT saved:", err.name, err.message, err.stack);
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
  const applications = await Application.find({ jobId: req.params.jobId })
    .populate("userId", "name email profilePhoto resume")
    .populate("jobId", "title company")
    .sort({ matchScore: -1, createdAt: -1 });
  res.json(applications);
};

export const getMyApplications = async (req, res) => {
  const applications = await Application.find({ userId: req.user.id })
    .populate("jobId", "title company location salary status")
    .sort({ createdAt: -1 });
  res.json(applications);
};
