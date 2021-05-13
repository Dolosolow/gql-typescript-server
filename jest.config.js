module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./src/jest/globalSetup.js",
  globalTeardown: "./src/jest/globalTeardown.js",
};
