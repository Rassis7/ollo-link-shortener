import { faker } from "@faker-js/faker";
import { CreateUserInput, CreateUserResponse } from "../user.schema";

export const mockCreateUserInput: CreateUserInput = {
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password({
    length: 15,
    prefix: "_OPp1",
  }),
};

export const mockCreatedUserResponse = {
  id: faker.number.int({ min: 1, max: 100 }),
  createdAt: new Date(),
  ...mockCreateUserInput,
};

const { id, name, email } = mockCreatedUserResponse;

export const mockIntegrationCreateUserResponse: CreateUserResponse = {
  id,
  name,
  email,
};
