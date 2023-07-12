import express, { Router, Request, Response } from "express";
import { Prisma } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

// Whenever a POST request is made, get the high score from it, and save that
router.post("/", async function (req: Request, res: Response) {
  const loginAttempt: Prisma.UserCreateInput = req.body;

  // Attempt to save the high score
  try {
    // Attempt to create in the database
    await PrismaClient.user.create({ data: loginAttempt });
    console.info("Successfully saved new user"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save new user ${loginAttempt}: ${error}`);
    res.sendStatus(400); // Send error
  }

  res.sendStatus(200); // Otherwise say it's fine
});

// Whenever a get request is made, return the user
router.get(`/:user`, async function (req: Request, res: Response) {
  const user = req.params[0];
  // Fetch the user from Prisma
  const login = await PrismaClient.user.findFirst({
    where: {
      username: user,
    },
  });

  // If the login doesn't exist
  if (login === null) {
    // Log that (it's a problem)
    console.error("No user found in database!");
    res.sendStatus(204); // and send 204, no data
  } else {
    // Otherwise, send the score
    res.send(login);
  }
});

export default router;
