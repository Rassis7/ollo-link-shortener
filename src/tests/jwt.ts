import { faker } from "@faker-js/faker";
import { createSigner } from "fast-jwt";

export const MOCK_USER_ID = faker.string.uuid();
export const MOCK_USER_NAME = faker.person.fullName();

function tokenFactory({
  isAccessToken,
  expiresIn,
  secret,
}: {
  isAccessToken: boolean;
  secret: string;
  expiresIn: string;
}) {
  const SECRET_KEY = String(secret);
  const EXPIRES_IN = String(expiresIn);

  const MOCK_JWT_PAYLOAD = {
    id: MOCK_USER_ID,
  };

  const signSync = createSigner({ key: SECRET_KEY, expiresIn: EXPIRES_IN });

  return signSync(
    isAccessToken
      ? { ...MOCK_JWT_PAYLOAD, name: MOCK_USER_NAME }
      : MOCK_JWT_PAYLOAD
  );
}

export const MOCK_ACCESS_TOKEN = tokenFactory({
  isAccessToken: true,
  secret: process.env.FASTIFY_JWT_SECRET_ACCESS_TOKEN,
  expiresIn: process.env.FASTIFY_JWT_ACCESS_TOKEN_EXPIRES_IN,
});

export const MOCK_REFRESH_TOKEN = tokenFactory({
  isAccessToken: false,
  secret: process.env.FASTIFY_JWT_SECRET_REFRESH_TOKEN,
  expiresIn: process.env.FASTIFY_JWT_REFRESH_TOKEN_EXPIRES_IN,
});
