import { faker } from "@faker-js/faker";
import { GetByLinkHashFromCacheResponse } from "../schemas";

export const mockHashInput = faker.string.alphanumeric(8);

export const mockGetLinkByHashFromCacheResponse: GetByLinkHashFromCacheResponse =
  {
    counter: faker.number.int({ min: 0, max: 100 }),
    redirectTo: faker.internet.url(),
    active: true,
    validAt: faker.date.future().toISOString(),
  };
