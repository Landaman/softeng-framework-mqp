import express, { Router, Request, Response } from "express";
import { Prisma } from "database";
import PrismaClient from "../bin/databaseConnection.ts";

const router: Router = express.Router();

router.get(`/locationName`, async function (req: Request, res: Response) {
  const locations = await PrismaClient.locationName.findMany();
  res.send(locations);
});

router.post("/locationName", async function (req: Request, res: Response) {
  const edgeAttempt: Prisma.locationNameCreateInput = req.body;

  // Attempt to save the high score
  try {
    // Attempt to create in the database
    await PrismaClient.locationName.create({ data: edgeAttempt });
    console.info("Successfully saved new location"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save new location ${edgeAttempt}: ${error}`);
    res.sendStatus(400); // Send error
  }

  res.sendStatus(200); // Otherwise say it's fine
});

router.put(
  "/locationName:longName",
  async function (req: Request, res: Response) {
    const id = req.params[0];

    try {
      await PrismaClient.locationName.update({
        where: { longName: id },
        data: {
          longName: req.params[1],
          shortName: req.params[2],
          locationType: req.params[3],
        },
      });
      console.info("Successfully updated edge"); // Log that it was successful
    } catch (error) {
      console.error(`Unable to update edge ${req.body}: ${error}`);
      res.sendStatus(400); // Send error
    }

    res.sendStatus(200); // Otherwise say it's fine
  }
);

router.delete("/locationName", async function (req: Request, res: Response) {
  try {
    await PrismaClient.locationName.delete({
      where: { longName: req.params[0] },
    });
    console.info("Successfully saved new location"); // Log that it was successful
  } catch (error) {
    console.error(`Unable to delete location ${req.params[0]}: ${error}`);
    res.sendStatus(400); // Send error
  }

  res.sendStatus(200); // Otherwise say it's fine
});
