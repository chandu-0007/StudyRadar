import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


// Extend Express Request object to include the user payload
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
    department: string;
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
