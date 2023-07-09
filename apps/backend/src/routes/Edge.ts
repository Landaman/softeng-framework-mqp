import express, { Router, Request, Response } from "express";
import { Prisma } from "database";
import PrismaClient from "../bin/databaseConnection.ts";

const router: Router = express.Router();

router.get(`/edge`, async function (req: Request, res: Response) {
  const edges = await PrismaClient.edge.findMany();
  res.send(edges);
});

router.post("/edge", async function (req: Request, res: Response) {
  const edgeAttempt: Prisma.EdgeCreateInput = req.body;

  // Attempt to save the high score
  try {
    // Attempt to create in the database
    await PrismaClient.edge.create({ data: edgeAttempt });
    console.info("Successfully saved new edge"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save new edge ${edgeAttempt}: ${error}`);
    res.sendStatus(400); // Send error
  }

  res.sendStatus(200); // Otherwise say it's fine
});

router.put("/edge:edgeID", async function (req: Request, res: Response) {
  const id = req.params[0];
  const node1 = await PrismaClient.node.findUnique({
    where: {
      nodeID: req.params[2],
    },
  });
  const node2 = await PrismaClient.node.findUnique({
    where: {
      nodeID: req.params[3],
    },
  });

  try {
    if (node1 != null && node2 != null) {
      await PrismaClient.edge.update({
        where: { edgeID: id },
        data: {
          edgeID: req.params[1],
          startNode: {
            connect: { nodeID: req.params[2] },
          },
          endNode: {
            connect: { nodeID: req.params[3] },
          },
        },
      });
      console.info("Successfully updated edge"); // Log that it was successful
    } else {
      console.error(
        "Unable to find associated node" +
          (node1 === null ? req.params[0] : req.params[1]) +
          " " +
          (node2 === null ? req.params[1] : " ")
      );

      res.sendStatus(400); // Send error
    }
  } catch (error) {
    console.error(`Unable to update edge ${req.body}: ${error}`);
    res.sendStatus(400); // Send error
  }

  res.sendStatus(200); // Otherwise say it's fine
});

router.delete("/edge", async function (req: Request, res: Response) {
  try {
    await PrismaClient.edge.delete({
      where: { edgeID: req.params[0] },
    });
    console.info("Successfully saved new edge"); // Log that it was successful
  } catch (error) {
    console.error(`Unable to delete edge ${req.params[0]}: ${error}`);
    res.sendStatus(400); // Send error
  }

  res.sendStatus(200); // Otherwise say it's fine
});
