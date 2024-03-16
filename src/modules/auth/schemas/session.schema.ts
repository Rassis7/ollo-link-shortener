import { z } from "zod";
import { jwtAuthValues } from "./auth.schema";

export const sessionSchema = z.intersection(
  jwtAuthValues,
  z.object({
    email: z.string(),
    name: z.string(),
    enabled: z.boolean(),
    accountConfirmed: z.boolean(),
  })
);

const generateSessionSchema = z.object({
  email: z.string(),
  name: z.string(),
  id: z.string(),
  accountConfirmed: z.boolean(),
});

export type SessionProps = z.infer<typeof sessionSchema>;
export type GenerateSessionProps = z.infer<typeof generateSessionSchema>;
