import type { NextFunction, Response } from "express";
import type { AuthRequest, Role } from "./types.js";

export function attachUser(req: AuthRequest, _res: Response, next: NextFunction) {
  const role = String(req.header("x-user-role") || "admin").toLowerCase() as Role;
  req.user = {
    name: req.header("x-user-name") || "Portal User",
    role: ["viewer","editor","admin"].includes(role) ? role : "viewer"
  };
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to perform this action." });
    }
    next();
  };
}
