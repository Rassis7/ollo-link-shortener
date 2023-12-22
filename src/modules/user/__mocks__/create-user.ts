import { faker } from "@faker-js/faker";
import { CreateUserInput } from "../user.schema";

export const mockCreateUserInput: CreateUserInput = {
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
};

export const mockCreatedUserResponse = {
  id: faker.number.int({ min: 1, max: 100 }),
  createdAt: new Date(),
  ...mockCreateUserInput,
};
