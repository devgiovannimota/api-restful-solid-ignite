import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { verifyJwt } from "../../middlewares/verify-jwt";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/authenticate", authenticate);

  app.get("/me", { onRequest: [verifyJwt] }, profile);
}
