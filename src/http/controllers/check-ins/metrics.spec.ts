import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("History (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("Should be able to get user metrics", async () => {
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

    const response = await request(app.server)
      .get("/check-ins/metrics")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkInsCount).toEqual(1);
  });
});
