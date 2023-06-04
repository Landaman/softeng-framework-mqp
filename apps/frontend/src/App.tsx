import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./Homepage.tsx";
import ServiceRequest from "./ServiceRequest.tsx";
import TestPage from "./TestPage.tsx";
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
      path: "/TestPage",
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
