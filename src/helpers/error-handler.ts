import { ZodError } from "zod";

export enum APPLICATION_ERRORS {
  INTERNAL_ERROR = "Ocorreu um erro, por favor tente novamente",
}

type MessageWithObjet = Record<string, unknown>;

type ErrorInstanceType = {
  error: string | MessageWithObjet;
};

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

  constructor(error: unknown, message?: string) {
    const applicationError = error as unknown | ZodError;

    const errorUpdated = {} as ErrorInstanceType;

    if (applicationError instanceof ZodError) {
      const zodErrosMapped = mappedZodErrors(applicationError);

      Object.assign(errorUpdated, {
        error: zodErrosMapped,
      });
    }

    if (!errorUpdated.error) {
      const err = new Error(applicationError as any);
      Object.assign(errorUpdated, {
        error: message ?? err.message.replace("Error:", "").trim(),
      });
    }

    this.error = errorUpdated.error;
  }

  getError() {
    return this.error;
  }
}
