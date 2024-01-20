import { faker } from "@faker-js/faker";
import { Link } from "@prisma/client";

export const mockGetLinkByAliasResponse: Link[] = [
  {
    id: faker.number.int({ min: 1, max: 10 }),
    redirectTo: faker.internet.url(),
    userId: faker.number.int({ min: 1, max: 10 }),
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
  },
  {
    id: faker.number.int({ min: 1, max: 10 }),
    redirectTo: faker.internet.url(),
    userId: faker.number.int({ min: 1, max: 10 }),
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
  },
];

export const mockGetLinkByAliasInput = {
  hash: faker.string.alphanumeric(8),
  alias: faker.lorem.word(),
};
