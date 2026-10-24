import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  moduleNameMapper: { "^@/test/(.*)$": "<rootDir>/test/$1", "^@/(.*)$": "<rootDir>/src/$1" },
};

export default createJestConfig(config);
