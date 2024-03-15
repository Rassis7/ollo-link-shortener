import { faker } from "@faker-js/faker";
import {
  GenerateSessionProps,
  SessionProps,
  sessionSchema,
} from "../schemas/session.schema";

export const mockGenerationSessionInput: GenerateSessionProps = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
};

export const mockSession: SessionProps = {
  ...sessionSchema._output,
  enabled: true,
  exp: faker.date.future().getTime(),
  iat: faker.date.future().getTime(),
};
