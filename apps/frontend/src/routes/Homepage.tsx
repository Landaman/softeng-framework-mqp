import "./Homepage.css";
function Homepage() {
  return (
    <div className={"homepage"}>
      <h1>Homepage</h1>
      <a href={`/ServiceRequest`}>
        <button className={"homepageButton"}>Service Request</button>
      </a>
      <a href={`/high-score`}>
        <button className={"homepageButton"}>Test Page</button>
      </a>
      <a href={`/login`}>
        <button className={"homepageButton"}>Login</button>
      </a>
      <a href={`/pathfinding`}>
        <button className={"homepageButton"}>Pathfinding</button>
      </a>
    </div>
  );
}

export default Homepage;
