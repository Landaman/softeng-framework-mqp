import { Outlet } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, Container } from "react-bootstrap";

export default function Root() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/highScore">
                <Nav.Link>High Score Game</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div id="body">
        <Outlet />
      </div>
    </>
  );
}
