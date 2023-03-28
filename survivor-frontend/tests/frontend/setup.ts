import { jest } from "@jest/globals";
import _default from "next/dist/client/router";

jest.mock("../../src/env/env", () => ({ env: {} }));
jest.mock("../../src/server/auth", () => ({}));
jest.mock("../../src/utils/useRouterRefresh", () => ({
  __esModule: true,
  default: () => [() => null, false],
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    events: { on: jest.fn(), off: jest.fn() },
  }),
}));
