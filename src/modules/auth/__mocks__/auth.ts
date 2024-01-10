import { faker } from "@faker-js/faker";

export const mockAuthInput = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

export const mockAuthFindUserByEmailResponse = {
  id: faker.number.int({ min: 1, max: 100 }),
  createdAt: new Date(),
  name: faker.person.fullName(),
  ...mockAuthInput,
};
