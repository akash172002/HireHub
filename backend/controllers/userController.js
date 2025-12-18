import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import s3 from "../config/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

export const updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.files?.photo) {
      const photo = req.files.photo[0];
      const result = await cloudinary.uploader.upload(
        `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`,
        { folder: "profile_photos" }
      );
      updates.profilePhoto = result.secure_url;
    }

    /* ---------- RESUME PDF (AWS S3) ---------- */
    if (req.files?.resume) {
      const resume = req.files.resume[0];

      if (resume.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Resume must be a PDF" });
      }

      const fileKey = `resumes/${req.user.id}-${uuid()}.pdf`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: fileKey,
          Body: resume.buffer,
          ContentType: "application/pdf",
        })
      );

      updates.resume = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
