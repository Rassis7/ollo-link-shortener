import { ZodError } from "zod";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { app as fastify } from "./app";

fastify.setErrorHandler(function (e, _, reply) {
  const errorHandler = new ErrorHandler(e);
  this.log.error(errorHandler);

  if (e instanceof ZodError) {
    reply.code(HTTP_STATUS_CODE.BAD_REQUEST);
  }

  if (e.statusCode === HTTP_STATUS_CODE.NOT_FOUND) {
    reply.code(HTTP_STATUS_CODE.NOT_FOUND);
    errorHandler.error = "Rota não encontrada";
  }

  if (e.statusCode === HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR) {
    reply.code(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    errorHandler.error = "Ocorreu um erro interno";
  }

  if (e.statusCode === HTTP_STATUS_CODE.TOO_MANY_REQUESTS) {
    reply.code(HTTP_STATUS_CODE.TOO_MANY_REQUESTS);
    errorHandler.error =
      "Você atingiu o limite da taxa! Aguarde 1 minuto, por favor!";
  }

  if (e.statusCode === HTTP_STATUS_CODE.UNAUTHORIZED) {
    reply.code(HTTP_STATUS_CODE.UNAUTHORIZED);
    errorHandler.error = "Não autorizado";
  }

  reply.send(errorHandler);
});
