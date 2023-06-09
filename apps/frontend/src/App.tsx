import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./Homepage.tsx";
import ServiceRequest from "./ServiceRequest.tsx";
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
      path: "/ServiceRequest",
      element: <ServiceRequest />,
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
