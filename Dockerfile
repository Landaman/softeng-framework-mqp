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

# Copy the basic stuff everything should have
COPY [".pnp.cjs", ".pnp.loader.mjs", ".yarnrc.yml", "./"]
COPY .yarn .yarn


# Base level installer for packages and files
FROM base AS installer
WORKDIR /$WORKDIR
COPY . /$WORKDIR


# Production basics (ports, env, etc)
FROM base AS prod-base
WORKDIR /$WORKDIR

# We need the production port
ARG PRODUCTION_PORT

# Set the environment variable port
ENV PORT=$PRODUCTION_PORT

# Set us to production environment
ENV NODE_ENV=production

# Expose the port
EXPOSE $PORT



# Production front builder. Creates a maximally trimmed out image
FROM installer AS prod-frontend-builder
WORKDIR /$WORKDIR

# Build the unplugged files and cache stuff for this specific OS
RUN yarn install --immutable --immutable-cache

# Lint everything here, before we prune stuff out
RUN yarn turbo run lint --filter=backend,common,database,eslint-config-custom,frontend,prettier-config-custom,tsconfig-custom

# This creates a trimmed image that is frontend and its dependencies only
RUN yarn turbo prune --scope=frontend --docker


# Production front builder. Creates a maximally trimmed out image
FROM installer AS prod-backend-builder
WORKDIR /$WORKDIR

# Build the unplugged files and cache stuff for this specific OS
RUN yarn install --immutable --immutable-cache

# Lint everything here, before we prune stuff out
RUN yarn turbo run lint --filter=backend,common,database,eslint-config-custom,frontend,prettier-config-custom,tsconfig-custom

# This creates a trimmed image that is frontend and its dependencies only
RUN yarn turbo prune --scope=backend --docker



# Stage to run production frontend
FROM prod-base AS prod-frontend
WORKDIR /$WORKDIR

# Copy the packages from production to our working directory
COPY --from=prod-frontend-builder ["/$WORKDIR/out/json", "/$WORKDIR/out/yarn.lock", "/$WORKDIR/out/full", "./"]

# Validate the install
RUN yarn install --immutable

# Perform any building necessary
RUN yarn turbo run build --filter=backend,common,database,eslint-config-custom,frontend,prettier-config-custom,tsconfig-custom

# This trims out all non-production items
RUN yarn workspaces focus --all --production

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
ENV POSTGRES_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_CONTAINER}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# Copy the packages from production to our working directory
COPY --from=prod-backend-builder ["/$WORKDIR/out/json", "/$WORKDIR/out/yarn.lock", "/$WORKDIR/out/full", "./"]

# Validate the install
RUN yarn install --immutable

# Run the build task
RUN yarn turbo run build --filter=backend,common,database,eslint-config-custom,frontend,prettier-config-custom,tsconfig-custom

# This trims out all non-production items
RUN yarn workspaces focus --all --production

# Use entrypoint (since this contianer should be run as-is)
# Simply run the migrate:deploy and then deploy
# Migrate MUST BE DONE AS PART OF THE ENTRYPOINT so that the database is running
ENTRYPOINT yarn workspace database run migrate:deploy && yarn workspace backend run deploy

# Healthceck to determine if we're actually still serving stuff, just attempt to get the URL
# If that fails, try exiting gracefully (SIGTERM), and if that fails force the container to die with SIGKILL.
# This will invoke the restart policy, allowing compose to automatically rebuild the container
HEALTHCHECK CMD wget --spider localhost:$PORT/healthcheck || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)'



# Development of the backend portion
FROM installer as dev-backend
WORKDIR /$WORKDIR

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
ENV POSTGRES_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_CONTAINER}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# Run with CMD, since dev may want to use other commands
CMD ["yarn", "turbo", "run", "dev", "--filter=backend"]



# Development of the frontend portion
FROM installer as dev-frontend
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

# Run with CMD, since dev may want to use other commands
CMD ["yarn", "turbo", "run", "dev", "--filter=frontend"]

# No need for a healthcheck (this is dev, so why bother)
