import { faker } from "@faker-js/faker";
import { FindUserByEmailResponse } from "../schemas/user.schema";

export const mockFindUserByEmailResponse: FindUserByEmailResponse = {
  id: faker.string.uuid(),
  createdAt: new Date(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
};
