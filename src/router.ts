import { Router } from "express";
import authRouter from "./features/auth/auth.router";
import usersRouter from "./features/users/users.router";
import organizersRouter from "./features/organizers/organizers.router";

const router = Router();
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/organizers", organizersRouter);
export default router;
