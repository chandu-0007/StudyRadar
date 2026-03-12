import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { initializeSocket } from "./socket";
import authRoutes from "./routes/auth";
import resourceRoutes from "./routes/resources";
import subjectRoutes from "./routes/subjects";
import dashboardRoutes from "./routes/dashboard";
import chatRoutes from "./routes/chat.routes";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.IO
initializeSocket(httpServer);

app.use(cors());
app.use(express.json());

// Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);

// Basic health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "API is healthy!" });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
