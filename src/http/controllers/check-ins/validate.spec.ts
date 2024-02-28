import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";
import { string } from "zod";

describe("History (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("Should be able to validade user check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "javascript gym",
        description: "learn about js",
        phone: "19 8929192",
        latitude: -22.739967,
        longitude: -47.403436,
      },
    });
    const gymId = gym.id;

    await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .send({
        latitude: -22.739967,
        longitude: -47.403436,
      })
      .set("Authorization", `Bearer ${token}`);

    const responseHistory = await request(app.server)
      .get("/check-ins/history")
      .query({
        page: 1,
      })
      .set("Authorization", `Bearer ${token}`);

    const checkInId = responseHistory.body.checkIns[0];

    const response = await request(app.server)
      .patch(`/check-ins/${checkInId.id}/validate`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body.created_at).toBeDefined();
    expect(Date.parse(response.body.created_at));
  });
});
