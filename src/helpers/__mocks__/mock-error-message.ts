import { ZodError } from "zod";

const mockZodError = new ZodError([
  {
    validation: "regex",
    code: "invalid_string",
    message: "first error",
    path: ["first_field"],
  },
  {
    validation: "regex",
    code: "invalid_string",
    message: "second error",
    path: ["second_field"],
  },
]);

export { mockZodError };
