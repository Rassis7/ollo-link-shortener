const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config({ path: path.resolve(__dirname, "./.env.test") });

jest.mock("ioredis", () => jest.requireActual("ioredis-mock"));

jest.mock("node:crypto", () => ({
  ...jest.requireActual("node:crypto"),
  randomUUID: jest.fn(),
  createHash: jest.fn(),
}));

jest.mock("mailersend", () => ({
  ...jest.requireActual("mailersend"),
  MailerSend: jest.fn().mockImplementation(() => ({
    sms: jest.fn(),
    token: jest.fn(),
    emailVerification: jest.fn(),
    others: jest.fn(),
    email: {
      send: jest.fn(),
    },
  })),
}));

require("./src/tests/server");
require("./src/tests/prisma");
require("./src/tests/redis");

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.useRealTimers();
});
