import request from "supertest";
import { FastifyInstance } from "fastify";

export async function createAndAuthenticateUser(app: FastifyInstance) {
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
  return { token };
}
