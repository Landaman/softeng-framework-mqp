import { it, beforeEach, describe, assert } from "vitest";
import { Prisma, PrismaClient } from "database";
import app from "../src/app.ts";

const prisma = new PrismaClient();

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

// Describe all computer requests tests
describe("/api/computer-requests", async () => {
  describe("[POST] /api/computer-requests/", () => {
    it("should respond with a `200` status code and request details", async () => {
      console.log(app);
    });
  });

  describe("[GET] /api/computer-requests/", () => {
    it("should respond with a `200` status code and all request details", async () => {
      assert(2 == 2);
    });
  });

  describe("[GET] /api/computer-requests/:id", () => {
    it("should respond with a `200` status code and request details", async () => {
      assert(2 == 2);
    });
  });

  describe("[DELETE] /api/computer-requests/", () => {
    it("should respond with a `200` status code and delete the request", async () => {
      assert(2 == 2);
    });
  });

  describe("[PATCH] /api/computer-requests/", () => {
    it("should respond with a `200` status code and update request details", async () => {
      assert(2 == 2);
    });
  });
});
