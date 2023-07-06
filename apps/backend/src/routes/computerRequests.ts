import express, { Router, Request, Response } from "express";
import { Prisma } from "database";
import PrismaClient from "../bin/databaseConnection.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  const requestAttempt: Prisma.ComputerRequestCreateInput = req.body;

  // Attempt to save the request
  try {
    // Attempt to create in the database
    await PrismaClient.computerRequest.create({ data: requestAttempt });
    console.info("Successfully saved computer service request"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save computer service request ${error}: ${error}`);
    res.sendStatus(400); // Send error
    return;
  }

  res.sendStatus(200); // Otherwise say it's fine
});

export default router;
