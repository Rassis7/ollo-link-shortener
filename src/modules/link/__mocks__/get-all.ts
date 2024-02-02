import { faker } from "@faker-js/faker";
import { JsonValue } from "@prisma/client/runtime/library";

export const mockGetAllLinksResponse = Array(3)
  .fill(3)
  .map(() => ({
    redirectTo: faker.internet.url(),
    alias: faker.lorem.word(),
    hash: faker.string.alphanumeric(8),
    active: true,
    validAt: faker.date.future(),
    metadata: {
      title: faker.lorem.words(2),
      description: faker.lorem.sentences(),
      photo: faker.image.url(),
    } as JsonValue,
  }));
