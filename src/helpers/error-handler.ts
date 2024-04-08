/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyError } from "fastify";
import { ZodError } from "zod";

export enum APPLICATION_ERRORS {
  INTERNAL_ERROR = "Ocorreu um erro, por favor tente novamente",
}

type MessageWithObjet = Record<string, unknown>;

type ErrorInstanceType = {
  error: string | MessageWithObjet;
  code?: string;
};

type ErrorUnion = unknown | ZodError | FastifyError;

function isFastifyError(error: any): error is FastifyError {
  return typeof error.code === "string" && typeof error.name === "string";
}

function mappedZodErrors(zodErrors: ZodError) {
  const zodErrosMapped = {};

  zodErrors.errors.forEach((error) => {
    let mappedErrors = {};

    if (error.code === "invalid_type") {
      mappedErrors = {
        typeError: {
          expected: error.expected,
          received: error.received,
        },
      };
    }

    Object.assign(zodErrosMapped, {
      [error.path.join(".")]: {
        message: error.message,
        code: error.code,
        ...mappedErrors,
      },
    });
  });

  return zodErrosMapped;
}
export class ErrorHandler {
  error: string | MessageWithObjet;
  code?: string;

  constructor(error: ErrorUnion, message?: string) {
    const errorUpdated = {} as ErrorInstanceType;

    if (error instanceof ZodError) {
      const zodErrosMapped = mappedZodErrors(error);

      Object.assign(errorUpdated, {
        error: zodErrosMapped,
      });
    }

    if (!errorUpdated.error && isFastifyError(error)) {
      const err = new Error(error.message);
      Object.assign(errorUpdated, {
        error: err.message.replace("Error:", "").trim(),
        code: error.code,
      });
    }

    if (!errorUpdated?.error) {
      const err = new Error(error as any);
      Object.assign(errorUpdated, {
        error: message ?? err.message.replace("Error:", "").trim(),
      });
    }

    this.error = errorUpdated.error;
    this.code = errorUpdated?.code;
  }

  getError() {
    return this.error;
  }
}
