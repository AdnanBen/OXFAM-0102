import { afterEach, beforeEach, jest } from "@jest/globals";
import { Prisma, PrismaClient } from "@prisma/client";
import { spawnSync } from "child_process";
import { randomUUID } from "crypto";

/**
 * Testing with Prisma example: https://github.com/selimb/fast-prisma-tests
 */

// Create unique schema per test file
// https://selimb.hashnode.dev/speedy-prisma-pg-tests#heading-parallel-schemas
const DATABASE_SCHEMA_NAME = "test" + randomUUID().replace(/-/g, "");
const DATABASE_URL = `postgresql://postgres:postgres@localhost:5432/test?schema=${DATABASE_SCHEMA_NAME}`;

const mockPrisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
});

const tableNamesCsv = Prisma.dmmf.datamodel.models
  .map((m) => `"${DATABASE_SCHEMA_NAME}"."${m.name}"`)
  .join(", ");

beforeEach(async () => {
  await mockPrisma.$connect();
  spawnSync("./node_modules/.bin/prisma", ["migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL },
    stdio: [process.stdin, null, process.stderr],
    encoding: "utf-8",
  });
});

afterEach(async () => {
  await mockPrisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tableNamesCsv} RESTART IDENTITY CASCADE`
  );
  await mockPrisma.$disconnect();
});

jest.mock("../db", () => ({ __esModule: true, default: mockPrisma }));

export { mockPrisma };
