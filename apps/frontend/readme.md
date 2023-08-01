# Frontend

<!-- TOC -->

- [Frontend](#frontend)
  - [Imports](#imports)
  - [Package Overview](#package-overview)
    - [Vite](#vite)
    - [React](#react)
    - [React-Router](#react-router)
    - [Serve](#serve)
    - [Axios](#axios)
    - [Bootstrap](#bootstrap)
    - [React-Bootstrap](#react-bootstrap)
    - [Miscellaneous](#miscellaneous)
  - [Code Structure](#code-structure)
  _ [Public and Assets Folders](#public-and-assets-folders)
  _ [scss/custom.scss](#scsscustomscss)
  _ [routes](#routes)
  _ [root.tsx](#roottsx) \* [main.tsx](#maintsx)
  <!-- TOC -->

This package defines the backend server, and the RESTful API it
represents. It also includes the packages used.

This package should be run from the root, see the root readme.md for details.

As discussed in the top-level repo, this project runs completely independently
(in fact, on a different Docker container) of the backend package. **This application
contains NO API components**.

## Imports

Note that Vite cannot successfully package all imports. If you are considering
adding something to the frontend, make sure that it explicitly states
it works in the browser; otherwise it likely will not. If you are
to add a dependency, simply add it with the standard `yarn add...` and Vite will
take care of the rest!

## Package Overview

The following section describes the structure of the frontend, including the packages
and what files they depend on

### Vite

Vite is a bundler and build tools for frontend development. It is a more modern
alternative to create-react-app that provides superior configurability
and performance.

It does two things:

1. Creates a development server for the frontend that automatically preforms
   HMR (hot-module replacement) when changes are detected. HMR essentially replaces
   only what is required for the development server to match your code. This means your browser
   will automatically refresh and show only the necessary changes whenever your code is updated.
2. It bundles the frontend code and dependencies into a bundle that can be statically served

Vite can be configured in `vite.config.ts`. Vite also requires `index.html`, where you can set
the name of your page. You probably won't need to change your Vite config.

Vite also uses the file `/src/vite-env.d.ts` to help your IDE provide type-hinting.

Any warnings WebStorm gives about Vite not being installed are safe to ignore.

Details on Vite can be found at https://vitejs.dev

### React

React is a library that allows frontend development to be done in JavaScript exclusively—essentially,
bringing HTML into JavaScript and providing an extremely easy-to-use way of binding
data to the UI. In this repo, all UI code is done in React.

See https://react.dev/learn for details on React

### React-Router

React-Router is a library that lets you do navigation in React. It allows you to
alias different URLs to different React components/pages. This also allows the standard
browser forward/back buttons to work with the navigation.

See https://reactrouter.com/en/main for details

### Serve

Serve is a simple JavaScript server package that allows you to statically serve assets from a folder, using
a command-line tool.

Combined with the `vite` build tool, this is how the frontend is deployed.

See https://www.npmjs.com/package/serve for details on Serve.

### Axios

Axios is a package that facilitates HTTP requests. This is the package that allows
the frontend to communicate with the backend. Axios enables an Async/Await or Promise style
of performing requests, easy error trapping, and easy ways to set various HTTP headers
(think authentication).

Examples of how to use Axios are present in the starter-code.

See https://axios-http.com/docs/intro for details

### Bootstrap

Bootstrap is a package that contains various prebuilt utilities for
frontend development.
It includes various prebuilt components, and utilities to help with alignment.
Bootstrap contains a default color scheme that can be changed via
SASS (a variation on CSS that compiles to CSS)

See https://getbootstrap.com/docs/5.3/getting-started/introduction/ for details on Bootstrap.

### React-Bootstrap

React-bootstrap is a utility package that provides React components,
to simplify using Bootstrap components.
It directly relies on Bootstrap's styling
and overrides.

See https://react-bootstrap.netlify.app for details

### auth0-react

Auth0-React is a library built by Auth0 to facilitate using the Auth0 OIDC provider.
It provides easy ways
to fetch account details, and easy ways to authenticate https://github.com/auth0/auth0-react/

### Miscellaneous

All other files are the same as their counterparts in the root. See
the root readme.md for details

## Code Structure

The frontend package is primarily based in the `src` folder. This documents the role
of each file in the starter code, and the `public` folders role

### Public and Assets Folders

The public folder is where static assets (such as fonts and images) that are
never changing, need not be referenced in code, or need a static URL
should be stored.

Note that putting these types of files in `/src/assets` is also generally acceptable.

See https://vitejs.dev/guide/assets.html#the-public-directory for details.

### scss/custom.scss

This is the CSS file for your entire application. Note that it is generally
best practice to put everything in one CSS file, as this improves loadtime.

In web apps, CSS defines both style and position of items.

This application uses Bootstrap to improve development speed. This file allows you to override
default bootstrap elements

See the following resources for CSS/Bootstrap help:

- https://www.w3schools.com/css/
- https://flexboxfroggy.com
- https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps
- https://getbootstrap.com/docs/5.3/getting-started/introduction/
- https://react-bootstrap.netlify.app

### routes

Routes is the folder where the individual pages that get rendered
are stored, as a part of react-router's navigation setup.

The root (defined by App.tsx) is simply the navbar and navigation to
other pages, stored in Routes.

### root.tsx

This is the "root" that contains the menubar and the root of the
proper page

### main.tsx

This is the entrypoint for the React-app.
This calls the basic method
that React uses to render your app.
It also includes the router setup for page navigation
