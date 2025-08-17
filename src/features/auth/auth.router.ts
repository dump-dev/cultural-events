import { Router } from "express";
import { AppDataSource } from "../../typeorm/data-source";
import User from "../../typeorm/entities/User";
import AuthController from "./auth.controller";
import CreateUserService from "./services/create-user.service";

const authRouter = Router();

const userRepository = AppDataSource.getRepository(User)!;
const userCreateService = new CreateUserService(userRepository);
const authController = new AuthController(userCreateService);
authRouter.post("/register", (req, res) =>
  authController.registerUser(req, res)
);

export default authRouter;
