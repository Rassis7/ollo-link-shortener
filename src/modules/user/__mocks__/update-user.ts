import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";

export const mockUpdateUserResponse: User = {
  id: faker.string.uuid(),
  createdAt: new Date(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  accountConfirmed: true,
  active: true,
};

export const mockUpdateUserInput = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  active: true,
};
