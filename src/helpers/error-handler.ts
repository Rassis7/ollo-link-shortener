import { ZodError } from "zod";

export enum APPLICATION_ERRORS {
  INTERNAL_ERROR = "Ocorreu um erro, por favor tente novamente",
}

type ErrorInstanceType = {
  message: string | string[];
  code?: string;
  statusCode?: number;
};
export class ErrorHandler {
  message: string[] | string;

  constructor(error: unknown, message?: string) {
    const applicationError = error as unknown | ZodError;

    const errorUpdated = {} as ErrorInstanceType;

    if (applicationError instanceof ZodError) {
      const message = applicationError.errors.map((error) => error.message);
      Object.assign(errorUpdated, {
        message,
      });
    }

    if (!errorUpdated.message) {
      const err = new Error(applicationError as any);
      Object.assign(errorUpdated, {
        message: message ?? err.message,
        code: err.name,
      });
    }

    this.message = errorUpdated.message;
  }

  getMessage() {
    return this.message;
  }
}
