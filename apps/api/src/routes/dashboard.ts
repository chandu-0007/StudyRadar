import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { DashboardController } from "../controllers/dashboardController";

const router = Router();

// GET /api/dashboard/teacher-analytics
router.get("/teacher-analytics", requireAuth, DashboardController.getTeacherAnalytics);

export default router;
