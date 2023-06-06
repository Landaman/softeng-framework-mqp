import { ChangeEvent, useState } from "react";
// import axios from "axios";
import "./ServiceRequest.css";

function ServiceRequest() {
  const [locationText, setLocationText] = useState("");
  const [staffText, setStaffText] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [desktopChecked, setDesktop] = useState(false);
  const [laptopChecked, setLaptop] = useState(false);
  const [tabletChecked, setTablet] = useState(false);
  const [phoneChecked, setPhone] = useState(false);
  const [submit, setSubmit] = useState(0);

  function handleLocationInput(e: ChangeEvent<HTMLInputElement>) {
    setLocationText(e.target.value);
    console.log(deviceType);
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

  function handleSubmit() {
    setSubmit(submit + 1);
    setLocationText("");
    setReasonText("");
    setStaffText("");
    setDesktop(false);
    setLaptop(false);
    setTablet(false);
    setPhone(false);
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

  // This "effect" (how React handles talking to external services - such as our API)
  // This MUST be done here, at the top
  // Deps (at the bottom) means that every time "count" changes, the effect is rerun
  // useEffect(() => {
  //   // Doing a "post" request is asynchronous (it takes a while, we don't want our UI to wait forever on it),
  //   // so we run it and then set the API even variable to the response. The angular brackets determine the return
  //   // type
  //   axios
  //       .post<WHAT GOES HERE>("/api/...", {
  //         loc: locationText,
  //         staff: staffText,
  //         reason: reasonText,
  //         device: deviceType,
  //       } as 'IT PROBABLY GOES HERE TOO')
  //       .then((response))
  //       .catch((error) =>
  //           // Always handle any API errors :P
  //           console.error(error)
  //       );
  // }, [submit]);

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
      </div>
    </>
  );
}

export default ServiceRequest;
