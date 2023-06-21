import "./Homepage.css";
function Homepage() {
  return (
    <div className={"homepage"}>
      <h1>Homepage</h1>
      <div>
        <a href={`/ServiceRequest`}>
          <button>Service Request</button>
        </a>
        <a href={`/HighScore`}>
          <button>Test Page</button>
        </a>
      </div>
    </div>
  );
}

export default Homepage;
