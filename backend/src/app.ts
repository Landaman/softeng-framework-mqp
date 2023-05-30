import createError, {HttpError} from "http-errors";
import express, {Express, NextFunction, Request, Response} from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import debug0 from "debug";
import usersRouter from "./routes/users.ts";
import numbersRouter from "./routes/numbers.ts";

const debug: debug0.Debugger = debug0("backend:app"); // Create a debug logger
const app: Express = express(); // Setup the backend

// Setup generic middlewear
app.use(logger('dev', {
  stream: {
    write: msg => debug(msg)
  }
})); // This records all HTTP requests
app.use(express.json()); // This processes requests as JSON
app.use(express.urlencoded({ extended: false })); // URL parser
app.use(cookieParser()); // Cookie parser

// Setup routers. ALL ROUTERS MUST use /api as a start point, or they
// won't be reached by the default proxy and prod setup
app.use('/api/users', usersRouter);

app.use("/api/numbers", numbersRouter);

/**
 * Catch all 404 errors, and forward them to the error handler
 */
app.use(function(req: Request, res: Response, next: NextFunction): void {
  // Have the next (generic error handler) process a 404 error
  next(createError(404));
});

/**
 * Generic error handler,
 */
app.use((err: HttpError, req: Request, res: Response): void => {
  res.statusMessage = err.message; // Provide the error message

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Reply with the error
  res.status(err.status || 500);
});

export default app; // Export the backend, so that www.ts can start it