import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";

const secretKey = String(process.env.FASTIFY_JWT_SECRET);

export const MOCK_JWT_PAYLOAD = {
  id: faker.string.uuid(),
};

const signOptions = {
  expiresIn: String(process.env.FASTIFY_JWT_SECRET_EXPIRES_IN),
};

const MOCK_JWT_TOKEN = jwt.sign(MOCK_JWT_PAYLOAD, secretKey, signOptions);

export { MOCK_JWT_TOKEN };
