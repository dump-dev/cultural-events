import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import TestAgent from "supertest/lib/agent";
import bootstrap from "../bootstrap";
import { RoleEnum } from "../constants/role";
import { closeConnectionRedis } from "../redis-client/client";
import { closeConnectionDB } from "../typeorm/data-source";
import {
  createAndLoginOrganizer,
  makeFakeContactsFull,
  makeFakeOrganizerData,
  registerOrganizer,
} from "./utils/organizer-helper";
import { loginAdminAndReturnBody } from "./utils/admin-help";
import { createAndLoginUser } from "./utils/user-helper";

jest.spyOn(console, "log").mockImplementation(() => {});

describe("Router /organizers", () => {
  let app: Express;
  let testAgent: TestAgent;

  beforeEach(async () => {
    app = await bootstrap();
    testAgent = request(app);
  });

  afterEach(async () => {
    await Promise.all([closeConnectionDB(), closeConnectionRedis()]);
  });

  describe("POST /organizers", () => {
    describe("when user sends valid organizer data", () => {
      test("should return 201 without contacts", async () => {
        const organizer = makeFakeOrganizerData();

        const response = await testAgent.post("/organizers").send(organizer);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        expect(response.body).toHaveProperty("id");
        expect(response.body.displayName).toBe(organizer.displayName);
        expect(response.body.description).toBe(organizer.description);
        expect(response.body.contacts).toBeUndefined();
        expect(response.body.user.name).toBe(organizer.name);
        expect(response.body.user.authEmail).toBe(organizer.email);
        expect(response.body.user.role).toBe(RoleEnum.ORGANIZER);
        expect(response.body.user).not.toHaveProperty("password");
      });

      test("should return 201 with all contacts", async () => {
        const contacts = makeFakeContactsFull();
        const organizer = makeFakeOrganizerData(contacts);

        const response = await testAgent.post("/organizers").send(organizer);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        expect(response.body.contacts.email).toBe(contacts.email);
        expect(response.body.contacts.website).toBe(contacts.website);
        expect(response.body.contacts.instagram).toBe(contacts.instagram);
        expect(response.body.contacts.phoneNumber).toHaveLength(
          contacts.phoneNumber.length
        );
      });

      test("should return 201 with partial contacts", async () => {
        const contacts = makeFakeContactsFull();

        for (const field of Object.keys(contacts) as Array<
          keyof typeof contacts
        >) {
          const organizer = makeFakeOrganizerData({ [field]: contacts[field] });
          const response = await testAgent.post("/organizers").send(organizer);
          expect(response.statusCode).toBe(StatusCodes.CREATED);
          if (field === "phoneNumber") {
            expect(response.body.contacts.phoneNumber).toHaveLength(
              contacts.phoneNumber.length
            );
          } else {
            expect(response.body.contacts[field]).toBe(contacts[field]);
          }
        }
      });

      test("should return 409 when organizer already registered", async () => {
        const organizer = makeFakeOrganizerData();
        await testAgent.post("/organizers").send(organizer);
        const response = await testAgent.post("/organizers").send(organizer);
        expect(response.statusCode).toBe(StatusCodes.CONFLICT);
      });
    });
  });

  describe("GET /organizers", () => {
    describe("when user authenticated is an admin", () => {
      test("should return 200 with summurized organizers", async () => {
        const organizer = makeFakeOrganizerData();
        const registerResponse = await registerOrganizer(testAgent, organizer);
        const { id: organizerId } = registerResponse.body;

        const { accessToken } = await loginAdminAndReturnBody(testAgent);

        const response = await testAgent
          .get("/organizers")
          .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].id).toBe(organizerId);
        expect(response.body[0].displayName).toBe(organizer.displayName);
        expect(response.body[0].user).toHaveProperty("id");
        expect(response.body[0].user.name).toBe(organizer.name);
        expect(response.body[0].user.authEmail).toBe(organizer.email);
        expect(response.body[0].user).not.toHaveProperty("password");
        expect(response.body[0].user).not.toHaveProperty("role");
      });
    });

    describe("when user authenticated is not an admin", () => {
      test("should return 403", async () => {
        const user = await createAndLoginUser(testAgent, {
          name: "John Doe",
          email: "johndoe@test.com",
          password: "super secret password",
        });

        const organizer = await createAndLoginOrganizer(
          testAgent,
          makeFakeOrganizerData()
        );

        const accessTokens = [user.accessToken, organizer.accessToken];

        for (const accessToken of accessTokens) {
          const response = await testAgent
            .get("/organizers")
            .set("Authorization", `Bearer ${accessToken}`);
          expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
        }
      });
    });
  });
});
