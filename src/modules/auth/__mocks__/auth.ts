import { faker } from "@faker-js/faker";

export const mockAuthInput = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

export const mockAuthFindUserByEmailResponse = {
  id: faker.string.uuid(),
  createdAt: new Date(),
  name: faker.person.fullName(),
  accountConfirmed: false,
  active: true,
  ...mockAuthInput,
};
