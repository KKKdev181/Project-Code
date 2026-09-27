import type { Request } from "express";

export type Role = "viewer" | "editor" | "admin";

export interface AuthRequest extends Request {
  user?: { name: string; role: Role };
}
