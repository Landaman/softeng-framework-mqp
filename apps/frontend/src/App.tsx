import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/Homepage.tsx";
import {
  ComputerService,
  SanitationService,
} from "./routes/ServiceRequest.tsx";
import Login from "./Login.tsx";
import TestPage from "./routes/highScore.tsx";
import NavBar from "./NavBar.tsx";
import Pathfinding from "./routes/Pathfinding.tsx";
import MapEditor from "./routes/MapEditor.tsx";

function App() {
  const navbarRouter = createBrowserRouter([
    {
      path: "/*",
      element: <NavBar />,
    },
    {
      path: "/Login",
      element: null,
    },
  ]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/ComputerService",
      element: <ComputerService />,
    },
    {
      path: "/SanitationService",
      element: <SanitationService />,
    },
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/HighScore",
      element: <TestPage />,
    },
    {
      path: "/Pathfinding",
      element: <Pathfinding />,
    },
    {
      path: "/MapEditor",
      element: <MapEditor />,
    },
  ]);

  return (
    <div className={"main"}>
      <RouterProvider router={navbarRouter} />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
