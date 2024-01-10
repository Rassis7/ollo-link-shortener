import { faker } from "@faker-js/faker";
import { FindUsersResponse } from "../user.schema";

export const mockFindUsersResponse: FindUsersResponse = [
  {
    id: 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
  },
  {
    id: 2,
    name: faker.person.fullName(),
    email: faker.internet.email(),
  },
];
