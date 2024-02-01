import { faker } from "@faker-js/faker";
import { SaveLinkInput } from "../shortener.schema";
import { Link } from "@prisma/client";

export const mockSaveLinkInput: SaveLinkInput = {
  redirectTo: faker.internet.url(),
  userId: faker.string.uuid(),
  alias: faker.lorem.word(),
  hash: faker.string.alphanumeric(8),
  active: true,
  validAt: faker.date.future().toISOString(),
  metadata: {
    title: faker.lorem.words(2),
    description: faker.lorem.sentences(),
    photo: faker.image.url(),
  },
};

export const mockSaveLinkResponse: Link = {
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

export const mockLinkToShortenerInput = {
  url: faker.internet.url(),
  alias: faker.lorem.word(),
  validAt: faker.date.future().toISOString(),
  metadata: {
    title: faker.lorem.words(2),
    description: faker.lorem.sentence(5),
    photo: faker.image.url(),
  },
};
