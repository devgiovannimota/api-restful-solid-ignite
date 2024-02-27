import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middlewares/verify-jwt";

import { create } from "./create";
import { search } from "./search";
import { nearby } from "./nearby";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwt);
  app.post("/gyms", create);
  app.get("/gyms/search", search);
  app.get("/gyms/nearby", nearby);
}
