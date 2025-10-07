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
  logger:
    process.env.DEBUG_MODE === "true"
      ? {
          transport: {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          },
        }
      : false,
});

export { fastify as app, logger };
