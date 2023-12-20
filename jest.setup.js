const dotenv = require("dotenv");
const path = require("node:path");

require("./src/tests");

dotenv.config({ path: path.resolve(__dirname, "./.env") });
