import { Request, Response } from "express";
import prisma from "../prisma";

export class AdminController {
  static async approveTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const teacher = await prisma.user.findFirst({
        where: { id: userId, role: "TEACHER" },
      });

      if (!teacher) {
        res.status(404).json({ success: false, message: "Teacher not found" });
        return;
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          verified: true,
          status: "APPROVED",
        },
      });

      res.status(200).json({
        success: true,
        message: "Teacher account approved",
        data: { userId: updated.id, status: updated.status },
      });
    } catch (error) {
      console.error("approveTeacher error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async rejectTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { reason } = req.body as { reason?: string };

      const teacher = await prisma.user.findFirst({
        where: { id: userId, role: "TEACHER" },
      });

      if (!teacher) {
        res.status(404).json({ success: false, message: "Teacher not found" });
        return;
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          verified: false,
          status: "REJECTED",
        },
      });

      res.status(200).json({
        success: true,
        message: "Teacher account rejected",
        data: { userId: updated.id, status: updated.status, reason: reason || null },
      });
    } catch (error) {
      console.error("rejectTeacher error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async pendingTeachers(_req: Request, res: Response): Promise<void> {
    try {
      const teachers = await prisma.user.findMany({
        where: {
          role: "TEACHER",
          status: "PENDING",
        },
        select: {
          id: true,
          username: true,
          email: true,
          employeeId: true,
          department: true,
          college: true,
          designation: true,
          idCardImage: true,
          createdAt: true,
        },
      });

      res.status(200).json({
        success: true,
        data: teachers,
      });
    } catch (error) {
      console.error("pendingTeachers error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}

