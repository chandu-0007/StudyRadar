import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { InteractionService } from "../services/interactionService";

export class InteractionController {
  static async rateResource(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      // Allow resourceId from body or params (for flexibility)
      const resourceId = req.body.resourceId || req.params.id;
      const { rating, score, review } = req.body;
      
      const incomingScore = rating || score; // Support 'rating' key as requested

      if (!resourceId || incomingScore === undefined || typeof incomingScore !== 'number' || incomingScore < 1 || incomingScore > 5) {
         res.status(400).json({ success: false, message: "Valid rating between 1 and 5 and resourceId are required." });
         return;
      }

      const result = await InteractionService.addOrUpdateRating(userId, resourceId, Math.floor(incomingScore), review);
      res.status(200).json({ success: true, message: "Rating updated successfully.", data: result });
    } catch (error: any) {
      if (error.message === "RESOURCE_NOT_FOUND") {
        res.status(404).json({ success: false, message: "Resource not found." });
      } else {
        console.error("rateResource Error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
      }
    }
  }

  static async getRating(req: AuthRequest, res: Response): Promise<void> {
    try {
       const resourceId = req.params.id;
       const userId = req.user?.userId; // Optional, might be unauthenticated mostly, but we use AuthRequest so it is present

       if (!resourceId) {
          res.status(400).json({ success: false, message: "Resource ID is required." });
          return;
       }

       const data = await InteractionService.getResourceRatings(resourceId, userId);
       res.status(200).json({ success: true, ...data });
    } catch (error: any) {
       console.error("getRating Error:", error);
       res.status(500).json({ success: false, message: "Internal server error." });
    }
  }

  static async addComment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const resourceId = req.body.resourceId || req.params.id;
      const { comment, text } = req.body;
      
      const incomingText = comment || text;

      if (!resourceId || !incomingText || typeof incomingText !== 'string') {
         res.status(400).json({ success: false, message: "Valid comment text and resourceId are required." });
         return;
      }

      const newComment = await InteractionService.addComment(userId, resourceId, incomingText);
      res.status(201).json({ success: true, message: "Comment added successfully.", comment: newComment });
    } catch (error: any) {
      if (error.message === "RESOURCE_NOT_FOUND") {
        res.status(404).json({ success: false, message: "Resource not found." });
      } else {
        console.error("addComment Error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
      }
    }
  }

  static async getComments(req: AuthRequest, res: Response): Promise<void> {
    try {
       const resourceId = req.params.id;

       if (!resourceId) {
          res.status(400).json({ success: false, message: "Resource ID is required." });
          return;
       }

       const comments = await InteractionService.getComments(resourceId);
       res.status(200).json({ success: true, comments });
    } catch (error: any) {
       console.error("getComments Error:", error);
       res.status(500).json({ success: false, message: "Internal server error." });
    }
  }
}
