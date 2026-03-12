import prisma from "../prisma";
import cloudinary from "../config/cloudinary";
import { Prisma, User } from "@prisma/client";
import { resourceUploadSchema } from "../validators/resourceValidator";
import { z } from "zod";

type ResourceUploadData = z.infer<typeof resourceUploadSchema>;

/**
 * Creates a new resource, saves it to the database, and associates it with the uploader.
 * The resource status is set based on the user's role.
 */
export const createResource = async (
    data: ResourceUploadData,
    file: Express.Multer.File,
    user: User
) => {
    const resourceStatus =
        user.role === "STUDENT" && !user.isSenior ? "PENDING" : "APPROVED";

    let fileType: Prisma.FileType = "DOC";
    const mime = file.mimetype || "";
    if (mime.includes("pdf")) fileType = "PDF";
    else if (mime.includes("powerpoint") || mime.includes("presentation"))
        fileType = "PPT";
    else if (mime.includes("video")) fileType = "VIDEO";

    const newResource = await prisma.resource.create({
        data: {
            title: data.title,
            description: data.description,
            type: data.type,
            subjectId: data.subjectId,
            semester: data.semester,
            department: user.department,
            unit: data.unit ? parseInt(data.unit) : null,
            year: data.year ? parseInt(data.year) : null,
            examYear: data.examYear ? parseInt(data.examYear) : null,
            examType: data.examType,
            syllabusMatch: data.syllabusMatch !== "false",
            fileUrl: file.path,
            publicId: file.filename,
            fileType: fileType,
            fileSize: file.size,
            mimeType: mime,
            userId: user.id,
            status: resourceStatus,
        },
    });

    return newResource;
};

/**
 * Retrieves a list of resources with filtering and pagination.
 */
export const getResources = async (filters: {
    department?: string;
    semester?: string;
    subjectId?: string;
    type?: string;
    status?: string;
    page: number;
    limit: number;
}) => {
    const { department, semester, subjectId, type, status, page, limit } = filters;
    const where: Prisma.ResourceWhereInput = {
        status: status ? (status as Prisma.ResourceStatus) : "APPROVED", // Default to APPROVED
    };

    if (department) where.department = department as Prisma.Department;
    if (semester) where.semester = semester as Prisma.Semester;
    if (subjectId) where.subjectId = subjectId;
    if (type) where.type = type as Prisma.ResourceType;

    const resources = await prisma.resource.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { uploadedBy: { select: { username: true, profileImage: true } } },
    });

    const totalResources = await prisma.resource.count({ where });

    return {
        resources,
        totalPages: Math.ceil(totalResources / limit),
        currentPage: page,
    };
};

/**
 * Retrieves a single resource by its ID, including related data.
 */
export const getResourceById = async (id: string) => {
    return await prisma.resource.findUnique({
        where: { id },
        include: {
            ratings: { include: { user: { select: { username: true } } } },
            comments: { include: { user: { select: { username: true, profileImage: true } } } },
            tags: { include: { tag: true } },
            uploadedBy: { select: { username: true, profileImage: true, role: true } },
        },
    });
};

/**
 * Deletes a resource from Cloudinary and the database.
 * Ensures all related records are removed in a transaction.
 */
export const deleteResource = async (resourceId: string) => {
    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource) {
        throw new Error("Resource not found");
    }

    // Delete from Cloudinary first
    if (resource.publicId) {
        await cloudinary.uploader.destroy(resource.publicId);
    }

    // Use a transaction to delete the resource and all its related records
    return await prisma.$transaction([
        prisma.rating.deleteMany({ where: { resourceId } }),
        prisma.bookmark.deleteMany({ where: { resourceId } }),
        prisma.comment.deleteMany({ where: { resourceId } }),
        prisma.resourceTag.deleteMany({ where: { resourceId } }),
        prisma.downloadHistory.deleteMany({ where: { resourceId } }),
        prisma.resource.delete({ where: { id: resourceId } }),
    ]);
};

/**
 * Handles the logic for a user downloading a resource.
 * Increments download count and records the download event.
 */
export const downloadResource = async (resourceId: string, userId: string) => {
    const [resource] = await prisma.$transaction([
        prisma.resource.update({
            where: { id: resourceId },
            data: { downloadCount: { increment: 1 } },
        }),
        prisma.downloadHistory.create({
            data: {
                userId,
                resourceId,
            },
        }),
    ]);
    return resource;
};

/**
 * Updates a resource's status to FLAGGED.
 */
export const reportResource = async (resourceId: string, reason: string) => {
    // In a real app, you might save the reason to a separate `Report` model.
    return await prisma.resource.update({
        where: { id: resourceId },
        data: { status: "FLAGGED" },
    });
};

/**
 * Updates a resource's status to APPROVED.
 */
export const approveResource = async (resourceId: string) => {
    return await prisma.resource.update({
        where: { id: resourceId },
        data: { status: "APPROVED" },
    });
};