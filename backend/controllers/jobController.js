import Job from "../models/Job.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    postedBy: req.user.id,
    status: "PENDING",
  });

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "New Job Posted (Approval Required)",
    html: `
      <h3>New Job Posted</h3>
      <ul>
        <li><b>Role:</b> ${job.title}</li>
        <li><b>Company:</b> ${job.company}</li>
        <li><b>Salary:</b> ${job.salary}</li>
        <li.><b>Location:</b> ${job.location}</li.>
        <li><b>Job ID:</b> ${job._id}</li>
      </ul>
      <p>Please review and approve.</p>
    `,
  });

  res.status(201).json(job);
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
