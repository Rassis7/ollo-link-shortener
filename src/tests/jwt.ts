import { faker } from "@faker-js/faker";
import { createSigner } from "fast-jwt";

export const SECRET_KEY = String(process.env.FASTIFY_JWT_SECRET);
export const EXPIRES_IN = String(process.env.FASTIFY_JWT_SECRET_EXPIRES_IN);

const signSync = createSigner({ key: SECRET_KEY, expiresIn: EXPIRES_IN });

export const MOCK_JWT_PAYLOAD = {
  id: faker.string.uuid(),
};

export const MOCK_JWT_TOKEN = signSync(MOCK_JWT_PAYLOAD);
