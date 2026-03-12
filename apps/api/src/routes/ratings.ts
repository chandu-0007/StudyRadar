import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { InteractionController } from "../controllers/interactionController";

const router = Router();

// POST /api/ratings
router.post("/", requireAuth, InteractionController.rateResource);

// GET /api/ratings/:id
router.get("/:id", InteractionController.getRating); // Can be consumed publicly

export default router;
