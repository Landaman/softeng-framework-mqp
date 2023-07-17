import express, { Router, Request, Response } from "express";
import { Prisma } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  const nodeAttempt: Prisma.NodeCreateInput = req.body;

  // Attempt to save the high score
  try {
    // Attempt to create in the database
    await PrismaClient.node.create({ data: nodeAttempt });
    console.info("Successfully saved new node"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save new node ${nodeAttempt}: ${error}`);
    res.sendStatus(400); // Send error
  }

  res.sendStatus(200); // Otherwise say it's fine
});

router.get(`/`, async function (req: Request, res: Response) {
  const nodes = await PrismaClient.node.findMany();
  res.send(nodes);
});

router.put("/", async function (req: Request, res: Response) {
  const id = req.params[0];
  const location = await PrismaClient.locationName.findUnique({
    where: {
      longName: req.params[5],
    },
  });

  try {
    if (location != null) {
      await PrismaClient.node.update({
        where: { nodeID: id },
        data: {
          nodeID: req.params[1],
          xCoord: Number(req.params[2]),
          yCoord: Number(req.params[3]),
          building: req.params[4],
          locationName: {
            connect: { longName: req.params[6] },
          },
          floor: req.params[5],
        },
      });
      console.info("Successfully updated node"); // Log that it was successful
    } else {
      console.error("Unable to find associated location");
      res.sendStatus(400); // Send error
    }
  } catch (error) {
    console.error(`Unable to update node ${req.body}: ${error}`);
    res.sendStatus(400); // Send error
  }

  res.sendStatus(200); // Otherwise say it's fine
});

router.delete("/", async function (req: Request, res: Response) {
  try {
    await PrismaClient.node.delete({
      where: { nodeID: req.params[0] },
    });
    console.info("Successfully saved new node"); // Log that it was successful
  } catch (error) {
    console.error(`Unable to delete node ${req.params[0]}: ${error}`);
    res.sendStatus(400); // Send error
  }

  res.sendStatus(200); // Otherwise say it's fine
});

export default router;
