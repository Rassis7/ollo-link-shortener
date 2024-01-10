import jwt from "jsonwebtoken";

const secretKey = String(process.env.FASTIFY_JWT_SECRET);

const payload = {
  id: 123,
  email: "john_doe@email.com",
  name: "John Doe",
};

const signOptions = {
  expiresIn: String(process.env.FASTIFY_JWT_SECRET_EXPIRES_IN),
};

const MOCK_JWT_TOKEN = jwt.sign(payload, secretKey, signOptions);

export { MOCK_JWT_TOKEN };
