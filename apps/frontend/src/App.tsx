import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./Homepage.tsx";
import ServiceRequest from "./ServiceRequest.tsx";
import Login from "./Login.tsx";

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
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
