import { test, assert, beforeEach, beforeAll, afterAll } from "vitest";
import { Prisma, PrismaClient } from "database";
import * as child_process from "child_process";

const prisma = new PrismaClient();

let childProcess: child_process.ChildProcess;

beforeAll(() => {
  childProcess = child_process.fork("./src/bin/www.ts");
});

afterAll(() => {
  childProcess.kill();
});

// Before each test, clear out the database
beforeEach(async () => {
  const tables = Prisma.dmmf.datamodel.models
    .map((model) => model.dbName)
    .filter((table) => table);

  // Clear the database
  await prisma.$transaction([
    ...tables.map((table) =>
      prisma.$executeRawUnsafe(`TRUNCATE ${table} CASCADE;`)
    ),
  ]);
});

test("post, get one", () => {
  assert(2 === 2);
});
