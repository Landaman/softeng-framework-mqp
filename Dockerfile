# Stage to copy filesystem and install node packages
FROM node:16.20.0-alpine AS base
# Root folder that we will actually use
ENV WORKDIR=app

# Default backend port (necessary for both frontend and backend)
ARG BACKEND_PORT

# DB information
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB
ARG POSTGRES_CONTAINER
ARG POSTGRES_PORT

# Setup basic node structure
WORKDIR /$WORKDIR
COPY . /$WORKDIR

# This *shouldn't* actually do anything (hence frozen-stuff). If it does try to do something, there is a configuration
# error somewhere, so this will fail the build. If you're getting Yarn failures, STOP BREAKING THE YARN CONFIG.
RUN yarn install --immutable --immutable-cache



# Production basics
FROM base AS prod-base
WORKDIR /$WORKDIR

# Run the Yarn linter (prod code should pass this without issue)
RUN ["yarn", "run", "lint"]

# Now build
RUN ["yarn", "run", "build"]

# We need the production port
ARG PRODUCTION_PORT=80

# Set the environment variable port
ENV PORT=$PRODUCTION_PORT

# Set us to production environment
ENV NODE_ENV=production

# Expose the port
EXPOSE $PORT



# Stage to run production frontend
FROM prod-base AS prod-frontend
WORKDIR /$WORKDIR

# Trim to frontend only (even though we don't actually need frontend, we need its build information)
RUN yarn workspaces focus frontend --production

# Use entrypoint (since this contianer should be run as-is)
# Simply serve the frontend single (so that everything goes to index.html) and the prod port
ENTRYPOINT yarn workspace frontend serve /$WORKDIR/frontend/build -s -p $PORT

# Healthceck to determine if we're actually still serving stuff, just attempt to get the URL
# If that fails, try exiting gracefully (SIGTERM), and if that fails force the container to die with SIGKILL.
# This will invoke the restart policy, allowing compose to automatically rebuild the container
HEALTHCHECK CMD wget --spider localhost:$PORT || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)'



# Stage to run prod backend
FROM prod-base AS prod-backend
WORKDIR /$WORKDIR

# Trim to backend only
RUN yarn workspaces focus backend --production

# PG User Info
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_DB=$POSTGRES_DB
ENV POSTGRES_CONTAINER=$POSTGRES_CONTAINER
ENV POSTGRES_PORT=$POSTGRES_PORT

# Use entrypoint (since this contanier should be run as-is)
# Simply have ts-node run the express start-point. Transpile-only (NO TYPE CHECKING) since prod SHOULDN'T need it
ENTRYPOINT ["yarn", "workspace", "backend", "ts-node", "--transpile-only", "./src/bin/www.ts"]

# Healthceck to determine if we're actually still serving stuff, just attempt to get the healthcheck.
# If that fails, try exiting gracefully (SIGTERM), and if that fails force the container to die with SIGKILL.
# This will invoke the restart policy, allowing compose to automatically rebuild the container
HEALTHCHECK CMD wget --spider localhost:$PORT/healthcheck || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)'



# Development of the backend portion
FROM base as dev-backend
WORKDIR /$WORKDIR

ENV PORT=$BACKEND_PORT

# Expose the port
EXPOSE $PORT

# Expose the default backend port
EXPOSE 9229

# PG User Info
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_DB=$POSTGRES_DB
ENV POSTGRES_CONTAINER=$POSTGRES_CONTAINER
ENV POSTGRES_PORT=$POSTGRES_PORT

ENV DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_CONTAINER:$POSTGRES_PORT/$POSTGRES_DB

# Run with CMD, since dev may want to use other commands
CMD ["yarn", "workspace", "backend", "run", "start"]



# Development of the frontend portion
FROM base as dev-frontend
WORKDIR /$WORKDIR

ARG FRONTEND_PORT

# Port is frontend
ENV PORT=$FRONTEND_PORT

# Expose the port
EXPOSE $PORT

# backend information
ENV BACKEND_PORT=$BACKEND_PORT
ARG BACKEND_SOURCE
ENV BACKEND_SOURCE=$BACKEND_SOURCE

# No need to actually trim stuff out, due to this being a dev build and the fact that we mount everything

# Run with CMD, since dev may want to use other commands
CMD ["yarn", "workspace", "frontend", "run", "start"]

# No need for a healthcheck (this is dev, so why bother)
