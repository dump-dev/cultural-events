import { Router } from "express";
import dataSource from "../../typeorm/data-source";
import User from "../../typeorm/entities/User";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";

const authRouter = Router();

const userRepository = dataSource.getRepository(User)!;
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

authRouter.post("/login", (req, res) => authController.login(req, res));

export default authRouter;
