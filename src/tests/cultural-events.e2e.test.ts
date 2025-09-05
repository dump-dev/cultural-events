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
      expect(response.body.data).toHaveLength(SIZE);
      for (let i = 0; i < SIZE; i++) {
        const item = response.body.data[i];
        expect(item).toHaveProperty("id");
        expect(item).toHaveProperty("title");
        expect(item).not.toHaveProperty("description");
        expect(item).toHaveProperty("date");
        expect(item.location).toHaveProperty("name");
        expect(item.location).toHaveProperty("city");
        expect(item.location).toHaveProperty("state");
        expect(item.location).not.toHaveProperty("street");
        expect(item.location).not.toHaveProperty("cep");
        expect(item.organizer).toHaveProperty("id");
        expect(item.organizer).toHaveProperty("name");
        expect(item.organizer).not.toHaveProperty("description");
        expect(item.organizer).not.toHaveProperty("contacts");
      }
    });

    test("should return 200 with page 1 when query params are ?page=1", async () => {
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

      const response = await testAgent.get("/cultural-events?page=1");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.page).toBe(1);
      expect(response.body.totalItems).toBe(SIZE);
      expect(response.body).toHaveProperty("perPage");
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body.data).toHaveLength(SIZE);
    });

    test("should return 200 with page 1 when query params are ?page=1&per-page=2", async () => {
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
      const page = 1;
      const perPage = 2;
      const totalPages = Math.ceil(SIZE / perPage);
      const response = await testAgent.get(
        `/cultural-events?page=${page}&per-page=${perPage}`
      );
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.page).toBe(page);
      expect(response.body.perPage).toBe(perPage);
      expect(response.body.totalItems).toBe(SIZE);
      expect(response.body.totalPages).toBe(totalPages);
      expect(response.body.data).toHaveLength(perPage);
    });

    test("should return 200 with data requested page when navigate between pages", async () => {
      const SIZE = 5;
      const culturalEventIds = [];
      for (let i = 0; i < SIZE; i++) {
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
        culturalEventIds.push(responseCreate.body.id);
      }

      const perPage = 1;
      const totalPages = Math.ceil(SIZE / perPage);
      for (let page = 1; page <= SIZE; page++) {
        const response = await testAgent.get(
          `/cultural-events?page=${page}&per-page=${perPage}`
        );

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body.page).toBe(page);
        expect(response.body.perPage).toBe(perPage);
        expect(response.body.totalItems).toBe(SIZE);
        expect(response.body.totalPages).toBe(totalPages);
        expect(culturalEventIds).toContain(response.body.data[0].id);
      }
    });

    test("should return 200 with empty list when requested page exceeds total pages", async () => {
      const SIZE = 1;
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
      const page = 2;
      const perPage = 10;
      const totalPages = Math.ceil(SIZE / perPage);
      const response = await testAgent.get(
        `/cultural-events?page=${page}&per-page=${perPage}`
      );
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.page).toBe(page);
      expect(response.body.perPage).toBe(perPage);
      expect(response.body.totalItems).toBe(SIZE);
      expect(response.body.totalPages).toBe(totalPages);
      expect(response.body.data).toHaveLength(0);
    });

    test("should return 400 when requested page is less than or equal to 0", async () => {
      expect((await testAgent.get("/cultural-events?page=0")).statusCode).toBe(
        StatusCodes.BAD_REQUEST
      );
      expect((await testAgent.get("/cultural-events?page=-1")).statusCode).toBe(
        StatusCodes.BAD_REQUEST
      );
    });
    test("should return 400 when requested per-page is less than or equal to 0", async () => {
      expect(
        (await testAgent.get("/cultural-events?per-page=0")).statusCode
      ).toBe(StatusCodes.BAD_REQUEST);
      expect(
        (await testAgent.get("/cultural-events?per-page=-1")).statusCode
      ).toBe(StatusCodes.BAD_REQUEST);
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
