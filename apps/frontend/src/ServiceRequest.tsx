import { ChangeEvent, useState } from "react";

function ServiceRequest() {
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

  function handleSubmit() {
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
        </div>
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
      <div className="hbox-button">
        <a href={`/`}>
          <button className={"button"}>Return Home (temp)</button>
        </a>
        <div className={"spacer"}></div>
        <button className={"submit"} onClick={handleSubmit}>
          Submit
        </button>
        <button className={"cancel"} onClick={handleClear}>
          Cancel
        </button>
      </div>
    </>
  );
}

export default ServiceRequest;