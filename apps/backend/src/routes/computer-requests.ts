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
    const newRequest = await PrismaClient.computerRequest.create({
      data: requestAttempt,
    });
    console.info("Successfully saved computer service request"); // Log that it was successful

    res.send(newRequest); // Send the created content, so the client has the ID
  } catch (error) {
    // Log any failures
    console.error(`Unable to save computer service request: ${error}`);
    res.sendStatus(400); // Send error
  }
});

// Handler to get all computer requests
router.get("/", async function (_req: Request, res: Response) {
  const result = await PrismaClient.computerRequest.findMany();

  res.send(result);
});

// Route to get an individual service request
router.get("/:id", async function (req: Request, res: Response) {
  try {
    // Try getting the request being talked about
    const request = await PrismaClient.computerRequest.findFirst({
      where: {
        id: parseInt(req.params["id"]),
      },
    });

    // If the request is null, the ID was bad
    if (request === null) {
      res.sendStatus(404); // Send 404
    } else {
      res.send(request); // Otherwise, send the content
    }
    // Catch any errors (presumably in parsing)
  } catch (error) {
    // Print the error
    console.error(`Unable to find service request ${error}`);

    // Output the error
    res.sendStatus(400);
  }
});

// Route to handle deleting an individual service request
router.delete(":/id", async function (req: Request, res: Response) {
  try {
    // Try deleting the service request
    await PrismaClient.computerRequest.delete({
      where: {
        id: parseInt(req.params["id"]),
      },
    });

    // If we got this far, send OK
    res.sendStatus(200);
  } catch (error) {
    // If it's a not found error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // Send 404
      res.sendStatus(404);

      // Short-circuit
      return;
    }

    // Print any errors (at this point, we don't know what)
    console.error(`Unable to delete service request ${error}`);

    // Send an error response
    res.sendStatus(400);
  }
});

// Handler to handle updating an individual service request
router.patch("/:id", async function (req: Request, res: Response) {
  const updateInput = req.body as Prisma.ComputerRequestUpdateInput;

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
    // Handle any not found errors
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.sendStatus(404);

      // Short circuit
      return;
    }
    // Catch any errors (generic)
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
