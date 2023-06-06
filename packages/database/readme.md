# Database

The database package is powered by Prisma—a next generation TypeScript
ORM package. Prisma's documentation is quite extensive, and can be found
at https://www.prisma.io/docs.

This document will attempt to explain the basics of Prisma,
and how to use it in this development environment.

## schema.prisma

Unlike other ORMs, Prisma does not define its schema in
annotated class files. Prisma's schema is defined in a file
(`prisma/schema.prisma`) that essentially follows a
language-agnostic `CREATE TABLE` pattern. This file
also defines the database URL, and some other configuration
items. It can refer to environment variables (in our case,
located both in `.env` and in `docker-compose....yaml`).

The `schema.prisma` file can be used in two ways:

1. You can design your schema in this file, and sync it with your database
2. You can design your database by other means, and then sync this file
   with it

The first option provides better version-control on your
database, especially when deploying to production, but both
work.

For either option, **you must first run `Start Dev`** to run
the development PostgreSQL server Docker container

### Prototyping with schema.prisma

Perform any edits desired to `schema.prisma`, and then run
`yarn run migrate:dev`. Behind the scenes, this runs `prisma migrate dev`,
which will then prompt you for a commit description.

Any issues encountered during `prisma migrate dev` can be resolved by running
`yarn run migrate:resolve` (which runs `prisma migrate resolve`).

A few other useful commands:

- `yarn run migrate:reset` (which runs `prisma migrate reset`) drops all development tables
  and re-creates the schema from scratch
- `yarn run db:push` (which runs `prisma db push`) syncs the database with
  the current state of your `schema.prisma` without creating a record of
  any changes. This is automatically run when `Start Dev` is run

### Prototyping in SQL

Create your schema in SQL, and then run `yarn run db:pull`, which internally
runs `prisma db pull`.

Then, run `yarn run migrate:dev` (which runs `prisma migrate dev`), which creates
a record to deploy to production with

### Deploying schema.prisma

The production Docker image will automatically run `prisma migrate deploy`,
which syncs all changes in a safe way, ensuring no data is deleted

## Prisma Client

Prisma client uses your finalized `schema.prisma` to generate static
TypeScript files that enable queries and type-safety.

To generate these types, run `prisma generate`. You should never
need to do this, as the boilerplate automatically does this whenever
it may be necessary.

These types can be imported from this package, under `Prisma`,
and the name of the table. This even works (on the level of types)
for the frontend. This can save significant development time. There is
an example of this in the frontend.

`PrismaClient` which can also be imported from this package, enables
you to make a database connection and perform queries using Prisma with
total type safety. See the Prisma docs for more information. You should
create only one `PrismaClient` object, and its lifecyle (as far as connect
/disconnect) is managed by Prisma for you
