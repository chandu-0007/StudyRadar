import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../prisma";

export class DashboardController {
  static async getTeacherAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;
      const department = req.user!.department;

      if (role !== "TEACHER" && role !== "ADMIN") {
        res.status(403).json({ success: false, message: "Unauthorized. Teachers only." });
        return;
      }

      // 1. Total resources uploaded by this teacher
      const myResources = await prisma.resource.findMany({
        where: { userId },
        select: { downloadCount: true, status: true, title: true, subject: { select: { name: true } } }
      });

      const totalResources = myResources.length;

      // 2. Total downloads of this teacher's resources
      const totalDownloads = myResources.reduce((sum, r) => sum + (r.downloadCount || 0), 0);
      
      // 3. Pending resources waiting for approval in the teacher's department
      const pendingResourcesCount = await prisma.resource.count({
        where: { department: department as any, status: "PENDING" }
      });

      // 4. Most downloaded resource
      const sorted = [...myResources].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
      const topResourceData = sorted[0];
      const topResource = topResourceData ? {
        title: topResourceData.title,
        downloads: topResourceData.downloadCount || 0
      } : { title: "N/A", downloads: 0 };

      // 5. Resources grouped by subject
      const subjectCounts: Record<string, number> = {};
      myResources.forEach(r => {
        const subjectName = r.subject ? r.subject.name : "Unassigned";
        subjectCounts[subjectName] = (subjectCounts[subjectName] || 0) + 1;
      });

      const resourcesBySubject = Object.entries(subjectCounts).map(([subject, count]) => ({
        subject, count
      }));

      res.status(200).json({
        success: true,
        data: {
          totalResources,
          totalDownloads,
          pendingResources: pendingResourcesCount,
          topResource,
          resourcesBySubject
        }
      });
    } catch (error) {
      console.error("TeacherAnalytics Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
