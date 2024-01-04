const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config({ path: path.resolve(__dirname, "./.env") });

require("./src/tests/server");
require("./src/tests/prisma");
require("./src/tests/redis");

beforeEach(() => {
  jest.clearAllMocks();
});
