import { faker } from "@faker-js/faker";

export const mockChangePasswordInput = {
  linkId: faker.string.uuid(),
  password: faker.internet.password({ length: 10, prefix: "10A_" }),
};
