import { z } from "zod";

export enum REDIRECTOR_ERRORS_RESPONSE {
  LINK_NOT_FOUND = "Link não encontrado ou inativo",
}

export const redirectParamsSchema = z.object({
  hash: z
    .string({
      required_error: "O hash é obrigatório",
      invalid_type_error: "O hash deve ser uma string",
    })
    .trim()
    .min(1, "O hash deve ser informado"),
});

export type RedirectParams = z.infer<typeof redirectParamsSchema>;
