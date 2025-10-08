import Fastify from "fastify";
import pretty from "pino-pretty";
import pino from "pino";

const logLevel =
  process.env.PINO_LOG_LEVEL ??
  (process.env.DEBUG_MODE === "true" ? "debug" : "info");

const logger = pino(
  {
    level: logLevel,
  },
  pretty({
    colorize: true,
    sync: true,
  })
);

const fastify = Fastify({
  logger:
    process.env.DEBUG_MODE === "true"
      ? {
          level: logLevel,
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
