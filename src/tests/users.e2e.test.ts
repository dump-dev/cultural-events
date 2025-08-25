import { Express } from "express";
import bootstrap from "../bootstrap";
import { closeConnectionRedis } from "../redis-client/client";
import { closeConnectionDB } from "../typeorm/data-source";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { RoleEnum } from "../constants/role";
import { createAndLoginUser, registerUser } from "./utils/user-helper";
import { loginAdminAndReturnBody } from "./utils/admin-help";
import TestAgent from "supertest/lib/agent";

jest.spyOn(console, "log").mockImplementation(() => {});

describe("Router /users", () => {
  let app: Express;
  let testAgent: TestAgent;
  beforeEach(async () => {
    app = await bootstrap();
    testAgent = request(app);
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
        const response = await testAgent.post("/users").send(requestBody);
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
      const { accessToken } = await loginAdminAndReturnBody(testAgent);
      const response = await testAgent
        .get("/users")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
    });

    test("should return 403 when an authenticated user does not have permission", async () => {
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
      const response = await testAgent.get("/users");
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("GET /users/me", () => {
    describe("when user is authenticated", () => {
      test("should return status 200 and user data", async () => {
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

  describe("GET /users/:userId", () => {
    describe("when the authenticated user is an admin", () => {
      test("should return 200 with user data when user exists", async () => {
        const user = {
          name: "John Doe",
          email: "johndoe@test.com",
          password: "super secure password",
        };
        const registerResponse = await registerUser(testAgent, user);
        const { id: userId } = registerResponse.body;
        const { accessToken } = await loginAdminAndReturnBody(testAgent);
        const response = await testAgent
          .get(`/users/${userId}`)
          .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body.id).toBe(userId);
        expect(response.body.name).toBe(user.name);
        expect(response.body.authEmail).toBe(user.email);
        expect(response.body).not.toHaveProperty("password");
      });

      test("should return 404 when user not exists", async () => {
        const { accessToken } = await loginAdminAndReturnBody(testAgent);
        const response = await testAgent
          .get("/users/1e2ddc87-73be-402f-80f6-81123d39d730")
          .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      });
    });

    describe("when the authenticated is not an admin", () => {
      test("should return 403", async () => {
        const anotherUser = {
          name: "Another",
          email: "another@test.com",
          password: "l4#31kfaj#FAfdf55JFKJA",
        };
        const registerResponse = await registerUser(testAgent, anotherUser);
        const { id: userId } = registerResponse.body;

        const user = {
          name: "John Doe",
          email: "john@test.com",
          password: "super secure password",
        };
        const { accessToken } = await createAndLoginUser(testAgent, user);
        const response = await testAgent
          .get(`/users/${userId}`)
          .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
      });
    });
  });

  describe("DELETE /users/:userId", () => {
    describe("when the authenticated user is an admin", () => {
      test("should return 204 when user exists", async () => {
        const user = {
          name: "John Doe",
          email: "john@test.com",
          password: "super secure password",
        };
        const registerResponse = await registerUser(testAgent, user);
        const { id: userId } = registerResponse.body;
        const { accessToken } = await loginAdminAndReturnBody(testAgent);
        const response = await testAgent
          .delete(`/users/${userId}`)
          .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
      });

      test("should return 404 when user not exists", async () => {
        const user = {
          name: "John Doe",
          email: "john@test.com",
          password: "super secure password",
        };
        const registerResponse = await registerUser(testAgent, user);
        const { id } = registerResponse.body;
        const { accessToken } = await loginAdminAndReturnBody(testAgent);
        const userIds = [id, "c2ef6b61-4404-4ce9-bbda-271f4a0bbc63"];
        for (const userId of userIds) {
          const response = await testAgent
            .delete(`/users/${userId}`)
            .set("Authorization", `Bearer ${accessToken}`);
          expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        }
      });
    });

    test("shoul return 403 when the authenticated user is not an admin", async () => {
      const user = {
        name: "John Doe",
        email: "john@test.com",
        password: "super secure password",
      };

      const { accessToken } = await createAndLoginUser(testAgent, user);
      const response = await testAgent
        .delete(`/users/"c2ef6b61-4404-4ce9-bbda-271f4a0bbc63"`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
    });
  });

  describe("DELETE /users/me", () => {
    describe("when user is authenticated", () => {
      test("should return 204", async () => {
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
          const response = await testAgent.delete("/users/me");
          expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });

        test("when user any token invalid or expired", async () => {
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
