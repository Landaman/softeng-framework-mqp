import "./NavBar.css";
import hospital from "./assets/Hospital_Logo.png";

function NavBar() {
  return (
    <div className={"navBar"}>
      <img src={hospital} className={"hospitalLogo"} />
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
        <a className={"navBarLink"} href={`/HighScore`}>
          <p>Test Page</p>
        </a>
        <a className={"navBarLink"} href={`/Pathfinding`}>
          <p>Pathfinding</p>
        </a>
        <a className={"navBarLink"} href={`/MapEditor`}>
          <p>Map Editor</p>
        </a>
      </div>
      <p className={"navBarLogin"}>Login Stuff</p>
    </div>
  );
}

export default NavBar;
