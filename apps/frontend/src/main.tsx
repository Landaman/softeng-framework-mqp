import React from "react";
import ReactDOM from "react-dom/client";
import HighScore from "./routes/highScore.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/errorPage.tsx";
import Root from "./routes/root.tsx";

// Set up the page router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/highScore",
        element: <HighScore />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
