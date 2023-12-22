import { ErrorHandler } from "@/helpers";
import { mockZodError } from "@/helpers/__mocks__/mock-error-message";

describe("helpers/error-handler", () => {
  it("Should return ErrorHandler message when error is ZodError type", () => {
    const errorHandler = new ErrorHandler(mockZodError);

    expect(errorHandler.getMessage()).toStrictEqual([
      "first error",
      "second error",
    ]);
  });

  it("Should return ErrorHandler message when error is Javascript Error type", () => {
    const error = new Error("any error");
    const errorHandler = new ErrorHandler(error);
    expect(errorHandler.getMessage()).toBe("Error: any error");
  });

  it("Should return ErrorHandler message equal then message when that prop is passed", () => {
    const someMessage = "some input message";
    const error = new Error("any error");
    const errorHandler = new ErrorHandler(error, someMessage);
    expect(errorHandler.getMessage()).toBe(someMessage);
  });
});
