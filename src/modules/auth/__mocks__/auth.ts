import { faker } from "@faker-js/faker";

export const mockAuthInput = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

export const mockAuthFindUserByEmailResponse = {
  id: faker.string.uuid(),
  createdAt: new Date(),
  name: faker.person.fullName(),
  ...mockAuthInput,
};

export const mockGenerationSessionInput = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
};
