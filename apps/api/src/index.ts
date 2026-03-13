import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { initializeSocket } from "./socket";

import authRoutes from "./routes/auth";
import resourceRoutes from "./routes/resources";
import subjectRoutes from "./routes/subjects";
import dashboardRoutes from "./routes/dashboard";
import chatroutes from "./routes/chat.routes";
import bookmarkRoutes from "./routes/bookmarks";
import adminRoutes from "./routes/admin";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;

// ✅ CORS configuration (IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Initialize Socket.IO
initializeSocket(httpServer);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatroutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/admin", adminRoutes);
// Health route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "API is healthy!" });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});