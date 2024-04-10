import { faker } from "@faker-js/faker";

export const mockGenerationSessionInput = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
};

export const mockSession = {
  ...mockGenerationSessionInput,
  enabled: true,
  exp: faker.date.future().getTime(),
  iat: faker.date.future().getTime(),
};

export const mockSessionWithConfirmedAccount = {
  ...mockGenerationSessionInput,
  enabled: true,
  exp: faker.date.future().getTime(),
  iat: faker.date.future().getTime(),
  accountConfirmed: true,
};
