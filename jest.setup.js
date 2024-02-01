const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config({ path: path.resolve(__dirname, "./.env") });

jest.mock("ioredis", () => jest.requireActual("ioredis-mock"));

jest.mock("node:crypto", () => ({
  ...jest.requireActual("node:crypto"),
  randomUUID: jest.fn(),
  createHash: jest.fn(),
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
