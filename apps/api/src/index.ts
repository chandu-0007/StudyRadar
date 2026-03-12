import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import resourceRoutes from "./routes/resources";
import subjectRoutes from "./routes/subjects";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/subjects", subjectRoutes);

// Basic health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "API is healthy!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
