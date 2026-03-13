import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { AdminController } from "../controllers/adminController";

const router = Router();

router.post(
  "/approve-teacher/:userId",
  requireAuth,
  requireAdmin,
  AdminController.approveTeacher
);

router.post(
  "/reject-teacher/:userId",
  requireAuth,
  requireAdmin,
  AdminController.rejectTeacher
);

router.get(
  "/pending-teachers",
  requireAuth,
  requireAdmin,
  AdminController.pendingTeachers
);

export default router;

