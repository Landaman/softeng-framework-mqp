# Backend

<!-- TOC -->

- [Backend](#backend)
  - [RESTful API Basics](#restful-api-basics)
  - [Package Overview](#package-overview)
    - [Express.js](#expressjs)
    - [ts-node](#ts-node)
    - [Nodemon](#nodemon)
    - [Miscellaneous](#miscellaneous)
  - [Code Structure](#code-structure)
  <!-- TOC -->

This package defines the backend server, and the RESTful API it
represents. It also includes the packages used.

This package should be run from the root, see the root readme.md for details.

As discussed in the top-level repo, this project runs completely independently
(in fact, on a different Docker container) of the frontend package.
**This application contains **NO UI components\*\*.

## RESTful API Basics

RESTful APIs are based on the `HTTP` specification, and are
meant to allow for `CRUD` (Create, Read, Update, Delete) operations
on resources. See the top-level `readme.md` for details on how this
works.

An API such as this one is meant to insulate the frontend from your database.
As such, your API endpoints need not directly line-up with the database;
however, they should be generally close.

Keep in mind that RESTful APIs are stateless—they do not remember
any details of the client that connects to them. They simply perform the
operation and return.

See the following resources for details on how to design the REST API:

- https://wiki.onap.org/display/DW/RESTful+API+Design+Specification
- https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/
- https://www.w3.org/2001/sw/wiki/REST
- https://restful-api-design.readthedocs.io/en/latest/resources.html
- https://www.tutorialspoint.com/restful/restful_resources.htm
- https://cloud.google.com/apis/design/resources
- https://learning.oreilly.com/library/view/rest-api-design/9781449317904/
- https://learning.oreilly.com/library/view/hands-on-restful-api/9781788992664/

## Package Overview

The following section describes the structure of the backend, including the packages
and what files they depend on

### Express.js

Express is a library for creating web applications, specifically,
the backend API component of web applications.

Express is what we used to create the REST API above the HTTP layer.

Express works on the principle of defining a route, and defining what the application
should do when a given operation is requested on that route.

Express has a few dependencies:

- `cookie-parser` which lets Express parse web-cookies
- `morgan` which helps with request/response logging
- various typing libraries

For details on how to use Express, see https://expressjs.com/en/4x/api.html

### ts-node

Ts-node is a transpiler for TypeScript, which transpiles TypeScript into
JavaScript in memory. It uses SWC, and consequently is very fast.

This has two benefits of simply using `tsc`:

1. It can be done in memory, so there are no extraneous files that are
   generated
2. It is significantly faster

The ts-node config is primarily found in `tsconfig.json`. It is not recommended
to alter this configuration.

See https://typestrong.org/ts-node/ for details on ts-node

### Nodemon

Nodemon is a package that scans the filesystem for changes
and automatically kills and then restarts a given program when one is
detected.

This has the benefit of allowing you to change your program, and se
the results in real-time, without having to manually restart. It depends
on ts-node to actually run the TypeScript, but it instructs ts-node
to start/stop.

The default run configuration first runs `build:dev`, then runs the program,
and while the program is running, runs `lint:fix` to automatically find/fix
code quality issues.

Nodemon config can be found at `nodemon.json`. Modifying this configuration
is not recommended.

See https://www.npmjs.com/package/nodemon for details on Nodemon

### express-oauth2-jwt-bearer

This is a library built by Auth0 that provides bearer token authentication
using an Open-ID Connect (OIDC) provider (such as Auth0). It facilitates
a quick setup and excellent security. See https://github.com/auth0/express-oauth2-bearer for more information

### Supertest

Supertest is a Node library to aid in writing unit and integration
tests built around RESTful APIs (such as the one integrated here).
See https://www.npmjs.com/package/supertest for details on how to use this package

### Miscellaneous

All other files are the same as their counterparts in the root. See
the root readme.md for details

## Code Structure

The code for the Backend package can be found in the src folder. This
documents the recommended structure for using this.

- bin/www.ts is the entrypoint for the program. It creates an HTTP
  server on the correct port, provides clean output if that fails, and provides
  last-ditch exception handling and startup output. You probably don't need
  to edit this.
- app.ts is the Express.js entrypoint. It defines the Express routers
  (see Express docs for info), logging, and basic error trapping.
  routes/\* define the routers Express uses. This is where the bulk
  of processing is done
- bin/database-connection.ts provides a database connection the rest of the
  database package can use. When this is required by www.ts, it automatically starts
  the database. It also automatically disconnects WHENEVER the client exits
