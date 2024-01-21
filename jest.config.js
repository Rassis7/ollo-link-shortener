/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.+)$": "<rootDir>/src/$1",
  },
  resetMocks: true,
  collectCoverage: true,
  enableGlobally: true,
  coverageProvider: "v8",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!<rootDir>/src/__tests__/**/*",
    "!<rootDir>/src/server.ts",
    "!<rootDir>/src/configurations/**/*",
    "!<rootDir>/src/tests/**/*",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
    },
  },
};
