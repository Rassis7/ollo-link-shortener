import { ZodError } from "zod";
import { ErrorHandler } from "@/helpers";
import { app as fastify } from "./app";

fastify.setErrorHandler(function (e, _, reply) {
  const errorHandler = new ErrorHandler(e);
  this.log.error(errorHandler);

  if (e instanceof ZodError) {
    reply.code(400);
  }

  if (e.statusCode === 404) {
    reply.code(404);
    errorHandler.error = "Rota não encontrada";
  }

  if (e.statusCode === 500) {
    reply.code(500);
    errorHandler.error = "Ocorreu um erro interno";
  }

  if (e.statusCode === 429) {
    reply.code(429);
    errorHandler.error =
      "Você atingiu o limite da taxa! Aguarde 1 minuto, por favor!";
  }

  if (e.statusCode === 401) {
    reply.code(401);
    errorHandler.error = "Não autorizado";
  }

  reply.send(errorHandler);
});
