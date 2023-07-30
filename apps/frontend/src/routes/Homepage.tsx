import "./Homepage.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

function Homepage() {
  const { user } = useAuth0();

  return (
    <div className={"homepage"}>
      <p className={"heading-text homepage-header"}>
        Welcome{" "}
        <span style={{ color: "var(--highlight)" }}>{user && user.name}</span>
      </p>
      <div className={"data-points"}>
        <div className={"data-points-data"}>
          <p className={"data-text-bold"}>13</p>
          <p>Outgoing service requests</p>
        </div>
        <div className={"data-points-data"}>
          <p className={"data-text-bold"}>2</p>
          <p>Moves upcoming this week</p>
        </div>
        <div className={"data-points-data"}>
          <p className={"data-text-bold"}>14</p>
          <p>Tasks assigned to you</p>
        </div>
        <div className={"data-points-data"}>
          <p className={"data-text-bold"}>27</p>
          <p>Service requests completed this week</p>
        </div>
        <div className={"data-points-data"}>
          <p className={"data-text-bold"}>3</p>
          <p>Messages in your inbox</p>
        </div>
      </div>
      <div className={"services"}>
        <div className={"service-request-hub"}>
          <p className={"heading-text"}>Service Request Hub</p>
          <p className={"text-block"}>
            Check out our service requests including Sanitation requests and
            Computer requests
          </p>
          <Button variant="primary">Computer Service Request</Button>
          <div style={{ height: "16px" }}></div>
          <Button variant="primary">Sanitation Service Request</Button>
        </div>
        <div className={"pathfinding"}>
          <p className={"heading-text"}>Pathfinding</p>
          <p className={"text-block"}>
            Visit our Pathfinding page to get directions around the hospital
          </p>
          <Button variant="primary">Pathfinding</Button>
        </div>
        <div className={"map-editor"}>
          <p className={"heading-text"}>Map Editor</p>
          <p className={"text-block"}>
            Administrators can use the Map Editor to graphically make changes to
            the hospital database
          </p>
          <Button variant="primary">Map Editor</Button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
