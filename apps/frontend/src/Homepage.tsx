function Homepage() {
  return (
    <>
      <h1>Homepage</h1>
      <a href={`/ServiceRequest`}>
        <button>Service Request</button>
      </a>
      <a href={`/HighScore`}>
        <button>Test Page</button>
      </a>
      <a href={`/Login`}>
        <button>Login</button>
      </a>
    </>
  );
}

export default Homepage;
