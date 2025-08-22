import "express";
import { Role } from "./Role";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      id: string;
      role: Role;
    };
  }
}