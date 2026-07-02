import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { requireAdmin } from "../middlewares/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", requireAdmin, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileType = req.file.mimetype.startsWith("video/") ? "video" : "image";
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "media-showcase",
      resource_type: fileType
    });

    res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
      type: fileType
    });
  } catch (error) {
    next(error);
  }
});

export default router;

