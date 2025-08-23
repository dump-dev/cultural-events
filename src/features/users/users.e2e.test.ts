import { Express } from "express";
import bootstrap from "../../bootstrap";
import { closeConnectionRedis } from "../../redis-client/client";
import { closeConnectionDB } from "../../typeorm/data-source";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { RoleEnum } from "../../constants/role";

jest.spyOn(console, "log").mockImplementation(() => {});

describe("Router /users", () => {
  let app: Express;
  beforeEach(async () => {
    app = await bootstrap();
  });

  afterEach(async () => {
    await Promise.all([closeConnectionDB(), closeConnectionRedis()]);
  });

  describe("POST /users", () => {
    describe("when given valid data", () => {
      test("should return 201 and the registered user", async () => {
        const requestBody = {
          name: "John Doe",
          email: "johndoe@test.com",
          password: "super secure",
        };
        const response = await request(app).post("/users").send(requestBody);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        expect(response.body.name).toBe(requestBody.name);
        expect(response.body.authEmail).toBe(requestBody.email);
        expect(response.body.role).toBe(RoleEnum.USER);
        expect(response.body).not.toHaveProperty("password");
      });
    });
    describe("when given invalid data", () => {
      test("should return 400 and validation error", async () => {
        const invalidRequestsBody = [
          {},
          {
            name: "",
          },
          {
            name: "",
            email: "",
          },
          {
            name: "",
            email: "",
            password: "",
          },
          {
            name: "jowh",
            email: "john.com",
            password: "",
          },
          {
            name: "John Doe",
            email: "John@.com",
            password: "12345678",
          },
          {
            name: "John Doe",
            email: "John@test.com",
            password: "invalid",
          },
        ];

        for (let requestBody of invalidRequestsBody) {
          const response = await request(app).post("/users").send(requestBody);
          expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
          expect(response.body).toBeInstanceOf(Array)
        }
      });
    });
  });
});
