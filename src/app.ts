import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { userRoutes } from "./http/controllers/users/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";
import { ZodError } from "zod";
import { env } from "./env";
import path from "node:path";

export const app = fastify();

let pathOpenApi = path.join(__dirname, "docs", "openapi.json");
if (env.NODE_ENV === "production") {
  pathOpenApi = path.join(__dirname, "openapi.json");
}

app.register(swagger, {
  mode: "static",
  specification: {
    path: pathOpenApi,
    baseDir: path.join(__dirname, "docs"),
  },
});

app.register(swaggerUi, {
  baseDir: path.join(__dirname, "docs"),
  routePrefix: "",
  staticCSP: true,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});
app.register(fastifyCookie);

app.register(userRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }
  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // Handle production error
  }

  return reply.status(500).send({ message: "Internal server error." });
});
