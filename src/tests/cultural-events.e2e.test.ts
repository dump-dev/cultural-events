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
import { makeFakeCulturalEventData } from "./utils/cultural-event-helper";
import { StatusCodes } from "http-status-codes";

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
        expect(response.body.location.address).toBe(
          culturalEvent.location.address
        );
        expect(response.body.location.city).toBe(culturalEvent.location.city);
        expect(response.body.location.state).toBe(culturalEvent.location.state);
        expect(response.body.location.country).toBe(
          culturalEvent.location.country
        );
        expect(response.body.location.zipCode).toBe(
          culturalEvent.location.zipCode
        );
        expect(response.body.location).not.toHaveProperty("id");
      });
    });
  });
});
