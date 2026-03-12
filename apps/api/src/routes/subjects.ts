import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// GET /api/subjects
router.get("/", async (req, res) => {
  try {
    const { semester, department } = req.query;

    const where: any = {};
    if (semester) where.semester = semester as string;
    if (department) where.department = department as string;

    let subjects = await prisma.subject.findMany({
      where,
      orderBy: { code: 'asc' }
    });

    // If no subjects exist at all, seed a few default subjects so the frontend doesn't break
    const countAll = await prisma.subject.count();
    if (countAll === 0) {
      await prisma.subject.createMany({
        data: [
          { name: 'Data Structures and Algorithms', code: 'CS201', department: 'CSE', semester: 'SEM3' },
          { name: 'Operating Systems', code: 'CS301', department: 'CSE', semester: 'SEM5' },
          { name: 'Database Management Systems', code: 'CS401', department: 'CSE', semester: 'SEM4' },
          { name: 'Engineering Physics', code: 'PH101', department: 'ECE', semester: 'SEM1' },
          { name: 'Basic Electrical Engineering', code: 'EE101', department: 'EEE', semester: 'SEM2' },
        ],
        skipDuplicates: true
      });
      subjects = await prisma.subject.findMany({
        where,
        orderBy: { code: 'asc' }
      });
    }

    res.status(200).json({ success: true, subjects });
  } catch (error) {
    console.error("Fetch Subjects Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/subjects
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, code, semester, department } = req.body;
    
    // Check if user is teacher or admin
    if (!req.user || !["TEACHER", "ADMIN"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Unauthorized. Teachers only." });
    }

    if (!name || !semester || !department) {
      return res.status(400).json({ success: false, message: "Name, semester, and department are required." });
    }

    // code is optional, create one if not provided (temp logic)
    const generatedCode = code || `SUB-${Math.floor(1000 + Math.random() * 9000)}`;

    const subject = await prisma.subject.create({
      data: {
        name,
        code: generatedCode,
        semester: semester as any,
        department: department as any,
      }
    });

    res.status(201).json({ success: true, subject });
  } catch (error: any) {
    console.error("Create Subject Error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: "Subject with this code and department already exists." });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
