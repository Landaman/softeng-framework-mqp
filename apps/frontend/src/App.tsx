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

function App() {
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
  ]);

  return (
    <div className={"main"}>
      <NavBar />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
