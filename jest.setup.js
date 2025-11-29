const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config({ path: path.resolve(__dirname, "./.env.test") });

jest.mock("ioredis", () => jest.requireActual("ioredis-mock"));

jest.mock("node:crypto", () => ({
  ...jest.requireActual("node:crypto"),
  randomUUID: jest.fn(),
  createHash: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  genSalt: jest.fn().mockResolvedValue("salt"),
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn().mockResolvedValue(true),
}));
const bcrypt = require("bcrypt");
const { Blob } = require("buffer");

if (typeof global.File === "undefined") {
  class PolyfillFile extends Blob {
    constructor(bits, name, options = {}) {
      super(bits, options);
      this.name = name;
      this.lastModified = options.lastModified ?? Date.now();
      this.webkitRelativePath = "";
    }
  }

  global.File = PolyfillFile;
}

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

jest.mock("@supabase/supabase-js", () => ({
  ...jest.requireActual("@supabase/supabase-js"),
  createClient: jest.fn().mockImplementation(() => ({
    from: jest.fn(),
    on: jest.fn(),
    auth: {
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      user: jest.fn(),
    },
    storage: {
      from: jest.fn().mockImplementation(() => ({
        upload: jest.fn(),
      })),
      createBucket: jest.fn(),
    },
  })),
}));

require("./src/tests/prisma");
require("./src/tests/server");
require("./src/tests/redis");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  bcrypt.genSalt.mockResolvedValue("salt");
  bcrypt.hash.mockResolvedValue("hashed-password");
  bcrypt.compare.mockResolvedValue(false);
});

afterAll(() => {
  jest.useRealTimers();
});
