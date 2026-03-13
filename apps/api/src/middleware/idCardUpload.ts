import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "..", "uploads", "idcards");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}_${safeName}`);
  },
});

export const idCardUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

