// copy-env.js
const fs = require("fs");
const path = require("path");

const source = path.resolve(__dirname, "..", ".env");
const destination = path.resolve(__dirname, "..", "dist", ".env");

fs.copyFileSync(source, destination);
