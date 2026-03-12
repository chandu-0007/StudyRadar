import { Router, Response } from "express";
import { AuthRequest, requireAuth } from "../middleware/auth";
import upload from "../middleware/upload";
import { z } from "zod";
import prisma from "../prisma";
import cloudinary from "../config/cloudinary";

const router = Router();

// Zod schema for validating standard string fields from multer form-data
const resourceUploadSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["NOTES", "PPT", "PAST_PAPER", "LAB_MANUAL", "TEXTBOOK", "SYLLABUS", "VIDEO", "LINK", "OTHER"]),
  subjectId: z.string().uuid(),
  semester: z.enum(["SEM1", "SEM2", "SEM3", "SEM4", "SEM5", "SEM6", "SEM7", "SEM8"]),
  unit: z.string().optional(),
  
  description: z.string().optional(),
  year: z.string().optional(),
  syllabusMatch: z.enum(["true", "false"]).optional(),
  
  // Specific to PAST_PAPER
  examYear: z.string().optional(),
  examType: z.enum(["MID_SEM", "END_SEM"]).optional()
}).refine(data => {
  if (data.type === "PAST_PAPER") {
    return data.examYear !== undefined && data.examType !== undefined;
  }
  return true;
}, {
  message: "examYear and examType are required when type is PAST_PAPER",
  path: ["examType"],
});

// UPLOAD RESOURCE API
router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: "File is required." });
        return;
      }

      // Multer storage-cloudinary attaches Cloudinary details to req.file
      const fileUrl = req.file.path;
      // Cloudinary filename without extension is stored in filename by multer-storage-cloudinary
      const publicId = req.file.filename; 
      const sizeBytes = req.file.size || 0;
      
      let fileType: any = "DOC";
      const mime = req.file.mimetype || "";
      if (mime.includes("pdf")) fileType = "PDF";
      else if (mime.includes("powerpoint") || mime.includes("presentation")) fileType = "PPT";
      else if (mime.includes("video")) fileType = "VIDEO";

      const validation = resourceUploadSchema.safeParse(req.body);
      if (!validation.success) {
        // If validation fails, we should technically delete the uploaded file from Cloudinary to not waste space
        await cloudinary.uploader.destroy(publicId);
        res.status(400).json({ success: false, message: "Validation failed", errors: validation.error.issues });
        return;
      }

      const data = validation.data;
      const userPayload = req.user!;

      // Determine required automatic fields (department, userId, status)
      // Since `userPayload` has department from JWT, we can use it directly or fetch fresh from DB
      const uploader = await prisma.user.findUnique({ where: { id: userPayload.userId } });
      if (!uploader) {
        res.status(404).json({ success: false, message: "User not found." });
        return;
      }

      // Status logic: Teachers/Seniors are APPROVED instantly. Students are PENDING.
      // (Assuming roles includes TEACHER, but schema uses SENIOR/MODERATOR/ADMIN vs STUDENT. Lets map non-student to approved)
      const resourceStatus = (uploader.role === "STUDENT" && !uploader.isSenior) ? "PENDING" : "APPROVED";

      // Insert directly into DB
      const newResource = await prisma.resource.create({
        data: {
          title: data.title,
          description: data.description || null,
          type: data.type as any,
          subjectId: data.subjectId,
          semester: data.semester as any,
          department: uploader.department,
          unit: data.unit && data.unit !== "All" ? parseInt(data.unit) : null,
          year: data.year ? parseInt(data.year) : null,
          
          examYear: data.examYear ? parseInt(data.examYear) : null,
          examType: data.examType as any,
          
          syllabusMatch: data.syllabusMatch === "false" ? false : true,
          
          fileUrl: fileUrl,
          publicId: publicId,
          fileType: fileType,
          fileSize: sizeBytes,
          mimeType: mime,
          
          userId: uploader.id,
          status: resourceStatus,
        }
      });

      res.status(201).json({
        success: true,
        message: "Resource uploaded successfully",
        resource: newResource
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);

// DELETE RESOURCE API
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resourceId = req.params.id;
    const userPayload = req.user!;

    const resource = await prisma.resource.findUnique({ where: { id: resourceId }});
    if (!resource) {
      res.status(404).json({ success: false, message: "Resource not found" });
      return;
    }

    // Role check: Admin, Moderator, or the uploader themselves
    const isOwner = resource.userId === userPayload.userId;
    const canDelete = isOwner || ["ADMIN", "MODERATOR"].includes(userPayload.role);

    if (!canDelete) {
      res.status(403).json({ success: false, message: "You don't have permission to delete this resource" });
      return;
    }

    // Delete from Cloudinary
    if (resource.publicId) {
      await cloudinary.uploader.destroy(resource.publicId);
    }

    // Delete from DB (might break foreign keys like ratings/bookmarks if using restrict)
    // To be safe, usually handle cascaded delete or just mark `deletedAt = new Date()` (soft delete).
    // The prompt says "Remove record from database", so we'll hard delete.
    // If you have constraints enabled, we need to delete ratings/bookmarks first.
    // We will do a Prisma delete.
    
    // First clear ratings and bookmarks tied to this resource
    await prisma.rating.deleteMany({ where: { resourceId } });
    await prisma.bookmark.deleteMany({ where: { resourceId } });
    await prisma.comment.deleteMany({ where: { resourceId } });
    await prisma.resourceTag.deleteMany({ where: { resourceId } });

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    res.status(200).json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// REPORT RESOURCE API
router.post("/:id/report", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resourceId = req.params.id;
    const { reason } = req.body;
    const userPayload = req.user!;

    if (!reason) {
      res.status(400).json({ success: false, message: "Report reason is required." });
      return;
    }

    // You mentioned "Teachers can report". We treat SENIOR/MODERATOR/ADMIN as teachers
    const canReport = ["SENIOR", "MODERATOR", "ADMIN"].includes(userPayload.role);
    if (!canReport) {
      res.status(403).json({ success: false, message: "Only faculty and seniors can flag resources directly." });
      return;
    }

    // Set resource status to FLAGGED
    await prisma.resource.update({
      where: { id: resourceId },
      data: { status: "FLAGGED" },
    });

    res.status(200).json({ success: true, message: "Resource flagged successfully." });
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
