import express, {Router, Request, Response} from "express";
import {EvenRequest, EvenResponse} from "common/src/numbers.ts";

const router: Router = express.Router();

// Whenever a POST request is made, parse the number, and return whether it is even
router.post('/isEven', function(req: Request, res: Response): void {
    // Create an even response, based on the parsed even request
    res.send(new EvenResponse((req.body as EvenRequest).number % 2 === 0));
});

export default router;
