import { Outlet } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Nav, Navbar } from "react-bootstrap";

export default function Root() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Button>Home</Button>
            </LinkContainer>
            <LinkContainer to="highScore">
              <Button>High Score Game</Button>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div id="body">
        <Outlet />
      </div>
    </>
  );
}
