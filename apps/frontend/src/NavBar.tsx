import "./NavBar.css";
function NavBar() {
  return (
    <div className={"navBar"}>
      <p className={"navBarText"}>Hospital Logo</p>
      <div className={"linkdiv"}>
        <a className={"navBarLink"} href={`/`}>
          <p>Home</p>
        </a>
        <a className={"navBarLink"} href={`/ComputerService`}>
          <p>Computer Service</p>
        </a>
        <a className={"navBarLink"} href={`/SanitationService`}>
          <p>Sanitation Service</p>
        </a>
        <a className={"navBarLink"} href={`/TestPage`}>
          <p>Test Page</p>
        </a>
      </div>
      <p className={"navBarLogin"}>Login Stuff</p>
    </div>
  );
}

export default NavBar;
