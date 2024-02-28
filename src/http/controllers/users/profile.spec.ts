import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";

describe("Profile e2e", () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    app.close();
  });

  it("Should be able to get user profile", async () => {
    const { token } = await createAndAuthenticateUser(app);
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
