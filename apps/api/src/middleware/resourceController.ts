import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as resourceService from "../services/resourceService";
import { resourceUploadSchema } from "../validators/resourceValidator";
import cloudinary from "../config/cloudinary";
import prisma from "../prisma";

export const uploadResource = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "File is required." });
        }

        const validation = resourceUploadSchema.safeParse(req.body);
        if (!validation.success) {
            await cloudinary.uploader.destroy(req.file.filename);
            return res.status(400).json({ success: false, message: "Validation failed", errors: validation.error.issues });
        }

        const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const newResource = await resourceService.createResource(validation.data, req.file, user);
        res.status(201).json({ success: true, message: "Resource uploaded successfully. It will be reviewed by a moderator.", resource: newResource });

    } catch (error) {
        console.error("Upload Error:", error);
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getResources = async (req: AuthRequest, res: Response) => {
    try {
        const { department, semester, subjectId, type, status } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await resourceService.getResources({
            department: department as string,
            semester: semester as string,
            subjectId: subjectId as string,
            type: type as string,
            status: status as string,
            page,
            limit,
        });

        res.status(200).json({ success: true, ...result });
    } catch (error) {
        console.error("Get Resources Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getResourceById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const resource = await resourceService.getResourceById(id);
        if (!resource) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }
        res.status(200).json({ success: true, resource });
    } catch (error) {
        console.error("Get Resource By ID Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const deleteResource = async (req: AuthRequest, res: Response) => {
    try {
        const resourceId = req.params.id;
        const userPayload = req.user!;

        const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
        if (!resource) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }

        const isOwner = resource.userId === userPayload.userId;
        const canDelete = isOwner || ["ADMIN", "SENIOR", "MODERATOR"].includes(userPayload.role);

        if (!canDelete) {
            return res.status(403).json({ success: false, message: "You don't have permission to delete this resource" });
        }

        await resourceService.deleteResource(resourceId);
        res.status(200).json({ success: true, message: "Resource deleted successfully" });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const downloadResource = async (req: AuthRequest, res: Response) => {
    try {
        const resourceId = req.params.id;
        const userId = req.user!.userId;

        const resource = await resourceService.downloadResource(resourceId, userId);
        if (!resource) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }

        res.status(200).json({ success: true, fileUrl: resource.fileUrl });
    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const reportResource = async (req: AuthRequest, res: Response) => {
    try {
        const resourceId = req.params.id;
        const { reason } = req.body;
        const userPayload = req.user!;

        if (!reason) {
            return res.status(400).json({ success: false, message: "Report reason is required." });
        }

        // Using SENIOR, MODERATOR, ADMIN as "Teacher" roles
        const canReport = ["SENIOR", "MODERATOR", "ADMIN"].includes(userPayload.role);
        if (!canReport) {
            return res.status(403).json({ success: false, message: "Only faculty and moderators can flag resources." });
        }

        await resourceService.reportResource(resourceId, reason);
        res.status(200).json({ success: true, message: "Resource flagged successfully." });

    } catch (error) {
        console.error("Report Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const approveResource = async (req: AuthRequest, res: Response) => {
    try {
        const resourceId = req.params.id;
        const userPayload = req.user!;

        // Using SENIOR, MODERATOR, ADMIN as "Teacher" roles
        const canApprove = ["SENIOR", "MODERATOR", "ADMIN"].includes(userPayload.role);
        if (!canApprove) {
            return res.status(403).json({ success: false, message: "You do not have permission to approve resources." });
        }

        const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
        if (!resource) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }

        await resourceService.approveResource(resourceId);
        res.status(200).json({ success: true, message: "Resource approved successfully." });

    } catch (error) {
        console.error("Approve Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};