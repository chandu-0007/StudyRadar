import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import { Request } from "express";

// Storage Configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    // Attempting to dynamically build the folder path from request body
    // Note: Multer streams the file before the body is fully parsed in some cases,
    // so we provide fallbacks just in case the body hasn't fully arrived.
    const department = (req.body.department || "unknown-dept").toLowerCase();
    const semester = (req.body.semester || "unknown-sem").toLowerCase();
    const subject = (req.body.subjectId || "unknown-subject").toLowerCase();
    
    // college-resources/{department}/{semester}/{subject}
    const folderPath = `college-resources/${department}/${semester}/${subject}`;

    return {
      folder: folderPath,
      resource_type: "auto", // auto allows images, raw files like PDF, docs, videos
      // 'allowed_formats' forces certain extensions
      // allowed_formats: ["pdf", "ppt", "pptx", "doc", "docx", "png", "jpg", "jpeg", "mp4"], 
    };
  },
});

const upload = multer({ storage });

export default upload;
