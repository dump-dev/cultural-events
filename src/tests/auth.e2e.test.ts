import request from "supertest";
import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import bootstrap from "../bootstrap";
import { closeConnectionDB } from "../typeorm/data-source";
import { closeConnectionRedis } from "../redis-client/client";
import { loginUser, registerUser } from "./utils/user-helper";

jest.spyOn(console, "log").mockImplementation(() => {});

describe("Router /auth", () => {
  let app: Express;
  beforeEach(async () => {
    app = await bootstrap();
  });

  afterEach(async () => {
    await Promise.all([closeConnectionDB(), closeConnectionRedis()]);
  });

  describe("POST /auth/login", () => {
    describe("when user sending valid crendentails", () => {
      describe("and credentials match", () => {
        test("should return 200 and an accessToken", async () => {
          const testAgent = request(app);
          const user = {
            name: "John Doe",
            email: "johndoe@test.com",
            password: "super secure password",
          };
          await registerUser(testAgent, user);

          const response = await loginUser(testAgent, user);
          expect(response.statusCode).toBe(StatusCodes.OK);
          expect(response.body).toHaveProperty("accessToken");
        });
      });
    });
  });
});
