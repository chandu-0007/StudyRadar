import { Router } from "express";
import prisma from "../prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const SEMESTERS = new Set(["SEM1", "SEM2", "SEM3", "SEM4", "SEM5", "SEM6", "SEM7", "SEM8"]);
const DEPARTMENTS = new Set(["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"]);

// GET /api/subjects
router.get("/", async (req, res) => {
  try {
    const { semester, department } = req.query;

    const where: any = {};
    if (semester) {
      const sem = String(semester).toUpperCase();
      if (!SEMESTERS.has(sem)) {
        return res.status(400).json({ success: false, message: "Invalid semester." });
      }
      where.semester = sem;
    }
    if (department) {
      const dept = String(department).toUpperCase();
      if (!DEPARTMENTS.has(dept)) {
        return res.status(400).json({ success: false, message: "Invalid department." });
      }
      where.department = dept;
    }

    let subjects = await prisma.subject.findMany({
      where,
      orderBy: { code: "asc" },
      include: { _count: { select: { resources: true } } },
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
        orderBy: { code: "asc" },
        include: { _count: { select: { resources: true } } },
      });
    }

    res.status(200).json({ success: true, subjects });
  } catch (error) {
    console.error("Fetch Subjects Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/subjects/:id (Fetch specific subject details)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: { _count: { select: { resources: true } } }
    });
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });
    res.status(200).json({ success: true, subject });
  } catch (error) {
    console.error("Fetch Subject Error:", error);
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
