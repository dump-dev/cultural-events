import { Express } from "express";
import bootstrap from "../bootstrap";
import { closeConnectionRedis } from "../redis-client/client";
import { closeConnectionDB } from "../typeorm/data-source";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { RoleEnum } from "../constants/role";
import { createAndLoginUser } from "./utils/user-helper";
import { loginAdminAndReturnBody } from "./utils/admin-help";

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

      test("should return 409 when email is already registered", async () => {
        const requestBody = {
          name: "John Doe",
          email: "johndoe@test.com",
          password: "super secure",
        };
        const testAgent = request(app);
        await testAgent.post("/users").send(requestBody);
        const response = await testAgent.post("/users").send({
          ...requestBody,
          name: "Guest",
          password: "Another password",
        });

        expect(response.statusCode).toBe(StatusCodes.CONFLICT);
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

        for (const requestBody of invalidRequestsBody) {
          const response = await request(app).post("/users").send(requestBody);
          expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(response.body).toBeInstanceOf(Array);
        }
      });
    });
  });

  describe("GET /users", () => {
    test("should return 200 with a list of users when an authenticated user has permission", async () => {
      const testAgent = request(app);
      const { accessToken } = await loginAdminAndReturnBody(testAgent);
      const response = await testAgent
        .get("/users")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
    });

    test("should return 403 when an authenticated user does not have permission", async () => {
      const testAgent = request(app);
      const user = {
        name: "John Doe",
        email: "john@test.com",
        password: "super secure password",
      };
      const { accessToken } = await createAndLoginUser(testAgent, user);
      const response = await testAgent
        .get("/users")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
    });

    test("should return 401 when user is not authenticated", async () => {
      const testAgent = request(app);
      const response = await testAgent.get("/users");
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("GET /users/me", () => {
    describe("when user is authenticated", () => {
      test("should return status 200 and user data", async () => {
        const testAgent = request(app);

        const user = {
          name: "John Doe",
          email: "johndoe@test.com",
          password: "super secure password",
        };

        const { accessToken } = await createAndLoginUser(testAgent, user);

        const response = await testAgent
          .get("/users/me")
          .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body.name).toBe(user.name);
        expect(response.body.authEmail).toBe(user.email);
      });
    });
  });

  describe("DELETE /users/me", () => {
    describe("when user is authenticated", () => {
      test("should return 204", async () => {
        const testAgent = request(app);
        const user = {
          name: "John Doe",
          email: "johndoe@test.com",
          password: "super secure password",
        };
        const { accessToken } = await createAndLoginUser(testAgent, user);
        const response = await testAgent
          .delete("/users/me")
          .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
      });

      test("should return 401 when user tries to delete again", async () => {
        const testAgent = request(app);
        const user = {
          name: "John Doe",
          email: "johndoe@test.com",
          password: "super secure password",
        };
        const { accessToken } = await createAndLoginUser(testAgent, user);

        await testAgent
          .delete("/users/me")
          .set("Authorization", `Bearer ${accessToken}`);

        const response = await testAgent
          .delete("/users/me")
          .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      });
    });

    describe("when user is not authenticated", () => {
      describe("should return 401", () => {
        test("when user not send the accessToken on Authorization header", async () => {
          const testAgent = request(app);
          const response = await testAgent.delete("/users/me");
          expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });

        test("when user any token invalid or expired", async () => {
          const testAgent = request(app);
          const invalidTokens = [
            "",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
            "yeadf.aefaf.ae33",
          ];

          for (const accessToken of invalidTokens) {
            const response = await testAgent
              .delete("/users/me")
              .set("Authorization", `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
          }
        });
      });
    });
  });
});
