import "./Homepage.css";
function Homepage() {
    return <div className={"homepage"}>
        <h1 className={"homepageHeader"}>Brigham and Women’s<br></br>
            Hospital Homepage</h1>
            <a href={`/ServiceRequest`}>
                <button className={"homepageButton"}>Service Request</button>
            </a>
            <a href={`/TestPage`}>
                <button className={"homepageButton"}>Test Page</button>
            </a>
    </div>;
}

export default Homepage;