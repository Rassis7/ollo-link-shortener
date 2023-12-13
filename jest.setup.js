const dotenv = require("dotenv");
const path = require("node:path");
const { server } = require("./src/server");
const { redis } = require("./src/infra");

dotenv.config({ path: path.resolve(__dirname, "./.env") });

afterAll(() => {
  server.close();
  redis.quit();
});
