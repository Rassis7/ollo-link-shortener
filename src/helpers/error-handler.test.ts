import { ErrorHandler } from "@/helpers";
import { mockZodError } from "@/helpers/__mocks__/mock-error-message";

describe("helpers/error-handler", () => {
  it("Should return ErrorHandler message when error is ZodError type", () => {
    const errorHandler = new ErrorHandler(mockZodError);

    expect(errorHandler.getError()).toStrictEqual({
      first_field: {
        message: "first error",
        code: "invalid_string",
      },
      second_field: {
        message: "second error",
        code: "invalid_string",
      },
      ["third_field.other_field"]: {
        message: "third error",
        code: "invalid_type",
        typeError: {
          expected: "string",
          received: "number",
        },
      },
    });
  });

  it("Should return ErrorHandler message when error is Javascript Error type", () => {
    const error = new Error("any error");
    const errorHandler = new ErrorHandler(error);
    expect(errorHandler.getError()).toBe("any error");
  });

  it("Should return ErrorHandler message equal then message when that prop is passed", () => {
    const someMessage = "some input message";
    const error = new Error("any error");
    const errorHandler = new ErrorHandler(error, someMessage);
    expect(errorHandler.getError()).toBe(someMessage);
  });
});
