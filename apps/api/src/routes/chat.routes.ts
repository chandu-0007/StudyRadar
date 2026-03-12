import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { getIO } from '../socket';

const router = Router();

/**
 * GET /rooms/:id/messages
 * Fetch the last 20 messages for a specific room.
 * Uses the composite index [roomId, createdAt] for performance.
 */
router.get('/rooms/:id/messages', requireAuth, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const messages = await prisma.message.findMany({
            where: { roomId: id },
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true
                    }
                }
            }
        });

        // Return in chronological order (oldest to newest)
        res.json(messages.reverse());
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

/**
 * POST /messages
 * Send a message via HTTP (fallback or alternative to Socket.IO).
 */
router.post('/messages', requireAuth, async (req: Request, res: Response) => {
    const { roomId, text, imageUrl } = req.body;
    // Assuming the auth middleware attaches the user object/ID to req.user
    const userId = (req as AuthRequest).user?.userId || req.body.userId;

    if (!roomId || (!text && !imageUrl) || !userId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        const newMessage = await prisma.message.create({
            data: {
                roomId,
                text,
                imageUrl,
                userId
            },
            include: {
                user: {
                    select: { id: true, username: true, profileImage: true }
                }
            }
        });

        // Broadcast to real-time users in the room
        try {
            const io = getIO();
            io.to(roomId).emit('receive-message', newMessage);
        } catch (error) {
            console.warn('Socket not initialized, skipping broadcast');
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;