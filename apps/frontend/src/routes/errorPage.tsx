import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import "./errorPage.css";

/**
 * Simple page that displays an error when a router error occurs
 */
export default function ErrorPage() {
  // We genuienly have no idea as to this thing type
  const error = useRouteError();
  console.error(error);

  let errorMessage: string;

  // Determine what to do with the error based on what fields it has
  if (isRouteErrorResponse(error)) {
    errorMessage = error.error?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
