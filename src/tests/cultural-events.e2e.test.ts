import { Express } from "express";
import request from "supertest";
import TestAgent from "supertest/lib/agent";
import bootstrap from "../bootstrap";
import { closeConnectionRedis } from "../redis-client/client";
import { closeConnectionDB } from "../typeorm/data-source";
import {
  createAndLoginOrganizer,
  makeFakeOrganizerData,
} from "./utils/organizer-helper";
import {
  createCulturalEvent,
  makeFakeCulturalEventData,
} from "./utils/cultural-event-helper";
import { StatusCodes } from "http-status-codes";
import { createAndLoginUser } from "./utils/user-helper";
import { loginAdminAndReturnBody } from "./utils/admin-help";

jest.spyOn(console, "log").mockImplementation(() => {});

describe("Router /cultural-events", () => {
  let app: Express;
  let testAgent: TestAgent;

  beforeEach(async () => {
    app = await bootstrap();
    testAgent = request(app);
  });

  afterEach(async () => {
    await Promise.all([closeConnectionDB(), closeConnectionRedis()]);
  });
  describe("POST /cultural-events", () => {
    describe("when user authenticated is an organizer", () => {
      test("should return 201 with cultural event details when provided valid data", async () => {
        const organizer = makeFakeOrganizerData();
        const { organizerId, accessToken } = await createAndLoginOrganizer(
          testAgent,
          organizer
        );

        const culturalEvent = makeFakeCulturalEventData(organizerId);

        const response = await testAgent
          .post("/cultural-events")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(culturalEvent);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe(culturalEvent.title);
        expect(response.body.description).toBe(culturalEvent.description);
        expect(response.body.date).toBe(culturalEvent.date.toISOString());
        expect(response.body.organizer.id).toBe(culturalEvent.organizerId);
        expect(response.body.location.name).toBe(culturalEvent.location.name);
        expect(response.body.location.street).toBe(
          culturalEvent.location.street
        );
        expect(response.body.location.neighborhood).toBe(
          culturalEvent.location.neighborhood
        );
        expect(response.body.location.city).toBe(culturalEvent.location.city);
        expect(response.body.location.state).toBe(culturalEvent.location.state);
        expect(response.body.location.propertyNumber).toBe(
          culturalEvent.location.propertyNumber
        );
        expect(response.body.location.cep).toBe(culturalEvent.location.cep);
        expect(response.body.location).not.toHaveProperty("id");
      });
    });
  });

  describe("GET /cultural-events", () => {
    test("should return 200 with list of summarized cultural events", async () => {
      const SIZE = 5;
      for (let i = 0; i < SIZE; i++) {
        const { organizerId, accessToken } = await createAndLoginOrganizer(
          testAgent,
          makeFakeOrganizerData()
        );

        await createCulturalEvent({
          testAgent,
          organizer: {
            id: organizerId,
            accessToken,
          },
        });
      }

      const response = await testAgent.get("/cultural-events");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toHaveLength(SIZE);
      for (let i = 0; i < SIZE; i++) {
        expect(response.body[i]).toHaveProperty("id");
        expect(response.body[i]).toHaveProperty("title");
        expect(response.body[i]).not.toHaveProperty("description");
        expect(response.body[i]).toHaveProperty("date");
        expect(response.body[i].location).toHaveProperty("name");
        expect(response.body[i].location).toHaveProperty("city");
        expect(response.body[i].location).toHaveProperty("state");
        expect(response.body[i].location).not.toHaveProperty("street");
        expect(response.body[i].location).not.toHaveProperty("cep");
        expect(response.body[i].organizer).toHaveProperty("id");
        expect(response.body[i].organizer).toHaveProperty("name");
        expect(response.body[i].organizer).not.toHaveProperty("description");
        expect(response.body[i].organizer).not.toHaveProperty("contancts");
      }
    });
  });

  describe("GET /cultural-events/:culturalEventId", () => {
    test("should return 200 with detailed cultural event data", async () => {
      const organizer = makeFakeOrganizerData();
      const { organizerId, accessToken } = await createAndLoginOrganizer(
        testAgent,
        organizer
      );

      const culturalEvent = makeFakeCulturalEventData(organizerId);
      const responseCreate = await createCulturalEvent({
        testAgent,
        organizer: {
          id: organizerId,
          accessToken,
        },
        culturalEvent,
      });
      const { id: culturalEventId } = responseCreate.body;

      const response = await testAgent.get(
        `/cultural-events/${culturalEventId}`
      );
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.id).toBe(culturalEventId);
      expect(response.body.title).toBe(culturalEvent.title);
      expect(response.body.description).toBe(culturalEvent.description);
      expect(response.body.date).toBe(culturalEvent.date.toISOString());
      expect(response.body.organizer.id).toBe(culturalEvent.organizerId);
      expect(response.body.organizer.name).toBe(organizer.displayName);
      expect(response.body.organizer.description).toBe(organizer.description);
      expect(response.body.organizer.id).toBe(culturalEvent.organizerId);
      expect(response.body.location).toEqual(culturalEvent.location);
    });
  });

  describe("PATCH /cultural-events/:culturalEventId", () => {
    describe("when user authenticated is an organizer", () => {
      test("should return 200 when event owner provides valid cultural event data", async () => {
        const { organizerId, accessToken } = await createAndLoginOrganizer(
          testAgent,
          makeFakeOrganizerData()
        );

        const responseCreate = await createCulturalEvent({
          testAgent,
          organizer: {
            id: organizerId,
            accessToken,
          },
        });
        const { id: culturalEventId } = responseCreate.body;

        const newCulturalEventData = makeFakeCulturalEventData(organizerId);
        const response = await testAgent
          .patch(`/cultural-events/${culturalEventId}`)
          .set("Authorization", `Bearer ${accessToken}`)
          .send(newCulturalEventData);

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body.title).toBe(newCulturalEventData.title);
        expect(response.body.description).toBe(
          newCulturalEventData.description
        );
        expect(response.body.date).toBe(
          newCulturalEventData.date.toISOString()
        );
        expect(response.body.location).toEqual(newCulturalEventData.location);
      });

      test("should return 403 when cultural event is updated by a non-owner organizer", async () => {
        const ownerLogin = await createAndLoginOrganizer(
          testAgent,
          makeFakeOrganizerData()
        );

        const responseCreate = await createCulturalEvent({
          testAgent,
          organizer: {
            id: ownerLogin.organizerId,
            accessToken: ownerLogin.accessToken,
          },
        });
        const { id: culturalEventId } = responseCreate.body;
        const nonOwnerLogin = await createAndLoginOrganizer(
          testAgent,
          makeFakeOrganizerData()
        );

        const response = await testAgent
          .patch(`/cultural-events/${culturalEventId}`)
          .set("Authorization", `Bearer ${nonOwnerLogin.accessToken}`)
          .send(makeFakeCulturalEventData(nonOwnerLogin.organizerId));
        expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
      });
    });

    describe("when user authenticated is not an organizer", () => {
      test("should return 403", async () => {
        const user = await createAndLoginUser(testAgent, {
          name: "John Doe",
          email: "john@test.com",
          password: "super secure password",
        });

        const admin = await loginAdminAndReturnBody(testAgent);
        const accessTokens = [user.accessToken, admin.accessToken];

        for (const accessToken of accessTokens) {
          const response = await testAgent
            .patch(`/cultural-events/doesnt-exists-but-its-fine`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
              description: "some description",
            });
          expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
          expect(response.body).not.toHaveProperty("description");
        }
      });
    });
  });

  describe("DELETE /cultural-events/:culturalEventId", () => {
    describe("when user authenticated is an organizer", () => {
      test("should return 204 when the organizer deletes their own event", async () => {
        const { organizerId, accessToken } = await createAndLoginOrganizer(
          testAgent,
          makeFakeOrganizerData()
        );

        const responseCreate = await createCulturalEvent({
          testAgent,
          organizer: {
            id: organizerId,
            accessToken,
          },
        });
        const { id: culturalEventId } = responseCreate.body;

        const response = await testAgent
          .delete(`/cultural-events/${culturalEventId}`)
          .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
      });
      test("should return 404 when the organizer tries to delete an event that was already deleted", async () => {
        const { organizerId, accessToken } = await createAndLoginOrganizer(
          testAgent,
          makeFakeOrganizerData()
        );

        const responseCreate = await createCulturalEvent({
          testAgent,
          organizer: {
            id: organizerId,
            accessToken,
          },
        });
        const { id: culturalEventId } = responseCreate.body;

        await testAgent
          .delete(`/cultural-events/${culturalEventId}`)
          .set("Authorization", `Bearer ${accessToken}`);

        const response = await testAgent
          .delete(`/cultural-events/${culturalEventId}`)
          .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      });

      test("should return 403 when the organizer attempts to delete an event they do not own", async () => {
        const owner = await createAndLoginOrganizer(
          testAgent,
          makeFakeOrganizerData()
        );

        const responseCreate = await createCulturalEvent({
          testAgent,
          organizer: {
            id: owner.organizerId,
            accessToken: owner.accessToken,
          },
        });
        const { id: culturalEventId } = responseCreate.body;

        const noOwner = await createAndLoginOrganizer(
          testAgent,
          makeFakeOrganizerData()
        );

        const response = await testAgent
          .delete(`/cultural-events/${culturalEventId}`)
          .set("Authorization", `Bearer ${noOwner.accessToken}`);
        expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
      });
    });
  });
});
