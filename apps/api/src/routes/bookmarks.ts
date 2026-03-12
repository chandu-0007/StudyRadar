import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { BookmarkController } from "../controllers/bookmarkController";

const router = Router();

// GET /api/bookmarks
// Get all bookmarks for the logged in user
router.get("/", requireAuth, BookmarkController.getUserBookmarks);

export default router;
