import express, {Router, Request, Response} from "express";

const router: Router = express.Router();

// Whenever a GET request is made to users, reply with "I am a resource, and I do things"
router.get('/', function(req: Request, res: Response): void {
    res.send('I am a resource, and I do things');
});

export default router;
