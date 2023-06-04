# Common

This package defines common elements, shared between the front and back end.
By default, the frontend and backend import this package.

The best use for this package is to store interfaces/common datatypes.

Transferring data is not possible via the common package. Transferring
data must happen via the standard Express routing described in the backend.

A word of caution on imports - since this is dependent on the frontend,
and not all packages can be imported to this package. See
the `frontend` readme for details.
