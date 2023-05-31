import app from "../app.ts";
import debug0 from "debug";
import http from "http";
import {AddressInfo} from "net";

// Create the actual debugger
const debug: debug0.Debugger = debug0('backend:bin');

// Get port from environment and store in Express
const port: string | undefined = process.env.PORT;
app.set('port', port);

// Signals we want to handle for shutdown. We can't handle SIGKILL (this cannot be intercepted)
const signals: string[] = [
    'SIGHUP',
    'SIGINT',
    'SIGTERM'
];

// Create the database connection
debug("Opening database connection...");
try {
    require("../database/connection.ts"); // This implicitly causes the connection to open
    debug("Database connection opened successfully");
} catch (error) {
    // Print any errors
    debug(`Failed to open database connection:
  ${error}`);
    process.exit(1); // Exit with failure
}

// Create the server, enable the application
debug("Starting server...");
const server: http.Server = http.createServer(app);

// Listen on the provided port, on all interfaces
server.listen(port);
server.on('error', onError); // Error handler
server.on('listening', onListening); // Notify that we started

// Create a listener for each of the signals that we want to handle
Object.keys(signals).forEach((signal: string): void => {
    // On each one, call the shutdown handler
    process.on(signal, (): void => {
        onShutdown(signal);
    });
});

/**
 * Event listener for HTTP server "error" event, to provide user friendly error output and then exit
 */
function onError(error: NodeJS.ErrnoException): void {
    // If we're doing something other than try to listen, we can't help
    if (error.syscall !== 'listen') {
        throw error; // Re-throw
    }

    // Get the pipe/port we're listening on
    const bind: string = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // Handle specific listen errors with friendly messages
    switch (error.code) {
    // Server can't get start permission
    case 'EACCES':
        debug(`Error: ${bind} requires elevated permissions!`);
        process.exit(1);
        break;
    // Server can't get address
    case 'EADDRINUSE':
        debug(`Error: ${bind} + ' is already in use`);
        process.exit(1); // Exit with failure
        break;
    default:
    // Print the default error otherwise, and exit
        debug(`Unknown binding error:
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
    const bind: string = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr?.port; // Otherwise get the port
    debug('Listening on ' + bind); // Debug output that we're listening
}

/**
 * Method to handle shutdown signals. Prints that termination has started and then gracefully exits
 * @param signal the captured signal in string form
 */
function onShutdown(signal: string): void {
    debug(`Server received signal ${signal}`);
    debug("Beginning shutdown. Waiting for any pending requests to complete...");

    // Wait for any pending requests to resolve
    server.close(() => {
        debug(`Pending requests resolved. Shutting down...`);
        process.exit(0);
    });
}
