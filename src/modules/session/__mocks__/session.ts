import { faker } from "@faker-js/faker";
import { SessionProps } from "../session.schema";

export const mockGenerationSessionInput = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
};

export const mockSession: SessionProps = {
  ...mockGenerationSessionInput,
  enabled: true,
  exp: faker.date.future().getTime(),
  iat: faker.date.future().getTime(),
};
