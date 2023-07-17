import { ChangeEvent, useState } from "react";
import "./ServiceRequest.css";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";
import ComputerRequestDao, {
  ComputerRequest,
} from "../database/computer-request-dao.ts";
import SanitationRequestDao, {
  SanitationRequest,
} from "../database/sanitaiton-request-dao.ts";

export function ComputerService() {
  const { getAccessTokenSilently } = useAuth0();

  const [locationText, setLocationText] = useState("");
  const [staffText, setStaffText] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [desktopChecked, setDesktop] = useState(false);
  const [laptopChecked, setLaptop] = useState(false);
  const [tabletChecked, setTablet] = useState(false);
  const [phoneChecked, setPhone] = useState(false);

  function handleLocationInput(e: ChangeEvent<HTMLInputElement>) {
    setLocationText(e.target.value);
  }

  function handleStaffInput(e: ChangeEvent<HTMLInputElement>) {
    setStaffText(e.target.value);
  }

  function handleReasonText(e: ChangeEvent<HTMLTextAreaElement>) {
    setReasonText(e.target.value);
  }

  function handleDesktop() {
    setDeviceType("Desktop");
    setDesktop(true);
    setLaptop(false);
    setTablet(false);
    setPhone(false);
  }

  function handleLaptop() {
    setDeviceType("Laptop");
    setDesktop(false);
    setLaptop(true);
    setTablet(false);
    setPhone(false);
  }

  function handleTablet() {
    setDeviceType("Tablet");
    setDesktop(false);
    setLaptop(false);
    setTablet(true);
    setPhone(false);
  }

  function handlePhone() {
    setDeviceType("Phone");
    setDesktop(false);
    setLaptop(false);
    setTablet(false);
    setPhone(true);
  }

  async function handleSubmit() {
    if (
      locationText &&
      reasonText &&
      staffText &&
      (desktopChecked || laptopChecked || tabletChecked || phoneChecked)
    ) {
      setLocationText("");
      setReasonText("");
      setStaffText("");
      setDesktop(false);
      setLaptop(false);
      setTablet(false);
      setPhone(false);
      // Defer to the DAO to create the request
      const dao = new ComputerRequestDao();
      await dao.create(await getAccessTokenSilently(), {
        id: 0,
        location: locationText,
        staff: staffText,
        reason: reasonText,
        type: deviceType,
      } satisfies ComputerRequest);
      console.info("Successfully created service request");
    } else {
      console.error("All entries need to be filled");
    }
  }

  function handleClear() {
    setLocationText("");
    setReasonText("");
    setStaffText("");
    setDesktop(false);
    setLaptop(false);
    setTablet(false);
    setPhone(false);
  }

  return (
    <>
      <h1>Computer Service</h1>
      <div className="hbox">
        <div className="vbox">
          <div className="label-container">
            <label>Location:</label>
            <input value={locationText} onChange={handleLocationInput} />
          </div>
          <div className="label-container">
            <label>Associated Staff:</label>
            <input value={staffText} onChange={handleStaffInput} />
          </div>
          <div className="label-container2">
            <label>Reason:</label>
            <textarea value={reasonText} rows={3} onChange={handleReasonText} />
          </div>
          <div className="hbox-button">
            <button className={"submit"} onClick={handleSubmit}>
              Submit
            </button>
            <div className={"spacer2"}></div>
            <button className={"cancel"} onClick={handleClear}>
              Cancel
            </button>
          </div>
        </div>
        <div className={"spacer1"}></div>
        <div className="vbox">
          <label className="selection-label">Device Type:</label>
          <div className="selection-container" onClick={handleDesktop}>
            <input
              className="checkbox"
              type="checkbox"
              checked={desktopChecked}
              onChange={handleDesktop}
            ></input>
            <label className="descriptor">Desktop</label>
          </div>
          <div className="selection-container" onClick={handleLaptop}>
            <input
              className="checkbox"
              type="checkbox"
              checked={laptopChecked}
              onChange={handleLaptop}
            ></input>
            <label className="descriptor">Laptop</label>
          </div>
          <div className="selection-container" onClick={handleTablet}>
            <input
              className="checkbox"
              type="checkbox"
              checked={tabletChecked}
              onChange={handleTablet}
            ></input>
            <label className="descriptor">Tablet</label>
          </div>
          <div className="selection-container" onClick={handlePhone}>
            <input
              className="checkbox"
              type="checkbox"
              checked={phoneChecked}
              onChange={handlePhone}
            ></input>
            <label className="descriptor">Phone</label>
          </div>
        </div>

        <NavLink to={"/service-requests/computer/view"}>
          <Button variant="secondary" size="sm" className="align-self-end">
            View All Requests
          </Button>
        </NavLink>
      </div>
    </>
  );
}

