import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { resourceUploadSchema, reportResourceSchema } from "../utils/validations";
import { ResourceService } from "../services/resourceService";
import cloudinary from "../config/cloudinary";

export class ResourceController {
  
  static async upload(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: "File is required." });
        return;
      }

      const fileUrl = req.file.path;
      const publicId = req.file.filename; 
      const sizeBytes = req.file.size || 0;
      
      let fileType: any = "DOC";
      const mime = req.file.mimetype || "";
      if (mime.includes("pdf")) fileType = "PDF";
      else if (mime.includes("powerpoint") || mime.includes("presentation")) fileType = "PPT";
      else if (mime.includes("video")) fileType = "VIDEO";

      const validation = resourceUploadSchema.safeParse(req.body);
      if (!validation.success) {
        await cloudinary.uploader.destroy(publicId);
        res.status(400).json({ success: false, message: "Validation failed", errors: validation.error.issues });
        return;
      }

      const newResource = await ResourceService.uploadResource(
        validation.data,
        { fileUrl, publicId, fileType, sizeBytes, mime },
        req.user!.userId
      );

      res.status(201).json({ success: true, message: "Resource uploaded successfully", resource: newResource });
    } catch (error: any) {
      console.error("Upload controller Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getResources(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const filters = {
        department: req.query.department,
        semester: req.query.semester,
        subjectId: req.query.subjectId,
        type: req.query.type,
        status: req.query.status
      };

      const result = await ResourceService.getResources(filters, page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      console.error("getResources Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getResourceById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const resource = await ResourceService.getResourceById(req.params.id as string);
      if (!resource) {
        res.status(404).json({ success: false, message: "Resource not found" });
        return;
      }
      res.status(200).json({ success: true, resource });
    } catch (error: any) {
      console.error("getResourceById Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async deleteResource(req: AuthRequest, res: Response): Promise<void> {
    try {
      await ResourceService.deleteResource(req.params.id as string, req.user!);
      res.status(200).json({ success: true, message: "Resource deleted successfully" });
    } catch (error: any) {
      if (error.message === "RESOURCE_NOT_FOUND") {
        res.status(404).json({ success: false, message: "Resource not found" });
      } else if (error.message === "UNAUTHORIZED") {
        res.status(403).json({ success: false, message: "You don't have permission to delete this resource" });
      } else {
        console.error("deleteResource Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  }

  static async downloadResource(req: AuthRequest, res: Response): Promise<void> {
    try {
      const fileUrl = await ResourceService.downloadResource(req.params.id as string, req.user!.userId);
      res.status(200).json({ success: true, fileUrl });
    } catch (error: any) {
      if (error.message === "RESOURCE_NOT_FOUND") {
        res.status(404).json({ success: false, message: "Resource not found" });
      } else {
        console.error("downloadResource Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  }

  static async reportResource(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validation = reportResourceSchema.safeParse(req.body);
      if (!validation.success) {
         res.status(400).json({ success: false, message: "Validation failed", errors: validation.error.issues });
         return;
      }

      await ResourceService.reportResource(req.params.id as string, req.user!, validation.data.reason);
      res.status(200).json({ success: true, message: "Resource flagged successfully." });
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        res.status(403).json({ success: false, message: "Only teachers or admins can report resources directly." });
      } else {
         console.error("reportResource Error:", error);
         res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  }

  static async approveResource(req: AuthRequest, res: Response): Promise<void> {
    try {
      await ResourceService.approveResource(req.params.id as string, req.user!);
      res.status(200).json({ success: true, message: "Resource approved successfully." });
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        res.status(403).json({ success: false, message: "Only teachers or admins can approve resources." });
      } else {
         console.error("approveResource Error:", error);
         res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  }
}
