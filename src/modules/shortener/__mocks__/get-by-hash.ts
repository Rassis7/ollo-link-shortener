import { faker } from "@faker-js/faker";
import { Link } from "@prisma/client";
import { GetByLinkHashFromCacheResponse } from "../shortener.schema";

export const mockGetLinkByHashResponse: Link = {
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
};

export const mockHashInput = faker.string.alphanumeric(8);

export const mockGetLinkByHashFromCacheResponse: GetByLinkHashFromCacheResponse =
  {
    counter: faker.number.int({ min: 0, max: 100 }),
    redirectTo: faker.internet.url(),
    active: true,
    validAt: faker.date.future().toISOString(),
  };
