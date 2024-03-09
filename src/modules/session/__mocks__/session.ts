import { faker } from "@faker-js/faker";

export const mockGenerationSessionInput = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
};
