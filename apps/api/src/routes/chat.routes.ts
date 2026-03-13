import { Router } from "express";
import prisma from "../prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { getIO } from "../socket";

const router = Router();

router.get("/rooms/:id/messages", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;

  const messages = await prisma.message.findMany({
    where: { roomId: id },
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profileImage: true,
        },
      },
    },
  });

  res.json(messages.reverse());
});

router.post("/messages", requireAuth, async (req: AuthRequest, res) => {
  const { roomId, text, imageUrl } = req.body;
  const userId = req.user?.userId;

  if (!roomId || (!text && !imageUrl) || !userId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const message = await prisma.message.create({
    data: {
      roomId,
      text,
      imageUrl,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profileImage: true,
        },
      },
    },
  });

  try {
    const io = getIO();
    io.to(roomId).emit("receive-message", message);
  } catch {}

  res.json(message);
});

export default router;