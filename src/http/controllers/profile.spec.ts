import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Profile e2e", () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    app.close();
  });

  it("Should be able to get user profile", async () => {
    await request(app.server).post("/users").send({
      name: "Giovanni",
      email: "giovaniname@hotmail.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/authenticate").send({
      email: "giovaniname@hotmail.com",
      password: "123456",
    });

    const { token } = authResponse.body;
    const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: "giovaniname@hotmail.com",
      })
    );
  });
});
