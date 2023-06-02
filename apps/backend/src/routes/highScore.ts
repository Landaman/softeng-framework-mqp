import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

// Whenever a POST request is made, get the high score from it, and save that
router.post("/", async function (req: Request, res: Response) {
  // Respond that everything went OK
  // TODO: Implement this
  res.sendStatus(200); // Otherwise say it's fine
});

// Whenever a get request is made, return the high score
router.get("/", async function (req: Request, res: Response) {
  res.sendStatus(404); // TODO: Implement this
});

export default router;
