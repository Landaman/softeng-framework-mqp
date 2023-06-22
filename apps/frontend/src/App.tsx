import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Homepage from "./routes/Homepage.tsx";
import ServiceRequest from "./routes/ServiceRequest.tsx";
import Login from "./routes/Login.tsx";
import TestPage from "./routes/highScore.tsx";
import NavBar from "./NavBar.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "",
          element: <Homepage />,
        },
        {
          path: "ServiceRequest",
          element: <ServiceRequest />,
        },
        {
          path: "Login",
          element: <Login />,
        },
        {
          path: "HighScore",
          element: <TestPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;

  function Root() {
    return (
      <Auth0Provider
        useRefreshTokens
        cacheLocation="localstorage"
        domain="dev-k32g5z85431gyr5t.us.auth0.com"
        clientId="sM7TWX1h54iTfv4vMI8AkiEBoqmIZtzE"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "/api",
        }}
      >
        <div className={"main"}>
          <NavBar />
          <Outlet />
        </div>
      </Auth0Provider>
    );
  }
}

export default App;
