import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../prisma";

const router = Router();

// Zod schema for input validation
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  email: z.string()
    .email("Invalid email format")
    .endsWith(".edu.in", "Email must be an academic .edu.in address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  college: z.string().min(2, "College name is required"),
  department: z.enum(["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"]),
  graduationYear: z.number().int().min(2000).max(2100),
  currentSem: z.enum(["SEM1", "SEM2", "SEM3", "SEM4", "SEM5", "SEM6", "SEM7", "SEM8"])
});

router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validate request body
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
      return;
    }

    const data = result.data;

    // 2. Check if user already exists
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

    // 3. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // 4. Create the new user
    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        college: data.college,
        department: data.department,
        graduationYear: data.graduationYear,
        currentSem: data.currentSem,
      },
    });

    // 5. Send success response (exclude password)
    res.status(201).json({
      success: true,
      message: "User signed up successfully!",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        department: newUser.department,
        college: newUser.college,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

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
      where: { email },
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

    // 3. Generate JWT Token
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
      },
      jwtSecret,
      { expiresIn: "7d" } // Token valid for 7 days
    );

    // 4. Return success response with token
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
        isSenior: user.isSenior,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
