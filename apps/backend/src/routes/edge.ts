import express, { Router, Request, Response } from "express";
import { Prisma, Edge, Node } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

// Handler to create new edges
router.post("/", async function (req: Request, res: Response) {
  const requestAttempt: Prisma.EdgeCreateInput = req.body;

  // Attempt to save the edge
  try {
    // Attempt to create in the database
    const newRequest = await PrismaClient.edge.create({
      data: requestAttempt,
      include: {
        startNode: true,
        endNode: true,
      },
    });
    console.info("Successfully saved edge"); // Log that it was successful

    res.send(newRequest); // Send the created content, so the client has the ID
  } catch (error) {
    // Log any failures
    console.error(`Unable to save edge: ${error}`);
    res.sendStatus(400); // Send error
  }
});

// Handler to get all edges
router.get("/", async function (req: Request, res: Response) {
  const result = await PrismaClient.edge.findMany({
    include: {
      startNode: true,
      endNode: true,
    },
  });

  res.send(result);
});

// Route to get an individual edge
router.get("/:id", async function (req: Request, res: Response) {
  try {
    // Try getting the request being talked about
    const request = await PrismaClient.edge.findFirst({
      where: {
        id: parseInt(req.params["id"]),
      },
      include: {
        startNode: true,
        endNode: true,
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
    console.error(`Unable to find edge ${error}`);

    // Output the error
    res.sendStatus(400);
  }
});

// Route to handle deleting an individual edge
router.delete(":/id", async function (req: Request, res: Response) {
  try {
    // Try deleting the edge
    await PrismaClient.edge.delete({
      where: {
        id: parseInt(req.params["id"]),
      },
      include: {
        startNode: true,
        endNode: true,
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
    console.error(`Unable to delete edge ${error}`);

    // Send an error response
    res.sendStatus(400);
  }
});

// Handler to handle updating an individual edge
router.patch("/:id", async function (req: Request, res: Response) {
  const updateInput = req.body as Prisma.EdgeUpdateInput;

  // We need the edge
  let newRequest: (Edge & { startNode: Node; endNode: Node }) | null = null;

  try {
    // Try doing the patch
    newRequest = await PrismaClient.edge.update({
      data: updateInput,
      where: {
        id: parseInt(req.params["id"]),
      },
      include: {
        startNode: true,
        endNode: true,
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
    console.error(`Unable to patch edge: ${error}`);

    res.sendStatus(400); // Send error

    return;
  }

  // Set the status to be OK, since if we got this far the Prisma worked
  res.status(200);

  // Send the request we got back
  res.send(newRequest);
});

export default router;
