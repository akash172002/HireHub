import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = "raw") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (skills !== undefined) {
      updates.skills = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Upload profile photo if provided
    if (req.files?.photo?.[0]) {
      const file = req.files.photo[0];
      const result = await uploadToCloudinary(file.buffer, "hirehub/photos", "image");
      updates.profilePhoto = result.secure_url;
    }

    // Upload resume if provided
    if (req.files?.resume?.[0]) {
      const file = req.files.resume[0];
      const result = await uploadToCloudinary(file.buffer, "hirehub/resumes", "raw");
      updates.resume = result.secure_url;
      updates.resumePublicId = result.public_id;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update profile" });
  }
};

export const getResumeUrl = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("resume resumePublicId").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.resume) return res.status(404).json({ message: "No resume uploaded" });
    res.json({ url: user.resume });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch resume" });
  }
};
