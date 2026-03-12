import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import upload from "../middleware/upload";
import { ResourceController } from "../controllers/resourceController";
import { BookmarkController } from "../controllers/bookmarkController";

const router = Router();

// GET /api/resources
// Get all resources with filtering and pagination
router.get("/", requireAuth, ResourceController.getResources);

// GET /api/resources/search
// Search for resources
router.get("/search", requireAuth, ResourceController.search);

// GET /api/resources/:id
// Get a single resource with all metadata (comments, tags, ratings)
router.get("/:id", requireAuth, ResourceController.getResourceById);

// POST /api/resources/upload
// Upload a new resource
router.post("/upload", requireAuth, upload.single("file"), ResourceController.upload);

// GET /api/resources/:id/download
// Download a resource and track download count
router.get("/:id/download", requireAuth, ResourceController.downloadResource);

// DELETE /api/resources/:id
// Delete a resource 
router.delete("/:id", requireAuth, ResourceController.deleteResource);

// POST /api/resources/:id/report
// Flag a resource as inappropriate/incorrect
router.post("/:id/report", requireAuth, ResourceController.reportResource);

// PATCH /api/resources/:id/approve
// Approve a pending resource
router.patch("/:id/approve", requireAuth, ResourceController.approveResource);

// POST /api/resources/:id/bookmark
// Bookmark a resource
router.post("/:id/bookmark", requireAuth, BookmarkController.addBookmark);

// DELETE /api/resources/:id/bookmark
// Remove a bookmarked resource
router.delete("/:id/bookmark", requireAuth, BookmarkController.removeBookmark);

// GET /api/resources/:id/bookmark-status
// Check if user has bookmarked a specific resource
router.get("/:id/bookmark-status", requireAuth, BookmarkController.checkBookmarkStatus);

export default router;
