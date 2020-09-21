module.exports = {
  bail: 1,
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  setupFiles: ["./__tests__/setupEnviroment.ts"],
};
