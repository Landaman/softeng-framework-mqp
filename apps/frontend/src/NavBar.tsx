import "./NavBar.css";
import { Dropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
function NavBar() {
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
          Login
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <LinkContainer to="/login">
            <Dropdown.Item>Login</Dropdown.Item>
          </LinkContainer>
          <LinkContainer to="/login">
            <Dropdown.Item>Logout</Dropdown.Item>
          </LinkContainer>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default NavBar;
