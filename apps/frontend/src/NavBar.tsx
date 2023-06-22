import "./NavBar.css";
import { Dropdown } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

function NavBar() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  return (
    <div className={"navBar"}>
      <p className={"navBarText"}>Hospital Logo</p>
      <div className={"linkdiv"}>
        <a className={"navBarLink"} href={`/`}>
          <p>Home</p>
        </a>
        <a className={"navBarLink"} href={`/ServiceRequest`}>
          <p>Service Request</p>
        </a>
        <a className={"navBarLink"} href={`/HighScore`}>
          <p>Test Page</p>
        </a>
      </div>
      <Dropdown id="loginDropdown" className="navBarLink">
        <Dropdown.Toggle variant="secondary" size="sm">
          {!isLoading && isAuthenticated && user !== undefined
            ? user.name
            : "Log In"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            as="button"
            onClick={() => {
              loginWithRedirect();
            }}
          >
            Login
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            onClick={() => {
              logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              });
            }}
          >
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default NavBar;
