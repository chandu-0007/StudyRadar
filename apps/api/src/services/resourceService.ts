import prisma from "../prisma";
import cloudinary from "../config/cloudinary";
import { any } from "zod";

export class ResourceService {
  /**
   * Automatically assigns status based on user role.
   * TEACHER/SENIOR/MODERATOR/ADMIN -> APPROVED. STUDENT -> PENDING.
   */
  static async uploadResource(data: any, fileMeta: any, userId: string) {
    const uploader = await prisma.user.findUnique({ where: { id: userId } });
    if (!uploader) throw new Error("User not found.");

    const isTeacherRole = ["TEACHER", "ADMIN"].includes(uploader.role);
    const status = isTeacherRole ? "APPROVED" : "PENDING";

    try {
      return await prisma.resource.create({
        data: {
          title: data.title,
          description: data.description || null,
          type: data.type as any,
          subjectId: data.subjectId,
          semester: data.semester as any,
          department: uploader.department,
          unit: data.unit && data.unit !== "All" ? parseInt(data.unit) : null,
          year: data.year ? parseInt(data.year) : null,
          
          examDate : data.examDate ||null ,
          examType: data.examType as any,
          
          syllabusMatch: data.syllabusMatch === "false" ? false : true,
          
          fileUrl: fileMeta.fileUrl,
          publicId: fileMeta.publicId,
          fileType: fileMeta.fileType,
          fileSize: fileMeta.sizeBytes,
          mimeType: fileMeta.mime,
          
          userId: uploader.id,
          status: status,
        }
      });
    } catch (error) {
      // Prisma error occurred -> delete from cloudinary
      if (fileMeta.publicId) {
        await cloudinary.uploader.destroy(fileMeta.publicId).catch(console.error);
      }
      throw error;
    }
  }

  static async getResources(filters: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.department) where.department = filters.department;
    if (filters.semester) where.semester = filters.semester;
    if (filters.subjectId) where.subjectId = filters.subjectId;
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status; // Often defaults to APPROVED

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          subject: { select: { name: true, code: true } },
          uploadedBy: { select: { username: true, role: true } }
        }
      }),
      prisma.resource.count({ where })
    ]);

    return { resources, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async getResourceById(id: string) {
    return prisma.resource.findUnique({
      where: { id },
      include: {
        ratings: { include: { user: { select: { username: true } } } },
        comments: { include: { user: { select: { username: true } } } },
        tags: { include: { tag: true } },
        subject: true,
        uploadedBy: { select: { username: true, role: true, department: true } }
      }
    });
  }

  static async deleteResource(id: string, userPayload: any) {
    const resource = await prisma.resource.findUnique({ where: { id } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");

    const isOwner = resource.userId === userPayload.userId;
    const isTeacherOrAdmin = ["TEACHER", "ADMIN"].includes(userPayload.role);

    if (!isOwner && !isTeacherOrAdmin) {
      throw new Error("UNAUTHORIZED");
    }

    // Wrap in a transaction or manual sequential execution
    // Cleanup foreign constraints first
    await prisma.rating.deleteMany({ where: { resourceId: id } });
    await prisma.bookmark.deleteMany({ where: { resourceId: id } });
    await prisma.comment.deleteMany({ where: { resourceId: id } });
    await prisma.resourceTag.deleteMany({ where: { resourceId: id } });
    await prisma.downloadHistory.deleteMany({ where: { resourceId: id } });

    // Delete actual resource
    await prisma.resource.delete({ where: { id } });

    // Delete from Cloudinary
    if (resource.publicId) {
      await cloudinary.uploader.destroy(resource.publicId).catch(console.error);
    }

    return true;
  }

  static async downloadResource(id: string, userId: string) {
    const resource = await prisma.resource.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
      select: { fileUrl: true }
    });

    if (!resource) throw new Error("RESOURCE_NOT_FOUND");

    // Track download
    await prisma.downloadHistory.create({
      data: {
        resourceId: id,
        userId: userId
      }
    });

    return resource.fileUrl;
  }

  static async reportResource(id: string, userPayload: any, reason: string) {
    const canReport = ["TEACHER", "ADMIN"].includes(userPayload.role);
    if (!canReport) {
      throw new Error("UNAUTHORIZED");
    }

    return prisma.resource.update({
      where: { id },
      data: { status: "FLAGGED" }
    });
  }

  static async approveResource(id: string, userPayload: any) {
    const canApprove = ["TEACHER", "ADMIN"].includes(userPayload.role);
    if (!canApprove) {
      throw new Error("UNAUTHORIZED");
    }

    return prisma.resource.update({
      where: { id },
      data: { status: "APPROVED" }
    });
  }
}
