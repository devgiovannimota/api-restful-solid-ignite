import request from "supertest";
import { FastifyInstance } from "fastify";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false
) {
  await prisma.user.create({
    data: {
      name: "Giovanni mota",
      email: "giovaniname@hotmail.com",
      password_hash: await hash("123123", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });
  const authResponse = await request(app.server).post("/authenticate").send({
    email: "giovaniname@hotmail.com",
    password: "123123",
  });

  const { token } = authResponse.body;
  return { token };
}
