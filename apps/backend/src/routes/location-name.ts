import express, { Router, Request, Response } from "express";
import { Prisma, LocationName } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

// Handler to create new location names
router.post("/", async function (req: Request, res: Response) {
  const requestAttempt: Prisma.LocationNameCreateInput = req.body;

  // Attempt to save the location name
  try {
    // Attempt to create in the database
    const newRequest = await PrismaClient.locationName.create({
      data: requestAttempt,
      include: {
        node: true,
      },
    });
    console.info("Successfully saved location name"); // Log that it was successful

    res.send(newRequest); // Send the created content, so the client has the ID
  } catch (error) {
    // Log any failures
    console.error(`Unable to save location name: ${error}`);
    res.sendStatus(400); // Send error
  }
});

// Handler to get all location names
router.get("/", async function (req: Request, res: Response) {
  const result = await PrismaClient.locationName.findMany();

  res.send(result);
});

// Route to get an individual location name
router.get("/:longName", async function (req: Request, res: Response) {
  try {
    // Try getting the request being talked about
    const request = await PrismaClient.locationName.findFirst({
      where: {
        longName: req.params["longName"],
      },
      include: {
        node: true,
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
    console.error(`Unable to find location name ${error}`);

    // Output the error
    res.sendStatus(400);
  }
});

// Route to handle deleting an individual location name
router.delete("/:longName", async function (req: Request, res: Response) {
  try {
    // Try deleting the location name
    await PrismaClient.locationName.delete({
      where: {
        longName: req.params["longName"],
      },
      include: {
        node: true,
      },
    });

    // If we got this far, send OK
    res.sendStatus(200);
  } catch (error) {
    // If it's a not found error
    if (error instanceof Prisma.NotFoundError) {
      // Send 404
      res.sendStatus(404);

      // Short-circuit
      return;
    }

    // Print any errors (at this point, we don't know what)
    console.error(`Unable to delete location name ${error}`);

    // Send an error response
    res.sendStatus(400);
  }
});

// Handler to handle updating an individual location name
router.patch("/:id", async function (req: Request, res: Response) {
  const updateInput = req.body as Prisma.LocationNameUpdateInput;

  // We need the location name
  let newRequest: LocationName | null = null;

  try {
    // Try doing the patch
    newRequest = await PrismaClient.locationName.update({
      data: updateInput,
      where: {
        longName: req.params["id"],
      },
      include: {
        node: true,
      },
    });
  } catch (error) {
    // Handle any not found errors
    if (error instanceof Prisma.NotFoundError) {
      res.sendStatus(404);

      // Short circuit
      return;
    }
    // Catch any errors (generic)
    console.error(`Unable to patch location name: ${error}`);

    res.sendStatus(400); // Send error

    return;
  }

  // Set the status to be OK, since if we got this far the Prisma worked
  res.status(200);

  // Send the request we got back
  res.send(newRequest);
});

export default router;
