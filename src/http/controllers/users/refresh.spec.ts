import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Refresh Token e2e", () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    app.close();
  });

  it("Should be able to refresh token", async () => {
    await request(app.server).post("/users").send({
      name: "Giovanni",
      email: "giovaniname@hotmail.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/authenticate").send({
      email: "giovaniname@hotmail.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");
    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
