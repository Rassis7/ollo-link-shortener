import { faker } from "@faker-js/faker";

export const mockUser = {
  id: faker.string.uuid(),
  createdAt: new Date(),
  name: faker.person.fullName(),
  accountConfirmed: false,
  email: faker.internet.email(),
  password: faker.internet.password(),
  active: true,
};
