import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET /api/subjects
router.get("/", async (req, res) => {
  try {
    let subjects = await prisma.subject.findMany({
      orderBy: { code: 'asc' }
    });

    // If no subjects exist, seed a few default subjects so the frontend doesn't break
    if (subjects.length === 0) {
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
        orderBy: { code: 'asc' }
      });
    }

    res.status(200).json({ success: true, subjects });
  } catch (error) {
    console.error("Fetch Subjects Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
