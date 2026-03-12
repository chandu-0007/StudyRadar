import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { InteractionController } from "../controllers/interactionController";

const router = Router();

// POST /api/comments
router.post("/", requireAuth, InteractionController.addComment);

// GET /api/comments/:id
router.get("/:id", InteractionController.getComments);

export default router;
