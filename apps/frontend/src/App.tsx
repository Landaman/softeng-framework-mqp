import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router-dom";
import Homepage from "./routes/Homepage.tsx";
import {
  ComputerService,
  SanitationService,
} from "./routes/ServiceRequest.tsx";
import ComputerRequestTable from "./routes/ComputerRequestTable.tsx";
import edgeTable from "./routes/edge-table.tsx";
import nodeTable from "./routes/node-table.tsx";
import TestPage from "./routes/HighScore.tsx";
import NavBar from "./NavBar.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import ErrorPage from "./routes/ErrorPage.tsx";
import Pathfinding from "./routes/Pathfinding.tsx";
import MapEditor from "./routes/MapEditor.tsx";
import { AuthenticationGuard } from "./AuthenticationGuard.tsx";
import SanitationRequestTable from "./routes/SanitationRequestTable.tsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      element: <Root />,
      children: [
        {
          errorElement: <ErrorPage />,
          children: [
            {
              path: "",
              element: <Homepage />,
            },
            {
              path: "service-requests",
              children: [
                {
                  path: "computer",
                  children: [
                    {
                      path: "create",
                      element: (
                        <AuthenticationGuard component={ComputerService} />
                      ),
                    },
                    {
                      path: "view",
                      element: (
                        <AuthenticationGuard component={ComputerRequestTable} />
                      ),
                    },
                    {
                      path: "",
                      element: <ErrorPage />,
                    },
                  ],
                },
                {
                  path: "sanitation",
                  children: [
                    {
                      path: "create",
                      element: (
                        <AuthenticationGuard component={SanitationService} />
                      ),
                    },
                    {
                      path: "view",
                      element: (
                        <AuthenticationGuard
                          component={SanitationRequestTable}
                        />
                      ),
                    },
                    {
                      path: "",
                      element: <ErrorPage />,
                    },
                  ],
                },
                {
                  path: "",
                  element: <ErrorPage />,
                },
              ],
            },
            {
              path: "high-score",
              element: <AuthenticationGuard component={TestPage} />,
            },
            {
              path: "pathfinding",
              element: <AuthenticationGuard component={Pathfinding} />,
            },
            {
              path: "edgeTable",
              element: <AuthenticationGuard component={edgeTable} />,
            },
            {
              path: "nodeTable",
              element: <AuthenticationGuard component={nodeTable} />,
            },
            {
              path: "MapEditor",
              element: <AuthenticationGuard component={MapEditor} />,
            },
            {
              path: "*",
              element: <ErrorPage />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
  function Root() {
    const navigate = useNavigate();

    return (
      <Auth0Provider
        useRefreshTokens
        cacheLocation="localstorage"
        domain="dev-k32g5z85431gyr5t.us.auth0.com"
        clientId="sM7TWX1h54iTfv4vMI8AkiEBoqmIZtzE"
        onRedirectCallback={(appState) => {
          navigate(appState?.returnTo || window.location.pathname);
        }}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "/api",
          scope: "openid profile email offline_access",
        }}
      >
        <div className="w-100 h-100 d-flex flex-column overflow-auto">
          <NavBar />
          <Outlet />
        </div>
      </Auth0Provider>
    );
  }
}

export default App;
