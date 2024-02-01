import { faker } from "@faker-js/faker";
import { FindUsersResponse } from "../user.schema";

export const mockFindUsersResponse: FindUsersResponse = [
  {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
  },
  {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
  },
];
