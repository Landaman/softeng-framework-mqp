import createError, { HttpError } from "http-errors";
import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import numbersRouter from "./routes/numbers.ts";
import highScoreRouter from "./routes/high-score.ts";
import computerServiceRouter from "./routes/computer-requests.ts";
import sanitationServiceRouter from "./routes/sanitation-requests.ts";
import nodeRouter from "./routes/node.ts";
import edgeRouter from "./routes/edge.ts";
import { auth } from "express-oauth2-jwt-bearer";

const app: Express = express(); // Setup the backend

// Setup generic middlewear
app.use(
  logger("dev", {
    stream: {
      // This is a "hack" that gets the output to appear in the remote debugger :)
      write: (msg) => console.info(msg),
    },
  })
); // This records all HTTP requests
app.use(express.json()); // This processes requests as JSON
app.use(express.urlencoded({ extended: false })); // URL parser
app.use(cookieParser()); // Cookie parser

// This is a generic path for the healthcheck. This is not publicly available anywhere
// (e.g., Docker and the dev proxy DO NOT expose this). It exists exclusively so that can check the server
// is alive/responsive. If this returns anything other than 200, Docker will automatically kill your backend
// (under the assumption that something has gone horribly wrong). This must come before the authentication endpoint
app.use("/healthcheck", function (req: Request, res: Response): void {
  res.sendStatus(200);
});

// JWT checker to ensure that routes are authorized
// Enforce on all endpoints
app.use(
  auth({
    audience: "/api",
    issuerBaseURL: "https://dev-k32g5z85431gyr5t.us.auth0.com/",
    tokenSigningAlg: "RS256",
  })
);

// Setup routers. ALL ROUTERS MUST use /api as a start point, or they
// won't be reached by the default proxy and prod setup
app.use("/api/numbers", numbersRouter);

app.use("/api/high-score", highScoreRouter);

app.use("/api/computer-requests", computerServiceRouter);

app.use("/api/sanitation-requests", sanitationServiceRouter);

app.use("/api/nodes", nodeRouter);

app.use("/api/edges", edgeRouter);
/**
 * Catch all 404 errors, and forward them to the error handler
 */
app.use(function (req: Request, res: Response, next: NextFunction): void {
  // Have the next (generic error handler) process a 404 error
  next(createError(404));
});

/**
 * Generic error handler
 */
app.use((err: HttpError, req: Request, res: Response): void => {
  res.statusMessage = err.message; // Provide the error message

  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Reply with the error
  res.status(err.status || 500);
});

export default app; // Export the backend, so that www.ts can start it
