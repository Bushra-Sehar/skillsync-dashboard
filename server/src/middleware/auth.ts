import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "skillsync_super_secret_key_123";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token is missing" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }
    req.user = user as AuthenticatedRequest["user"];
    next();
  });
}
export { JWT_SECRET };
