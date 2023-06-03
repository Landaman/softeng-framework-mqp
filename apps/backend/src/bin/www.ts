import app from "../app.ts";
import http from "http";
import { AddressInfo } from "net";

// Get port from environment and store in Express
const port: string | undefined = process.env.PORT;

if (port === undefined) {
  console.error("Failed to start: Missing PORT environment variable");
  process.exit(1);
}

app.set("port", port);

// Create the server, enable the application
console.log("Starting server...");
const server: http.Server = http.createServer(app);

// Listen on the provided port, on all interfaces
server.listen(port);
server.on("error", onError); // Error handler
server.on("listening", onListening); // Notify that we started

/**
 * Event listener for HTTP server "error" event, to provide user friendly error output and then exit
 */
function onError(error: NodeJS.ErrnoException): void {
  // If we're doing something other than try to listen, we can't help
  if (error.syscall !== "listen") {
    throw error; // Re-throw
  }

  // Get the pipe/port we're listening on
  const bind: string =
    typeof port === "string" ? "Pipe " + port : "Port " + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    // Server can't get start permission
    case "EACCES":
      console.error(`Failed to start: ${bind} requires elevated permissions!`);
      process.exit(1);
      break;
    // Server can't get address
    case "EADDRINUSE":
      console.error(`Failed to start: ${bind} + ' is already in use`);
      process.exit(1); // Exit with failure
      break;
    default:
      // Print the default error otherwise, and exit
      console.error(`Failed to start: Unknown binding error:
    ${error}`);
      process.exit(1);
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  // Get the address we're listening on
  const addr: string | AddressInfo | null = server.address();

  // If it's a string, simply get it (its a pipe)
  const bind: string =
    typeof addr === "string" ? "pipe " + addr : "port " + addr?.port; // Otherwise get the port
  console.info("Server Listening on " + bind); // Debug output that we're listening
  console.log("Startup complete");
}
