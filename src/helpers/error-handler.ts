import { type FastifyError } from "fastify";

export class ErrorHandler {
  code: string;
  message: string;
  private statusCode?: number;
  private fastifyErrorInfos: Partial<FastifyError>;

  constructor(error: unknown, message?: string) {
    const errorUpdated: FastifyError = {
      ...(error as FastifyError),
      message: message ?? (error as FastifyError).message,
    };

    this.code = errorUpdated.code;
    this.message = errorUpdated.message;
    this.statusCode = errorUpdated.statusCode;
    this.fastifyErrorInfos = error as FastifyError;
  }

  getStatusCode() {
    return this?.statusCode;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }

  getCompleteInfos() {
    return this.fastifyErrorInfos;
  }
}
