import { Outlet } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import "./root.css";
import { Button } from "react-bootstrap";

export default function Root() {
  return (
    <div id="content-root">
      <nav id="sidebar">
        <LinkContainer to="/">
          <Button>Home</Button>
        </LinkContainer>
        <LinkContainer to="highScore">
          <Button>High Score Game</Button>
        </LinkContainer>
      </nav>
      <div id="body">
        <Outlet />
      </div>
    </div>
  );
}
