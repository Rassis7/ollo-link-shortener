require("./src/tests/prisma");

const dotenv = require("dotenv");
const path = require("node:path");

require("./src/tests/redis");
require("./src/tests/server");

dotenv.config({ path: path.resolve(__dirname, "./.env") });

beforeEach(() => {
  jest.clearAllMocks();
});
