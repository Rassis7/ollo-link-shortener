import { faker } from "@faker-js/faker";
import { FindUserByEmailResponse } from "../schemas";

export const mockFindUserByEmailResponse: FindUserByEmailResponse = {
  id: faker.string.uuid(),
  createdAt: new Date(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  accountConfirmed: false,
};

export const mockFindUserByIdResponse: FindUserByEmailResponse = {
  id: faker.string.uuid(),
  createdAt: new Date(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  accountConfirmed: false,
};
