import { faker } from "@faker-js/faker";
import { GenerateSessionProps, SessionProps } from "../schemas";

export const mockGenerationSessionInput: GenerateSessionProps = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  accountConfirmed: false,
};

export const mockSession: SessionProps = {
  ...mockGenerationSessionInput,
  enabled: true,
  exp: faker.date.future().getTime(),
  iat: faker.date.future().getTime(),
};

export const mockSessionWithConfirmedAccount: SessionProps = {
  ...mockGenerationSessionInput,
  enabled: true,
  exp: faker.date.future().getTime(),
  iat: faker.date.future().getTime(),
  accountConfirmed: true,
};
