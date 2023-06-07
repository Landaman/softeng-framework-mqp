import React from "react";
import ReactDOM from "react-dom/client";
import HighScore from "./routes/highScore.tsx";
import Home from "./routes/home.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/errorPage.tsx";
import Root from "./routes/root.tsx";
import "./scss/custom.scss";

// Set up the page router
const router = createBrowserRouter([
  {
    path: "",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/highScore",
        element: <HighScore />,
      },
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
