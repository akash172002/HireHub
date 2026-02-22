import Job from "../models/Job.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createJob = async (req, res) => {
  try {
    console.log("[Job] Creating job | title:", req.body?.title, "| company:", req.body?.company);
    const job = await Job.create({
      ...req.body,
      postedBy: req.user.id,
      status: "PENDING",
    });
    console.log("[Job] OK – Job saved to DB | _id:", job._id, "| title:", job.title);

    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New Job Posted (Approval Required)",
        html: `
          <h3>New Job Posted</h3>
          <ul>
            <li><b>Role:</b> ${job.title}</li>
            <li><b>Company:</b> ${job.company}</li>
            <li><b>Salary:</b> ${job.salary}</li>
            <li><b>Location:</b> ${job.location}</li>
            <li><b>Job ID:</b> ${job._id}</li>
          </ul>
          <p>Please review and approve.</p>
        `,
      });
    } catch (e) {
      console.error("[Job] Admin email failed:", e.message);
    }

    try {
      const seekers = await User.find({ role: "SEEKER" }).select("email name").lean();
      const newJobHtml = `
      <h3>New job on HireHub</h3>
      <p>A new job has been posted that might interest you.</p>
      <ul>
        <li><b>Role:</b> ${job.title}</li>
        <li><b>Company:</b> ${job.company}</li>
        <li><b>Location:</b> ${job.location || "—"}</li>
        <li><b>Salary:</b> ${job.salary || "—"}</li>
      </ul>
      <p>Log in to HireHub to view details and apply.</p>
      <p>— HireHub</p>
    `;
      for (const seeker of seekers) {
        if (seeker.email) {
          try {
            await sendEmail({
              to: seeker.email,
              subject: `New job: ${job.title} at ${job.company}`,
              html: (seeker.name ? `<p>Hi ${seeker.name},</p>` : "") + newJobHtml,
            });
          } catch (e) {
            console.error("[Job] Failed to email seeker:", seeker.email, e.message);
          }
        }
      }
      if (seekers.length > 0) console.log("[Job] Notified", seekers.length, "job seeker(s) about new job");
    } catch (e) {
      console.error("[Job] Notify seekers failed:", e.message);
    }

    res.status(201).json(job);
  } catch (err) {
    console.error("[Job] Error – job NOT saved to DB:", err.name, err.message);
    res.status(500).json({ message: err.message || "Failed to create job" });
  }
};

export const getJobs = async (req, res) => {
  const { page = 1, limit = 10, location, company, skills, search } = req.query;

  const query = { status: "APPROVED" };

  if (location) query.location = location;
  if (company) query.company = company;
  if (skills) query.skills = { $in: [skills] };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const jobs = await Job.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Job.countDocuments(query);

  res.json({
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    jobs,
  });
};

export const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("postedBy", "name email");
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};

export const getMyJobs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const query = { postedBy: req.user.id };
  const jobs = await Job.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  const total = await Job.countDocuments(query);
  res.json({ total, page: Number(page), pages: Math.ceil(total / limit), jobs });
};
