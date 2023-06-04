# Frontend
This package defines the backend server, and the RESTful API it
represents. It also includes the packages used.

This package should be run from the root, see the root readme.md for details.

As discussed in the top-level repo, this project runs completely independently
(in fact, on a different Docker container) of the backend package. **This application
contains NO API components**.

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


### App.css
This is the CSS file for your entire application. Note that it is generally
best practice to put everything in one CSS file, as this improves loadtime.

In web apps, CSS defines both style and position of items.

See the following resources for CSS help:
- https://www.w3schools.com/css/
- https://flexboxfroggy.com
- https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps


### App.tsx
App.tsx is the main page of the starter code application, and the page that is
actually rendered. This contains the Axios examples

### main.tsx
This is the entrypoint for the React-app. This calls the basic method
that React uses to render your app. You probably won't need to change this file