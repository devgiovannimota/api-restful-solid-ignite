import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Authenticate e2e", () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    app.close();
  });

  it("Should be able to authenticate user", async () => {
    await request(app.server).post("/users").send({
      name: "Giovanni",
      email: "giovaniname@hotmail.com",
      password: "123456",
    });

    const response = await request(app.server).post("/authenticate").send({
      email: "giovaniname@hotmail.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
  it("Should not be able to authenticate with wrong email", async () => {
    await request(app.server).post("/users").send({
      name: "Giovanni",
      email: "giovaniname@hotmail.com",
      password: "123456",
    });

    const response = await request(app.server).post("/authenticate").send({
      email: "giovaniname@hotmail.cm",
      password: "123456",
    });

    expect(response.statusCode).toEqual(400);
  });
});
