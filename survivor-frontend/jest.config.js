/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      // setupFilesAfterEnv: ["<rootDir>/tests/end-to-end/setup.ts"],
      testEnvironment: "<rootDir>/tests/end-to-end/environment.ts",
      testMatch: ["<rootDir>/tests/end-to-end/**/*.test.ts"],
    },
  ],
  testTimeout: 10000,
};
