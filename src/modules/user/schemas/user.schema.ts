import { User } from "@prisma/client";
import { z } from "zod";

export enum USER_ERRORS_RESPONSE {
  EMAIL_ALREADY_EXISTS = "O email já existe",
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

export const createUserSchema = z.object({
  ...userCore,
  password: z
    .string({
      required_error: "A senha é obrigatória",
      invalid_type_error: "A senha deve ser um texto",
    })
    .min(8, "A senha deve conter no mínimo 8 caracteres")
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
      "A senha não respeita os critérios de segurança"
    ),
});

export const createUserResponseSchema = z.object({
  id: z.string().uuid(),
  accountConfirmed: z.boolean(),
  ...userCore,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;

export type FindUserByEmailResponse = User | null;
export type FindUserByIdResponse = User | null;
