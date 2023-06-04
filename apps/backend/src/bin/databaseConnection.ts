import { PrismaClient } from "database";

// Create the prisma client, this automatically connects to the database
const client = new PrismaClient();

// Export the client
export default client;

// On process exit, automatically disconnect the client
process.on("beforeExit", async () => {
  console.info("Starting database shutdown...");
  await client.$disconnect();
  console.log("Database shutdown complete");
  process.exit(0);
});