export function SanitationService() {
  const { getAccessTokenSilently } = useAuth0();
  const [locationText, setLocationText] = useState("");
  const [staffText, setStaffText] = useState("");
  const [issueText, setIssueText] = useState("");
  const [urgency, setUrgency] = useState("");
  const [mildChecked, setMild] = useState(false);
  const [promptChecked, setPrompt] = useState(false);
  const [urgentChecked, setUrgent] = useState(false);
  const [extremelyUrgentChecked, setExtremelyUrgent] = useState(false);

  const handleSubmit = async () => {
    if (
      locationText &&
      issueText &&
      staffText &&
      (mildChecked || promptChecked || urgentChecked || extremelyUrgentChecked)
    ) {
      setLocationText("");
      setIssueText("");
      setStaffText("");
      setMild(false);
      setPrompt(false);
      setUrgent(false);
      setExtremelyUrgent(false);
      const dao = new SanitationRequestDao();

      await dao.create(await getAccessTokenSilently(), {
        id: 0,
        location: locationText,
        staff: staffText,
        issue: issueText,
        urgency: urgency,
      } satisfies SanitationRequest);
      console.info("Successfully created service request");
    } else {
      console.error("All entries need to be filled");
    }
  };

  function handleLocationInput(e: ChangeEvent<HTMLInputElement>) {
    setLocationText(e.target.value);
  }

  function handleStaffInput(e: ChangeEvent<HTMLInputElement>) {
    setStaffText(e.target.value);
  }

  function handleIssueText(e: ChangeEvent<HTMLTextAreaElement>) {
    setIssueText(e.target.value);
  }

  function handleMild() {
    setUrgency("Mild");
    setMild(true);
    setPrompt(false);
    setUrgent(false);
    setExtremelyUrgent(false);
  }

  function handlePrompt() {
    setUrgency("Prompt");
    setMild(false);
    setPrompt(true);
    setUrgent(false);
    setExtremelyUrgent(false);
  }

  function handleUrgent() {
    setUrgency("Urgent");
    setMild(false);
    setPrompt(false);
    setUrgent(true);
    setExtremelyUrgent(false);
  }

  function handleExtremelyUrgent() {
    setUrgency("Extremely Urgent");
    setMild(false);
    setPrompt(false);
    setUrgent(false);
    setExtremelyUrgent(true);
  }

  function handleClear() {
    setLocationText("");
    setIssueText("");
    setStaffText("");
    setMild(false);
    setPrompt(false);
    setUrgent(false);
    setExtremelyUrgent(false);
  }

  return (
    <>
      <h1>Sanitation Service</h1>
      <div className="hbox">
        <div className="vbox">
          <div className="label-container">
            <label>Location:</label>
            <input value={locationText} onChange={handleLocationInput} />
          </div>
          <div className="label-container">
            <label>Associated Staff:</label>
            <input value={staffText} onChange={handleStaffInput} />
          </div>
          <div className="label-container2">
            <label>Issue:</label>
            <textarea value={issueText} rows={3} onChange={handleIssueText} />
          </div>
          <div className="hbox-button">
            <button className={"submit"} onClick={handleSubmit}>
              Submit
            </button>
            <div className={"spacer2"}></div>
            <button className={"cancel"} onClick={handleClear}>
              Cancel
            </button>
          </div>
        </div>
        <div className={"spacer1"}></div>
        <div className="vbox">
          <label className="selection-label">Urgency:</label>
          <div className="selection-container" onClick={handleMild}>
            <input
              className="checkbox"
              type="checkbox"
              checked={mildChecked}
              onChange={handleMild}
            ></input>
            <label className="descriptor">Mild</label>
          </div>
          <div className="selection-container" onClick={handlePrompt}>
            <input
              className="checkbox"
              type="checkbox"
              checked={promptChecked}
              onChange={handlePrompt}
            ></input>
            <label className="descriptor">Prompt</label>
          </div>
          <div className="selection-container" onClick={handleUrgent}>
            <input
              className="checkbox"
              type="checkbox"
              checked={urgentChecked}
              onChange={handleUrgent}
            ></input>
            <label className="descriptor">Urgent</label>
          </div>
          <div className="selection-container" onClick={handleExtremelyUrgent}>
            <input
              className="checkbox"
              type="checkbox"
              checked={extremelyUrgentChecked}
              onChange={handleExtremelyUrgent}
            ></input>
            <label className="descriptor">Extremely Urgent</label>
          </div>
        </div>
      </div>
    </>
  );
}
