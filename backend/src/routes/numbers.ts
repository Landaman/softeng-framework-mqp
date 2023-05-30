import express, {Router, Request, Response} from "express";
import isEven from "common/src/isEven.ts";

const router: Router = express.Router();

// Whenever a POST request is made, parse the number, and return whether it is even
router.post('/isEven', function(req: Request, res: Response): void {
  res.send({"even": isEven(parseInt(req.body.number))});
});

export default router;
