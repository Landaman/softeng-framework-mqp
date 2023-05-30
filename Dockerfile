# Stage to copy filesystem and install node packages
FROM node:16.20.0-alpine AS base
# Root folder that we will actually use
ENV WORKDIR=app
# Debug output
ENV DEBUG="backend:*"

# Default backend port (necessary for both frontend and backend)
ARG BACKEND_PORT

# DB information
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB
ARG POSTGRES_URL
ARG POSTGRES_PORT

# Setup basic node structure
WORKDIR /$WORKDIR
COPY . /$WORKDIR

# This *shouldn't* actually do anything (hence frozen-stuff)
RUN yarn install --immutable --immutable-cache



# Production basics
FROM base AS prod-base
WORKDIR /$WORKDIR

# We need the production port
ARG PRODUCTION_PORT=80

# Set the environment variable port
ENV PORT=$PRODUCTION_PORT

# Set us to production environment
ENV NODE_ENV=production

# Expose the port
EXPOSE $PORT

# Wipe out all non-production items from the main folder (note that tsconfig is required)
RUN rm /$WORKDIR/.eslintrc.cjs



# Stage to run production frontend
FROM prod-base AS prod-frontend
WORKDIR /$WORKDIR

# Build the frontend (we still need dev dependencies here)
RUN yarn workspace frontend run build

# Trim to frontend only (even though we don't actually need frontend, we need its build information)
RUN yarn workspaces focus frontend --production

# Use entrypoint (since this contianer should be run as-is)
# Simply serve the frontend single (so that everything goes to index.html) and the prod port
ENTRYPOINT yarn serve /$WORKDIR/frontend/build -s -p $PORT

# Healthceck to determine if we're actually still serving stuff, just attempt to get the URL
HEALTHCHECK CMD curl localhost:$PORT



# Stage to run prod backend
FROM prod-base AS prod-backend
WORKDIR /$WORKDIR

# Trim to backend only
RUN yarn workspaces focus backend --production

# PG User Info
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_DB=$POSTGRES_DB
ENV POSTGRES_URL=$POSTGRES_URL
ENV POSTGRES_PORT=$POSTGRES_PORT

# Use entrypoint (since this contanier should be run as-is)
# Simply have ts-node run the express start-point. Transpile-only (NO TYPE CHECKING) since prod SHOULDN'T need it
ENTRYPOINT ["yarn", "workspace", "backend", "ts-node", "--transpile-only", "./bin/www.ts"]

# Healthceck to determine if we're actually still serving stuff, just attempt to get the root. This will be 404,
# but that is OK
HEALTHCHECK CMD curl localhost:$PORT



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
ENV POSTGRES_URL=$POSTGRES_URL
ENV POSTGRES_PORT=$POSTGRES_PORT

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
