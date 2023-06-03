function NavBar() {
  return (
    <div className={"navBar"}>
      <p className={"navBarText"}>Hospital Logo</p>
      <div className={"navBar"}>
        <a className={"navBarLink"} href={`/`}>
          <p>Home</p>
        </a>
        <a className={"navBarLink"} href={`/ServiceRequest`}>
          <p>Service Request</p>
        </a>
        <a className={"navBarLink"} href={`/TestPage`}>
          <p>Test Page</p>
        </a>
      </div>
      <p className={"navBarText"}>Login Stuff</p>
    </div>
  );
}

export default NavBar;
