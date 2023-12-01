import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

export enum USER_ERRORS_RESPONSE {
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
}

const userCore = {
  email: z
    .string({
      required_error: "O email é obrigatório",
      invalid_type_error: "O email deve ser um texto",
    })
    .email(),
  name: z.string(),
};

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: "A senha é obrigatória",
    invalid_type_error: "A senha deve ser um texto",
  }),
});

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

const getUserResponseSchema = createUserResponseSchema;

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    getUserResponseSchema,
  },
  {
    $id: "userSchemas",
  }
);
