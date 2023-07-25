import express, { Router, Request, Response } from "express";
import { Prisma, Node, LocationName } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

// Handler to create new nodes
router.post("/", async function (req: Request, res: Response) {
  const requestAttempt: Prisma.NodeCreateInput = req.body;

  // Attempt to save the node
  try {
    // Attempt to create in the database
    const newRequest = await PrismaClient.node.create({
      data: requestAttempt,
      include: {
        locationName: true,
      },
    });
    console.info("Successfully saved node"); // Log that it was successful

    res.send(newRequest); // Send the created content, so the client has the ID
  } catch (error) {
    // Log any failures
    console.error(`Unable to save node: ${error}`);
    res.sendStatus(400); // Send error
  }
});

// Handler to get all nodes
router.get("/", async function (req: Request, res: Response) {
  const result = await PrismaClient.node.findMany({
    include: {
      locationName: true,
      startEdges: true,
      endEdges: true,
    },
  });

  res.send(result);
});

// Route to get an individual node
router.get("/:id", async function (req: Request, res: Response) {
  try {
    // Try getting the request being talked about
    const request = await PrismaClient.node.findFirst({
      where: {
        id: parseInt(req.params["id"]),
      },
      include: {
        locationName: true,
        startEdges: true,
        endEdges: true,
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
    console.error(`Unable to find node ${error}`);

    // Output the error
    res.sendStatus(400);
  }
});

// Route to handle deleting an individual node
router.delete("/:id", async function (req: Request, res: Response) {
  try {
    // Try deleting the node
    await PrismaClient.node.delete({
      where: {
        id: parseInt(req.params["id"]),
      },
      include: {
        locationName: true,
      },
    });

    // If we got this far, send OK
    res.sendStatus(200);
  } catch (error) {
    // If it's a not found error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "2025"
    ) {
      // Send 404
      res.sendStatus(404);

      // Short-circuit
      return;
    }

    // Print any errors (at this point, we don't know what)
    console.error(`Unable to delete node ${error}`);

    // Send an error response
    res.sendStatus(400);
  }
});

// Handler to handle updating an individual node
router.patch("/:id", async function (req: Request, res: Response) {
  const updateInput = req.body as Prisma.NodeUpdateInput;

  // We need the node
  let newRequest: (Node & { locationName: LocationName | null }) | null = null;

  try {
    // Try doing the patch
    newRequest = await PrismaClient.node.update({
      data: updateInput,
      where: {
        id: parseInt(req.params["id"]),
      },
      include: {
        locationName: true,
      },
    });
  } catch (error) {
    // Handle any not found errors
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "2025"
    ) {
      res.sendStatus(404);

      // Short circuit
      return;
    }
    // Catch any errors (generic)
    console.error(`Unable to patch node: ${error}`);

    res.sendStatus(400); // Send error

    return;
  }

  // Set the status to be OK, since if we got this far the Prisma worked
  res.status(200);

  // Send the request we got back
  res.send(newRequest);
});

export default router;
