import { faker } from "@faker-js/faker";
import { JsonValue } from "@prisma/client/runtime/library";

export const mockGetAllLinksResponse = Array(3)
  .fill(3)
  .map(() => ({
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
    } as JsonValue,
  }));
