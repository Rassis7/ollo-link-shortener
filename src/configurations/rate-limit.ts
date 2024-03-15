import { app as fastify } from "./app";

fastify.register(import("@fastify/rate-limit"), {
  max: Number(process.env.FASTIFY_RATE_LIMIT_MAX),
  timeWindow: String(process.env.FASTIFY_RATE_LIMIT_TIME_WINDOW),
});
