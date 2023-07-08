import express, { Router, Request, Response } from "express";
import { Prisma, ComputerRequest } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

// Handler to create new computer requests
router.post("/", async function (req: Request, res: Response) {
  const requestAttempt: Prisma.ComputerRequestCreateInput = req.body;

  // Attempt to save the request
  try {
    // Attempt to create in the database
    await PrismaClient.computerRequest.create({ data: requestAttempt });
    console.info("Successfully saved computer service request"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save computer service request: ${error}`);
    res.sendStatus(400); // Send error
    return;
  }

  res.sendStatus(200); // Otherwise say it's fine
});

// Handler to get all computer requests
router.get("/", async function (req: Request, res: Response) {
  const result = await PrismaClient.computerRequest.findMany();

  res.send(result);
});

// Handler to handle updating an individual service request
router.patch("/:id", async function (req: Request, res: Response) {
  const updateInput = req.body as Prisma.ComputerRequestCreateInput;

  // We need the request
  let newRequest: ComputerRequest | null = null;

  try {
    // Try doing the patch
    newRequest = await PrismaClient.computerRequest.update({
      data: updateInput,
      where: {
        id: parseInt(req.params["id"]),
      },
    });
  } catch (error) {
    // Catch any errors
    console.error(`Unable to patch computer service request: ${error}`);

    res.sendStatus(400); // Send error

    return;
  }

  // Set the status to be OK, since if we got this far the Prisma worked
  res.status(200);

  // Send the request we got back
  res.send(newRequest);
});

export default router;
