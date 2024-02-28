import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Create (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("Should be able to create a check-in", async () => {
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
        title: "javascript gym",
        description: "learn about js",
        phone: "19 8929192",
        latitude: 23.2323,
        longitude: 23.32323,
      })
      .set("Authorization", `Bearer ${token}`);

    const gymResponse = await request(app.server).post("/gyms/search").query({
      query: "gym",
      page: 1,
    });

    const response = await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(201);
  });
});
