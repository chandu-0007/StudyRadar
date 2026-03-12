import { Router } from "express";
import { AuthRequest, requireAuth } from "../middleware/auth";
import upload from "../middleware/upload";
import * as resourceController from "../controllers/resourceController";

const router = Router();

// GET all resources with filtering and pagination
router.get("/", requireAuth, resourceController.getResources);

// UPLOAD RESOURCE API
router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  resourceController.uploadResource
);

// GET a single resource by ID
router.get("/:id", requireAuth, resourceController.getResourceById);

// DELETE RESOURCE API
router.delete("/:id", requireAuth, resourceController.deleteResource);

// DOWNLOAD RESOURCE API
router.get("/:id/download", requireAuth, resourceController.downloadResource);

// APPROVE RESOURCE API
router.patch("/:id/approve", requireAuth, resourceController.approveResource);

// REPORT RESOURCE API
router.post("/:id/report", requireAuth, resourceController.reportResource);

export default router;
