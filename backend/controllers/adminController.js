import Job from "../models/Job.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

export const dashboardCounts = async (req, res) => {
  const totalJobs = await Job.countDocuments();
  const approvedJobs = await Job.countDocuments({ status: "APPROVED" });
  const rejectedJobs = await Job.countDocuments({ status: "REJECTED" });
  const recruiters = await User.countDocuments({ role: "RECRUITER" });

  const companies = await Job.distinct("company");

  res.json({
    totalJobs,
    approvedJobs,
    rejectedJobs,
    totalCompanies: companies.length,
    totalRecruiters: recruiters,
  });
};

export const jobsPostedChart = async (req, res) => {
  const data = await Job.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        jobs: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(data);
};

export const approvalChart = async (req, res) => {
  const data = await Job.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  res.json(data);
};

export const updateJobStatus = async (req, res) => {
  const { status } = req.body;

  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate("postedBy");

  const recruiter = job.postedBy;

  await sendEmail({
    to: recruiter.email,
    subject: `Job ${status} - ${job.title} - For Recruiter`,
    html: `
      <h3>Job Status Update</h3>
      <p>Your job posting has been <b>${status}</b>.</p>
      <ul>
        <li><b>Role:</b> ${job.title}</li>
        <li><b>Company:</b> ${job.company}</li>
        <li><b>Salary:</b> ${job.salary}</li>
        <li><b>Location:</b> ${job.location}</li>
        <li><b>Job ID:</b> ${job._id}</li>
      </ul>
    `,
  });

  res.json({ message: `Job ${status.toLowerCase()}` });
};
