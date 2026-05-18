import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    isApproved: boolean;
  };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded as any;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const checkRole =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden - insufficient permissions" });
    }
    next();
  };

export const checkApproved = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isApproved && req.user?.role !== "Admin") {
    return res
      .status(403)
      .json({ error: "User not approved yet. Contact admin." });
  }
  next();
};
