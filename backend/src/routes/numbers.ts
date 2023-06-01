import express, { Router, Request, Response } from "express";
import { IEvenRequest, IEvenResponse } from "common/src/INumbers.ts";

const router: Router = express.Router();

// Whenever a POST request is made, parse the number, and return whether it is even
router.post("/isEven", function (req: Request, res: Response): void {
  // Create an even response, based on the parsed even request
  res.send({
    isEven: (req.body as IEvenRequest).number % 2 === 0,
  } as IEvenResponse);
});

export default router;
