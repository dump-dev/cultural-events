import { Router } from "express";
import authRouter from "./features/auth/auth.router";
import usersRouter from "./features/users/users.router";

const router = Router();
router.use("/auth", authRouter);
router.use("/users", usersRouter);
export default router;
