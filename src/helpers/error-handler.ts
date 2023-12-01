import { type FastifyError } from "fastify";

export class ErrorHandler {
  code: string;
  message: string;

  constructor(error: unknown, message?: string) {
    const errorUpdated: FastifyError = {
      ...(error as FastifyError),
      message: message ?? (error as FastifyError).message,
    };

    this.code = errorUpdated.code;
    this.message = errorUpdated.message;
  }
}
