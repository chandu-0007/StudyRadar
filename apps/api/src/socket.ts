import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import prisma from './prisma';

interface ServerToClientEvents {
    'receive-message': (message: any) => void;
    'error': (error: { message: string }) => void;
}

interface ClientToServerEvents {
    'join-room': (roomId: string) => void;
    'send-message': (data: { roomId: string; text?: string; imageUrl?: string; userId: string }) => void;
}

interface InterServerEvents {
    // Internal events if needed
}

interface SocketData {
    userId?: string;
}

let io: Server | undefined;

export const initializeSocket = (httpServer: HttpServer) => {
    io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
        cors: {
            origin: "*", // TODO: Restrict this to your frontend URL in production
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // 1. Join Room & Fetch History
        socket.on('join-room', async (roomId: string) => {
            try {
                socket.join(roomId);
                console.log(`Socket ${socket.id} joined room ${roomId}`);

                // Fetch last 20 messages efficiently using the new compound index
                const messages = await prisma.message.findMany({
                    where: { roomId },
                    take: 20,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: { id: true, username: true, profileImage: true }
                        }
                    }
                });

                // Send messages back to the user who just joined (reversed to show oldest first in chat UI)
                socket.emit('room-history', messages.reverse() as any); // Send explicit history event
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('error', { message: 'Failed to join room and load messages' });
            }
        });

        // 2. Send Message
        socket.on('send-message', async (data) => {
            const { roomId, text, imageUrl, userId } = data;

            // Basic validation
            if (!roomId || (!text && !imageUrl) || !userId) {
                return socket.emit('error', { message: 'Invalid payload' });
            }

            try {
                // Save to Prisma
                const savedMessage = await prisma.message.create({
                    data: {
                        text,
                        imageUrl,
                        roomId,
                        userId,
                    },
                    include: {
                        user: {
                            select: { id: true, username: true, profileImage: true }
                        }
                    }
                });

                // Broadcast to everyone in the room (including sender)
                // Engineering Decision: Broadcasting allows for optimistic UI updates on client
                // or simply confirming the server received it.
                if (!io) throw new Error('Socket.io not initialized');
                io.to(roomId).emit('receive-message', savedMessage);

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};