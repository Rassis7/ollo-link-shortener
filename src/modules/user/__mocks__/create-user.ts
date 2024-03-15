import { faker } from "@faker-js/faker";
import { CreateUserInput, CreateUserResponse } from "../schemas";

export const mockCreateUserInput: CreateUserInput = {
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password({
    length: 15,
    prefix: "_OPp1",
  }),
};

export const mockCreatedUserResponse = {
  id: faker.string.uuid(),
  createdAt: new Date(),
  accountConfirmed: false,
  ...mockCreateUserInput,
};

const { id, name, email, accountConfirmed } = mockCreatedUserResponse;

export const mockIntegrationCreateUserResponse: CreateUserResponse = {
  id,
  name,
  email,
  accountConfirmed,
};
