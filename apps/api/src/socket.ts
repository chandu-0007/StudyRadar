import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

let io: Server | undefined;

// store connected users
const onlineUsers: string[] = [];

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // JWT AUTH
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("Unauthorized"));

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    onlineUsers.push(socket.id);

    const ROOM_NAME = "global-room";

    // JOIN ROOM
    socket.on("join-room", (username: string) => {
      socket.join(ROOM_NAME);

      socket.emit("join-success", {
        message: "Joined successfully",
        room: ROOM_NAME,
      });

      io?.to(ROOM_NAME).emit("user-joined", {
        message: `${username} joined the chat`,
      });
    });

    // SEND MESSAGE
    socket.on(
      "send-message",
      (data: { username: string; text: string }) => {
        const { username, text } = data;

        if (!text) return;

        io?.to(ROOM_NAME).emit("receive-message", {
          user: username,
          text,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      const index = onlineUsers.indexOf(socket.id);
      if (index > -1) onlineUsers.splice(index, 1);

      io?.to(ROOM_NAME).emit("user-left", {
        message: `A user left the chat`,
      });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};