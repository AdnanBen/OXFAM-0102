/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      testEnvironment: "<rootDir>/tests/end-to-end/environment.ts",
      testMatch: ["<rootDir>/tests/end-to-end/**/*.test.ts"],
    },
    {
      setupFilesAfterEnv: ["<rootDir>/tests/frontend/setup.ts"],
      testMatch: ["<rootDir>/tests/frontend/**/*.test.tsx"],
      testEnvironment: "jsdom",
      moduleNameMapper: {
        "\\.css$": "identity-obj-proxy",
      },
    },
  ],
  testTimeout: 10000,
};
