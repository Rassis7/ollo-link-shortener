import { faker } from "@faker-js/faker";
import { Link } from "@prisma/client";
import { GetRedirectLinkValuesInput } from "../schemas";

export const mockGetRedirectLinkValuesResponse: Link = {
  id: faker.string.uuid(),
  redirectTo: faker.internet.url(),
  userId: faker.string.uuid(),
  alias: faker.lorem.word(),
  hash: faker.string.alphanumeric(8),
  active: true,
  validAt: faker.date.future(),
  createdAt: faker.date.past(),
  metadata: {
    title: faker.lorem.words(2),
    description: faker.lorem.sentences(),
    photo: faker.image.url(),
  },
};

export const mockGetRedirectValuesInput: GetRedirectLinkValuesInput = {
  redirectTo: faker.internet.url(),
  userId: faker.string.uuid(),
  alias: faker.lorem.word(),
};
