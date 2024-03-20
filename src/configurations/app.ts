import Fastify from "fastify";
import pretty from "pino-pretty";
import pino from "pino";

const logger = pino(
  pretty({
    colorize: true,
    sync: true,
  })
);

const fastify = Fastify({
  logger: process.env.DEBUG_MODE === "true" && logger,
});

export { fastify as app, logger };
