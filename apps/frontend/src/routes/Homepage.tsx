import "./Homepage.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import ComputerRequestDao from "../database/computer-request-dao.ts";
import SanitationRequestDao from "../database/sanitation-request-dao.ts";

function Homepage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [sanitationRequests, setSanitationRequests] = useState(0);
  const [computerRequests, setComputerRequests] = useState(0);

  const fetchServiceRequests = async () => {
    let computerRequests = 0;
    let sanitationRequests = 0;
    const computerDao = new ComputerRequestDao();
    const sanitationDao = new SanitationRequestDao();
    await computerDao
      .getAll(await getAccessTokenSilently())
      .then((response) => (computerRequests = response.length));
    await sanitationDao
      .getAll(await getAccessTokenSilently())
      .then((response) => (sanitationRequests = response.length));
    return {
      computerRequests: computerRequests,
      sanitationRequests: sanitationRequests,
    };
  };

  fetchServiceRequests().then((response) => {
    setComputerRequests(response.computerRequests);
    setSanitationRequests(response.sanitationRequests);
  });

  return (
    <div className={"homepage"}>
      <p className={"heading-text homepage-header"}>
        Welcome{" "}
        <span style={{ color: "var(--primary)" }}>{user && user.name}</span>
      </p>
      <div className={"data-points"}>
        <div className={"data-points-data"}>
          <p className={"data-text-bold"}>{computerRequests}</p>
          <p>Computer service requests</p>
        </div>
        <div className={"data-points-data"}>
          <p className={"data-text-bold"}>{sanitationRequests}</p>
          <p>Sanitation service requests</p>
        </div>
      </div>
      <div className={"services"}>
        <div className={"service-request-hub"}>
          <p className={"heading-text"}>Service Request Hub</p>
          <p className={"text-block"}>
            Check out our service requests including Sanitation requests and
            Computer requests
          </p>
          <Link to="/service-requests/computer/create">
            <Button variant="primary">Computer Service Request</Button>
          </Link>
          <div style={{ height: "16px" }}></div>
          <Link to="/service-requests/sanitation/create">
            <Button variant="primary">Sanitation Service Request</Button>
          </Link>
        </div>
        <div className={"pathfinding"}>
          <p className={"heading-text"}>Pathfinding</p>
          <p className={"text-block"}>
            Visit our Pathfinding page to get directions around the hospital
          </p>
          <Link to="/pathfinding">
            <Button variant="primary">Pathfinding</Button>
          </Link>
        </div>
        <div className={"map-editor"}>
          <p className={"heading-text"}>Map Editor</p>
          <p className={"text-block"}>
            Administrators can use the Map Editor to graphically make changes to
            the hospital database
          </p>
          <Link to="/mapEditor">
            <Button variant="primary">Map Editor</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
