import "./NavBar.css";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import hospital from "./assets/mgb-logo-color.png";

function NavBar() {
  const location = useLocation();

  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    user,
    logout,
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
    <Navbar expand="lg" className={"navbar"}>
      <Navbar.Brand href="/">
        <img alt="" src={hospital} className={"hospitalLogo"} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/" className={"navbar-link"}>
            Home
          </Nav.Link>
          <Nav.Link
            href={`/service-requests/computer/create`}
            className={"navbar-link"}
          >
            Computer Service
          </Nav.Link>
          <Nav.Link
            href={`/service-requests/sanitation/create`}
            className={"navbar-link"}
          >
            Sanitation Service
          </Nav.Link>
          <Nav.Link href={`/pathfinding`} className={"navbar-link"}>
            Pathfinding
          </Nav.Link>
          <Nav.Link href={`/mapeditor`} className={"navbar-link"}>
            Map Editor
          </Nav.Link>
          {!isAuthenticated && user === undefined ? (
            <Nav.Link
              className={"navbar-link"}
              onClick={async () => {
                await loginWithRedirect({
                  appState: {
                    returnTo: location.pathname,
                  },
                });
              }}
            >
              Log in
            </Nav.Link>
          ) : (
            <NavDropdown
              title={user?.name}
              id="basic-nav-dropdown"
              className={"navbar-link"}
            >
              <NavDropdown.Item
                onClick={() => {
                  logout({
                    logoutParams: {
                      returnTo: window.location.origin,
                    },
                  });
                }}
              >
                Log out
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
