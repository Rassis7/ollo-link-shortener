import { faker } from "@faker-js/faker";
import { Link } from "@prisma/client";
import { EditLinkInput } from "../schemas";

export const mockEditLinkResponse: Link = {
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
    description: faker.lorem.words(5),
    photo: faker.image.url(),
  },
};

export const mockEditLinkInput: EditLinkInput = {
  id: faker.string.uuid(),
  redirectTo: faker.internet.url(),
  alias: faker.lorem.word(),
  hash: faker.string.alphanumeric(8),
  active: true,
  validAt: faker.date.future().toISOString(),
  metadata: {
    title: faker.lorem.words(2),
    description: faker.lorem.words(5),
    photo: faker.image.url(),
  },
};
