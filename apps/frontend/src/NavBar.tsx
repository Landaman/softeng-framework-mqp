import "./NavBar.css";
import { Dropdown } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import hospital from "./assets/Hospital_Logo.png";

function NavBar() {
  const location = useLocation();

  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  // This ensures the access token we have is actually valid. Tries to get the access token, and if that fails requires
  // re-logging in
  useEffect(() => {
    const fun = async () => {
      try {
        await getAccessTokenSilently();
      } catch (error) {
        await loginWithRedirect({
          appState: {
            returnTo: location.pathname,
          },
        });
      }
    };

    if (!isLoading && isAuthenticated) {
      fun();
    }
  }, [
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    location.pathname,
    loginWithRedirect,
  ]);

  return (
    <div className={"navBar"}>
      <img src={hospital} className={"hospitalLogo"} />
      <div className={"linkdiv"}>
        <a className={"navBarLink"} href={`/`}>
          <p>Home</p>
        </a>
        <a className={"navBarLink"} href={`/service-requests/computer/create`}>
          <p>Computer Service</p>
        </a>
        <a
          className={"navBarLink"}
          href={`/service-requests/sanitation/create`}
        >
          <p>Sanitation Service</p>
        </a>
        <a className={"navBarLink"} href={`/high-score`}>
          <p>Test Page</p>
        </a>
        <a className={"navBarLink"} href={`/pathfinding`}>
          <p>Pathfinding</p>
        </a>
        <a className={"navBarLink"} href={`/MapEditor`}>
          <p>Map Editor</p>
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
            onClick={async () => {
              await loginWithRedirect({
                appState: {
                  returnTo: location.pathname,
                },
              });
            }}
          >
            Log In
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
