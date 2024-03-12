import { z } from "zod";
import { jwtAuthValues } from "../auth/auth.schema";

const sessionScheme = z.intersection(
  jwtAuthValues,
  z.object({
    email: z.string(),
    name: z.string(),
    enabled: z.boolean(),
  })
);

const generateSessionSchema = z.object({
  email: z.string(),
  name: z.string(),
  id: z.string(),
});

export type SessionProps = z.infer<typeof sessionScheme>;
export type GenerateSessionProps = z.infer<typeof generateSessionSchema>;
