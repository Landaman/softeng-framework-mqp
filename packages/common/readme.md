# Common

This package defines common elements, shared between the front and back end.
By default, the frontend and backend import this package.

The best use for this package is to store interfaces/common datatypes.
Note that Prisma generates types that are perfectly usable by the frontend in many cases,
so in many cases you don't need to explicitly define them here (see `database` readme for more information)

Transferring data is not possible via the common package. Transferring
data must happen via the standard Express routing described in the backend.

A word of caution on imports - since this is dependent on the frontend,
and not all packages can be imported to this package. See
the `frontend` readme for details.
