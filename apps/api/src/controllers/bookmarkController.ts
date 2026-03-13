import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { BookmarkService } from "../services/bookmarkService";

export class BookmarkController {
  static async addBookmark(req: AuthRequest, res: Response): Promise<void> {
    try {
      const resourceId = req.params.id;
      const userId = req.user!.userId;

      if (!resourceId) {
         res.status(400).json({ success: false, message: "Resource ID is required." });
         return;
      }

      await BookmarkService.addBookmark(userId, resourceId);
      res.status(200).json({ success: true, message: "Resource bookmarked successfully." });
    } catch (error: any) {
      if (error.message === "RESOURCE_NOT_FOUND") {
        res.status(404).json({ success: false, message: "Resource not found." });
      } else {
        console.error("addBookmark Error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
      }
    }
  }

  static async removeBookmark(req: AuthRequest, res: Response): Promise<void> {
    try {
      const resourceId = req.params.id;
      const userId = req.user!.userId;

      if (!resourceId) {
         res.status(400).json({ success: false, message: "Resource ID is required." });
         return;
      }

      await BookmarkService.removeBookmark(userId, resourceId);
      res.status(200).json({ success: true, message: "Bookmark removed successfully." });
    } catch (error: any) {
      console.error("removeBookmark Error:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  }

  static async getUserBookmarks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const bookmarks = await BookmarkService.getUserBookmarks(userId);
      res.status(200).json({ success: true, bookmarks });
    } catch (error: any) {
      console.error("getUserBookmarks Error:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  }

  static async checkBookmarkStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const resourceId = req.params.id;
      const userId = req.user!.userId;

      if (!resourceId) {
         res.status(400).json({ success: false, message: "Resource ID is required." });
         return;
      }

      const isBookmarked = await BookmarkService.isBookmarked(userId, resourceId);

      res.status(200).json({ success: true, isBookmarked });
    } catch (error: any) {
      console.error("checkBookmarkStatus Error:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  }
}
