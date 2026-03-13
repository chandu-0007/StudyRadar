import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../prisma";
import { idCardUpload } from "../middleware/idCardUpload";

const router = Router();

const eduEmailCheck = (email: string) => email.toLowerCase().endsWith(".edu.in");

// STUDENT SIGNUP
const studentSignupSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  college: z.string().min(2),
  department: z.enum(["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"]),
  graduationYear: z.number().int().min(2000).max(2100),
  currentSem: z.enum(["SEM1", "SEM2", "SEM3", "SEM4", "SEM5", "SEM6", "SEM7", "SEM8"]),
});

router.post("/student/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = studentSignupSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.issues,
      });
      return;
    }

    const data = parseResult.data;

    if (!eduEmailCheck(data.email)) {
      res.status(400).json({
        success: false,
        message: "Email must be an academic address ending with .edu.in",
      });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email or username already exists.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        college: data.college,
        department: data.department,
        graduationYear: data.graduationYear,
        currentSem: data.currentSem,
        role: "STUDENT",
      },
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is missing.");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
        department: user.department,
        college: user.college,
        currentSem: user.currentSem,
        verified: user.verified,
        status: user.status,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Student registered successfully.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        college: user.college,
        currentSem: user.currentSem,
      },
    });
  } catch (error) {
    console.error("Student register error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// BACKWARD COMPATIBILITY: existing frontend calls POST /api/auth/signup
// For now, treat it as student registration.
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const role = String((req.body as any)?.role || "STUDENT").toUpperCase();
    if (role === "TEACHER") {
      res.status(400).json({
        success: false,
        message:
          "Teacher registration requires ID card upload. Use POST /api/auth/teacher/register with multipart/form-data.",
      });
      return;
    }

    const parseResult = studentSignupSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.issues,
      });
      return;
    }

    const data = parseResult.data;

    if (!eduEmailCheck(data.email)) {
      res.status(400).json({
        success: false,
        message: "Email must be an academic address ending with .edu.in",
      });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email.toLowerCase() }, { username: data.username }],
      },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email or username already exists.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        college: data.college,
        department: data.department,
        graduationYear: data.graduationYear,
        currentSem: data.currentSem,
        role: "STUDENT",
      },
    });

    res.status(201).json({
      success: true,
      message: "User signed up successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        department: user.department,
        college: user.college,
        role: user.role,
        currentSem: user.currentSem,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// TEACHER SIGNUP
const teacherSignupSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  college: z.string().min(2),
  department: z.enum(["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"]),
  employeeId: z.string().min(5),
  designation: z.string().min(2),
  name: z.string().optional(),
});

router.post(
  "/teacher/register",
  idCardUpload.single("idCardImage"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const parseResult = teacherSignupSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parseResult.error.issues,
        });
        return;
      }

      const data = parseResult.data;

      if (!eduEmailCheck(data.email)) {
        res.status(400).json({
          success: false,
          message: "Email must be an academic address ending with .edu.in",
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "ID card image is required.",
        });
        return;
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: data.email.toLowerCase() }, { username: data.username }],
        },
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          message: "User with this email or username already exists.",
        });
        return;
      }

      const normalizedEmployeeId = data.employeeId.toUpperCase();
      const staffRecord = await prisma.staffRecord.findUnique({
        where: { employeeId: normalizedEmployeeId },
      });

      console.log("Teacher signup lookup:", {
        employeeId: normalizedEmployeeId,
        found: !!staffRecord,
      });

      if (!staffRecord || !staffRecord.isActive) {
        res.status(403).json({
          success: false,
          message: "Employee ID not found in our records. Contact admin.",
        });
        return;
      }

      const providedName = (data.name || data.username).trim().toLowerCase();
      const staffName = staffRecord.name.trim().toLowerCase();
      const staffDept = staffRecord.department.trim().toUpperCase();
      const providedDept = data.department.toUpperCase();

      if (providedName !== staffName || staffDept !== providedDept) {
        res.status(403).json({
          success: false,
          message: "ID details do not match staff records.",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          username: data.username,
          email: data.email.toLowerCase(),
          password: hashedPassword,
          college: data.college,
          department: data.department,
          graduationYear: new Date().getFullYear() + 4, // placeholder
          currentSem: "SEM1",
          role: "TEACHER",
          // No admin approval flow: auto-approve on successful staff verification
          status: "APPROVED",
          verified: true,
          employeeId: normalizedEmployeeId,
          designation: data.designation,
          idCardImage: req.file.path,
        },
      });

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET environment variable is missing.");
      }

      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
          email: user.email,
          department: user.department,
          college: user.college,
          currentSem: user.currentSem,
          verified: user.verified,
          status: user.status,
        },
        jwtSecret,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        success: true,
        message: "Teacher registered successfully.",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          department: user.department,
          college: user.college,
          currentSem: user.currentSem,
          verified: user.verified,
          status: user.status,
          employeeId: user.employeeId,
          designation: user.designation,
          idCardImage: user.idCardImage,
        },
      });
    } catch (error) {
      console.error("Teacher register error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);

// --- LOGIN API (STAGE 9) ---

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
      return;
    }

    const { email, password } = result.data;

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // 2. Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // 3. No admin approval flow:
    // If an older teacher account is still marked PENDING, auto-approve it on successful login.
    if (user.role === "TEACHER" && user.status === "PENDING") {
      console.log("Auto-approving pending teacher on login:", {
        userId: user.id,
        email: user.email,
        employeeId: (user as any).employeeId || null,
      });

      // If employeeId exists, confirm staff record still exists/active (demo-friendly safety).
      const employeeId = ((user as any).employeeId as string | undefined)?.toUpperCase();
      if (employeeId) {
        const staffRecord = await prisma.staffRecord.findUnique({
          where: { employeeId },
        });

        console.log("Staff verification during login:", {
          employeeId,
          found: !!staffRecord,
          active: staffRecord?.isActive ?? null,
        });

        if (!staffRecord || !staffRecord.isActive) {
          res.status(403).json({
            success: false,
            message: "Staff record inactive or missing. Contact admin.",
          });
          return;
        }
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { verified: true, status: "APPROVED" },
      });

      // Update local object so JWT reflects approved status without re-query
      (user as any).verified = true;
      (user as any).status = "APPROVED";
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is missing.");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
        department: user.department,
        college: user.college,
        currentSem: user.currentSem,
        verified: user.verified,
        status: user.status,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        college: user.college,
        currentSem: user.currentSem,
        isSenior: user.isSenior,
        verified: user.verified,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
