import { faker } from "@faker-js/faker";
import { FindUserByEmailResponse } from "../user.schema";

export const mockFindUserByEmailResponse: FindUserByEmailResponse = {
  id: faker.number.int({ min: 1, max: 100 }),
  createdAt: new Date(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
};
