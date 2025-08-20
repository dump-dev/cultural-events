import { Router } from "express";
import { AppDataSource } from "../../typeorm/data-source";
import User from "../../typeorm/entities/User";
import AuthController from "./auth.controller";
import RegiserUserService from "./services/register-user.service";
import AuthService from "./services/auth.service";

const authRouter = Router();

const userRepository = AppDataSource.getRepository(User)!;
const userCreateService = new RegiserUserService(userRepository);
const authService = new AuthService(userRepository);
const authController = new AuthController(userCreateService, authService);
authRouter.post("/register", (req, res) =>
  authController.registerUser(req, res)
);
authRouter.post("/login", (req, res) => authController.login(req, res));

export default authRouter;
