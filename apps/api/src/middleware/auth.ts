import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


// Extend Express Request object to include the user payload
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
    department: string;
    college?: string;
    currentSem?: string;
    verified?: boolean;
    status?: string;
  };
  file?: any;
  files?: any;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Authentication required. Missing token." });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, message: "Authentication required. Missing token." });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "";
    if (!secret) throw new Error("JWT_SECRET missing");

    const decoded = jwt.verify(token, secret) as AuthRequest["user"];
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token." });
    return;
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Admin access required." });
    return;
  }
  next();
};

export const requireTeacher = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "TEACHER") {
    res.status(403).json({ success: false, message: "Teacher access required." });
    return;
  }
  next();
};

export const requireVerifiedTeacher = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "TEACHER") {
    res.status(403).json({ success: false, message: "Teacher access required." });
    return;
  }
  if (req.user.status !== "APPROVED" && req.user.verified !== true) {
    res.status(403).json({ success: false, message: "Teacher account is not verified." });
    return;
  }
  next();
};

