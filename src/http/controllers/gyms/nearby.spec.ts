import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";

describe("Nearby E2E", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("Should be able to search nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .send({
        title: "nearby gym",
        description: "learn about js",
        phone: "19 8929192",
        latitude: -22.742725,
        longitude: -47.405502,
      })
      .set("Authorization", `Bearer ${token}`);

    await request(app.server)
      .post("/gyms")
      .send({
        title: "nearby gym",
        description: "learn about js",
        phone: "19 8929192",
        latitude: -22.739967,
        longitude: -47.403436,
      })
      .set("Authorization", `Bearer ${token}`);

    await request(app.server)
      .post("/gyms")
      .send({
        title: "far gym",
        description: "learn about js",
        phone: "19 8929192",
        latitude: -22.496058,
        longitude: -47.541788,
      })
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -22.74671,
        longitude: -47.410184,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "nearby gym",
        }),
      ])
    );
  });
});
