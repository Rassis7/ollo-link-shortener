const dotenv = require("dotenv");
const path = require("node:path");
const { server } = require("./src/server");
const { redis } = require("./src/infra");

dotenv.config({ path: path.resolve(__dirname, "./.env") });

beforeEach(async () => {
  await server.ready();
});

afterEach(async () => {
  await server.close();
});

afterAll(async () => {
  await redis.quit();
});
