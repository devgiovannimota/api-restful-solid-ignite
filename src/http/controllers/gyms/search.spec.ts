import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Search E2E", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("Should be able to search gyms", async () => {
    await request(app.server).post("/users").send({
      name: "Giovanni",
      email: "giovaniname@hotmail.com",
      password: "123123",
    });

    const authResponse = await request(app.server).post("/authenticate").send({
      email: "giovaniname@hotmail.com",
      password: "123123",
    });
    const { token } = authResponse.body;

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
      .get("/gyms/search")
      .query({
        query: "gym",
        page: 1,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        gyms: expect.arrayContaining([
          expect.objectContaining({}),
          expect.objectContaining({}),
          expect.objectContaining({}),
        ]),
      })
    );
  });
});
