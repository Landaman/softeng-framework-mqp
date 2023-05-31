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



# Base level installer for packages and files
FROM base AS installer
WORKDIR /$WORKDIR
COPY . /$WORKDIR

# This *shouldn't* actually do anything (hence frozen-stuff). If it does try to do something, there is a configuration
# error somewhere, so this will fail the build. If you're getting Yarn failures, STOP BREAKING THE YARN CONFIG.
RUN yarn install --immutable --immutable-cache



# Production basics (ports, env, etc)
FROM installer AS prod-installer
WORKDIR /$WORKDIR

# We need the production port
ARG PRODUCTION_PORT=80

# Set the environment variable port
ENV PORT=$PRODUCTION_PORT

# Set us to production environment
ENV NODE_ENV=production

# Expose the port
EXPOSE $PORT



# Production front builder. Creates a maximally trimmed out image
FROM prod-installer AS prod-frontend-builder
WORKDIR /$WORKDIR

# This creates a trimmed image that is frontend and its dependencies only
RUN yarn turbo prune --scope=frontend --docker


# Production front builder. Creates a maximally trimmed out image
FROM prod-installer AS prod-backend-builder
WORKDIR /$WORKDIR

# This creates a trimmed image that is frontend and its dependencies only
RUN yarn turbo prune --scope=backend --docker



# Stage to run production frontend
FROM base AS prod-frontend
WORKDIR /$WORKDIR

# Copy the out from production to our working directory
COPY --from=prod-frontend-builder /$WORKDIR/out .

# Perform the buildstep, this validates and builds
RUN yarn turbo lint build

# This trims out all non-production items
RUN yarn workspaces --all --production

# Use entrypoint (since this contianer should be run as-is)
# Simply serve the frontend single (so that everything goes to index.html) and the prod port
ENTRYPOINT yarn workspace frontend run deploy

# Healthceck to determine if we're actually still serving stuff, just attempt to get the URL
# If that fails, try exiting gracefully (SIGTERM), and if that fails force the container to die with SIGKILL.
# This will invoke the restart policy, allowing compose to automatically rebuild the container
HEALTHCHECK CMD wget --spider localhost:$PORT || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)'



# Stage to run prod backend
FROM prod-base AS prod-backend
WORKDIR /$WORKDIR

# PG User Info
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_DB=$POSTGRES_DB
ENV POSTGRES_CONTAINER=$POSTGRES_CONTAINER
ENV POSTGRES_PORT=$POSTGRES_PORT

# Copy the out from production to our working directory
COPY --from=prod-backend-builder /$WORKDIR/out .

# Perform the buildstep, this validates and builds
RUN yarn turbo lint build

# This trims out all non-production items
RUN yarn workspaces --all --production

# Use entrypoint (since this contianer should be run as-is)
# Simply serve the frontend single (so that everything goes to index.html) and the prod port
ENTRYPOINT yarn workspace backend run deploy

# Healthceck to determine if we're actually still serving stuff, just attempt to get the URL
# If that fails, try exiting gracefully (SIGTERM), and if that fails force the container to die with SIGKILL.
# This will invoke the restart policy, allowing compose to automatically rebuild the container
HEALTHCHECK CMD wget --spider localhost:$PORT || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)'



# Development of the backend portion
FROM installer as dev-backend
WORKDIR /$WORKDIR

# Delete everything having to do with the frontend
RUN rm -r frontend

ENV PORT=$BACKEND_PORT

# Expose the port
EXPOSE $PORT

# Expose the default DEBUGGER port
EXPOSE 9229

# PG User Info
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_DB=$POSTGRES_DB
ENV POSTGRES_CONTAINER=$POSTGRES_CONTAINER
ENV POSTGRES_PORT=$POSTGRES_PORT

# Run with CMD, since dev may want to use other commands
CMD ["yarn", "turbo", "run", "dev", "--filter=backend"]



# Development of the frontend portion
FROM installer as dev-frontend
WORKDIR /$WORKDIR

# Delete everything having to do with the backend. Rest should stay (as we need it)
RUN rm -r backend

ARG FRONTEND_PORT

# Port is frontend
ENV PORT=$FRONTEND_PORT

# Expose the port
EXPOSE $PORT

# backend information
ENV BACKEND_PORT=$BACKEND_PORT
ARG BACKEND_SOURCE
ENV BACKEND_SOURCE=$BACKEND_SOURCE

# Run with CMD, since dev may want to use other commands
CMD ["yarn", "turbo", "run", "dev", "--filter=frontend"]

# No need for a healthcheck (this is dev, so why bother)
