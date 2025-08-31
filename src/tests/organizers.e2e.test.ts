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
import {
  createCulturalEvent,
  makeFakeCulturalEventData,
} from "./utils/cultural-event-helper";

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
    describe("when authenticated user is an admin", () => {
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

    describe("when authenticated user is not an admin", () => {
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

  describe("GET /organizers/:organizerId", () => {
    describe("when authenticated user is an organizer or admin", () => {
      test("should return 200 with detailed organizer data without contacts", async () => {
        const organizer = makeFakeOrganizerData();
        const responseOrganizer = await createAndLoginOrganizer(
          testAgent,
          organizer
        );
        const { organizerId } = responseOrganizer;
        const responseAdmin = await loginAdminAndReturnBody(testAgent);

        const accessTokens = [
          responseOrganizer.accessToken,
          responseAdmin.accessToken,
        ];

        for (const accessToken of accessTokens) {
          const response = await testAgent
            .get(`/organizers/${organizerId}`)
            .set("Authorization", `Bearer ${accessToken}`);
          expect(response.statusCode).toBe(StatusCodes.OK);
          expect(response.body.id).toBe(organizerId);
          expect(response.body.displayName).toBe(organizer.displayName);
          expect(response.body.description).toBe(organizer.description);
          expect(response.body).not.toHaveProperty("contancts");
          expect(response.body.user).toHaveProperty("id");
          expect(response.body.user.name).toBe(organizer.name);
          expect(response.body.user.authEmail).toBe(organizer.email);
          expect(response.body.user).not.toHaveProperty("password");
        }
      });
      test("should return 200 with detailed organizer data with contacts", async () => {
        const contacts = makeFakeContactsFull();
        const organizer = makeFakeOrganizerData(contacts);
        const responseOrganizer = await createAndLoginOrganizer(
          testAgent,
          organizer
        );
        const { organizerId } = responseOrganizer;
        const responseAdmin = await loginAdminAndReturnBody(testAgent);

        const accessTokens = [
          responseOrganizer.accessToken,
          responseAdmin.accessToken,
        ];

        for (const accessToken of accessTokens) {
          const response = await testAgent
            .get(`/organizers/${organizerId}`)
            .set("Authorization", `Bearer ${accessToken}`);
          expect(response.statusCode).toBe(StatusCodes.OK);
          expect(response.body.id).toBe(organizerId);
          expect(response.body.displayName).toBe(organizer.displayName);
          expect(response.body.description).toBe(organizer.description);
          expect(response.body.contacts).toEqual(contacts);
          expect(response.body.user).toHaveProperty("id");
          expect(response.body.user.name).toBe(organizer.name);
          expect(response.body.user.authEmail).toBe(organizer.email);
          expect(response.body.user).not.toHaveProperty("role");
          expect(response.body.user).not.toHaveProperty("password");
        }
      });
    });

    test("should return 200 with public data for authenticated users with role 'user'", async () => {
      const organizer = makeFakeOrganizerData();
      const registerReponse = await registerOrganizer(testAgent, organizer);
      const { id: organizerId } = registerReponse.body;

      const { accessToken } = await createAndLoginUser(testAgent, {
        name: "John Doe",
        email: "johndoe@test.com",
        password: "super secret password",
      });

      const response = await testAgent
        .get(`/organizers/${organizerId}`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.id).toBe(organizerId);
      expect(response.body.displayName).toBe(organizer.displayName);
      expect(response.body.description).toBe(organizer.description);
      expect(response.body.contacts).toBe(organizer.contacts);
      expect(response.body).not.toHaveProperty("user");
    });

    test("should return 200 with public data when user is not authenticated", async () => {
      const organizer = makeFakeOrganizerData();
      const registerReponse = await registerOrganizer(testAgent, organizer);
      const { id: organizerId } = registerReponse.body;

      const response = await testAgent.get(`/organizers/${organizerId}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.id).toBe(organizerId);
      expect(response.body.displayName).toBe(organizer.displayName);
      expect(response.body.description).toBe(organizer.description);
      expect(response.body.contacts).toBe(organizer.contacts);
      expect(response.body).not.toHaveProperty("user");
    });
  });

  describe("GET /organizers/:organizerId/cultural-events", () => {
    test("should return 200 with cultural events of an organizer when organizer exists", async () => {
      const organizer = makeFakeOrganizerData();
      const { organizerId, accessToken } = await createAndLoginOrganizer(
        testAgent,
        organizer
      );
      const TOTAL_CULTURAL_EVENTS = 5;
      const culturalEvents = Array.from({ length: TOTAL_CULTURAL_EVENTS }, () =>
        makeFakeCulturalEventData(organizerId)
      );
      for (const culturalEvent of culturalEvents) {
        await createCulturalEvent({
          testAgent,
          culturalEvent,
          organizer: { id: organizerId, accessToken },
        });
      }

      const response = await testAgent.get(
        `/organizers/${organizerId}/cultural-events`
      );
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.organizer.displayName).toBe(organizer.displayName);
      expect(response.body.organizer.description).toBe(organizer.description);
      expect(response.body.organizer).not.toHaveProperty("name");
      expect(response.body.organizer).not.toHaveProperty("authEmail");
      expect(response.body.organizer).not.toHaveProperty("user");
      expect(response.body.organizer).not.toHaveProperty("contacts");

      expect(response.body.culturalEvents).toHaveLength(TOTAL_CULTURAL_EVENTS);
      for (const culturalEvent of response.body.culturalEvents) {
        expect(culturalEvent).toHaveProperty("id");
        expect(culturalEvent).toHaveProperty("title");
        expect(culturalEvent).toHaveProperty("location");
        expect(culturalEvent).toHaveProperty("date");
        expect(culturalEvent.location).toHaveProperty("name");
        expect(culturalEvent.location).toHaveProperty("city");
        expect(culturalEvent.location).toHaveProperty("state");
        expect(culturalEvent).not.toHaveProperty("organizer");
      }
    });

    test("should return 200 with organizer and culturalEvents as empty array when organizer has no registered events", async () => {
      const organizer = makeFakeOrganizerData();
      const { organizerId } = await createAndLoginOrganizer(
        testAgent,
        organizer
      );

      const response = await testAgent.get(
        `/organizers/${organizerId}/cultural-events`
      );
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("organizer");
      expect(response.body.culturalEvents).toHaveLength(0);
    });

    test("should return 404 when organizer doest not exist", async () => {
      const organizerId = "66fed3de-3b39-428d-9ba2-bc1def1a4764";
      const response = await testAgent.get(
        `/organizers/${organizerId}/cultural-events`
      );
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
