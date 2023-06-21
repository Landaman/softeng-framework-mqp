import "./NavBar.css";
import { Dropdown } from "react-bootstrap";

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
          <Dropdown.Item as="button">Login</Dropdown.Item>
          <Dropdown.Item as="button">Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default NavBar;
