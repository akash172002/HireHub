import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const getResumeUrl = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("resume resumePublicId");
    if (!user?.resume) return res.status(404).json({ message: "No resume found" });
    if (!user?.resumePublicId) return res.status(400).json({ message: "Please re-upload your resume." });

    const signedUrl = cloudinary.utils.private_download_url(user.resumePublicId, "", {
      resource_type: "raw",
      type: "authenticated",
      attachment: false,
      expires_at: Math.floor(Date.now() / 1000) + 600,
    });

    res.json({ url: signedUrl });
  } catch (err) {
    console.error("[Resume] error:", err.message);
    res.status(500).json({ message: "Failed to get resume URL" });
  }
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) console.error("[Profile] User not found in DB for id:", req.user.id);
  else console.log("[Profile] Fetched from DB | _id:", user._id, "| email:", user.email);
  res.json(user);
};

export const updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.skills && typeof updates.skills === "string") {
      updates.skills = updates.skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    if (req.files?.photo) {
      const photo = req.files.photo[0];
      const result = await cloudinary.uploader.upload(
        `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`,
        { folder: "profile_photos" }
      );
      updates.profilePhoto = result.secure_url;
    }

    /* ---------- RESUME PDF (Cloudinary raw – preserves original PDF) ---------- */
    if (req.files?.resume) {
      const resume = req.files.resume[0];

      if (resume.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Resume must be a PDF" });
      }

      const dataUri = `data:application/pdf;base64,${resume.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "resumes",
        resource_type: "raw",
        type: "authenticated",
        format: "pdf",
      });
      updates.resume = result.secure_url;
      updates.resumePublicId = result.public_id;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    console.log("[Profile] OK – Profile updated in DB | _id:", user?._id);
    res.json(user);
  } catch (err) {
    console.error("[Profile] Error – profile NOT updated:", err.name, err.message);
    res.status(500).json({ message: err.message });
  }
};
