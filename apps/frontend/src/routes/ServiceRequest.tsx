import React, { ChangeEvent, useState } from "react";
import "./ServiceRequest.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";
import ComputerRequestDao, {
  CreateComputerRequest,
} from "../database/computer-request-dao.ts";
import SanitationRequestDao, {
  CreateSanitationRequest,
} from "../database/sanitation-request-dao.ts";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Toast } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export function ComputerService() {
  const { getAccessTokenSilently } = useAuth0();

  const [locationText, setLocationText] = useState("");
  const [staffText, setStaffText] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  function handleLocationInput(e: ChangeEvent<HTMLInputElement>) {
    setLocationText(e.target.value);
  }

  function handleStaffInput(e: ChangeEvent<HTMLInputElement>) {
    setStaffText(e.target.value);
  }

  function handleReasonText(e: ChangeEvent<HTMLTextAreaElement>) {
    setReasonText(e.target.value);
  }

  function handleRadioChange(e: ChangeEvent<HTMLInputElement>) {
    setSelectedRadio(e.target.value);
  }

  const toggleShowToast = () => setShowToast(!showToast);

  const handleToast = (variant: string) => {
    variant == "success"
      ? setToastMessage("Computer request was successfully submitted.")
      : setToastMessage("Please fill out all the required fields.");
    setToastVariant(variant);
    toggleShowToast();
  };

  async function handleSubmit() {
    if (locationText && reasonText && staffText && selectedRadio) {
      // Defer to the DAO to create the request
      const dao = new ComputerRequestDao();
      await dao.create(await getAccessTokenSilently(), {
        location: locationText,
        staff: staffText,
        reason: reasonText,
        type: selectedRadio,
      } satisfies CreateComputerRequest);
      handleToast("success");
      console.info("Successfully created service request");
      handleClear();
    } else {
      handleToast("danger");
      console.error("All entries need to be filled");
    }
  }

  function handleClear() {
    setLocationText("");
    setReasonText("");
    setStaffText("");
    setSelectedRadio("");
  }

  return (
    <div className={"service-request-container"}>
      <Card style={{ width: "80vw" }}>
        <Card.Header className={"service-request-header"}>
          <span className={"heading-text"}>Computer Request</span>
          <LinkContainer to="/service-requests/computer/view">
            <Button variant="outline-primary">View all requests</Button>
          </LinkContainer>
        </Card.Header>
        <Card.Body>
          <Form className={"service-request-align"}>
            <div className={"service-request-grid"}>
              <div>
                <Form.Group>
                  <Form.Label>
                    Location <RequiredAsterisk />
                  </Form.Label>
                  <Form.Control
                    className={"service-request-input"}
                    type="text"
                    value={locationText}
                    onChange={handleLocationInput}
                    required
                  />
                </Form.Group>
                <br />
                <Form.Label>
                  Associated Staff <RequiredAsterisk />
                </Form.Label>
                <Form.Control
                  className={"service-request-input"}
                  type="text"
                  value={staffText}
                  onChange={handleStaffInput}
                  required
                />
                <br />
                <Form.Label>
                  Reason <RequiredAsterisk />
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className={"service-request-textarea"}
                  type="text"
                  value={reasonText}
                  onChange={handleReasonText}
                  required
                />
              </div>
              <div>
                <Form.Group>
                  <Form.Label>
                    Device Type <RequiredAsterisk />
                  </Form.Label>
                  <Form.Check
                    type="radio"
                    label="Desktop"
                    name="group1"
                    value="desktop"
                    onChange={handleRadioChange}
                    checked={selectedRadio === "desktop"}
                    id="mild"
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="Laptop"
                    name="group1"
                    value="laptop"
                    onChange={handleRadioChange}
                    checked={selectedRadio === "laptop"}
                    id="prompt"
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="Tablet"
                    name="group1"
                    value="tablet"
                    onChange={handleRadioChange}
                    checked={selectedRadio === "tablet"}
                    id="urgent"
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="Phone"
                    name="group1"
                    value="phone"
                    onChange={handleRadioChange}
                    checked={selectedRadio === "phone"}
                    id="very urgent"
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className={"service-request-submit"}>
              <Button variant="outline-danger" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <div className={"service-request-toast-container"}>
        <Toast
          show={showToast}
          onClose={toggleShowToast}
          bg={toastVariant.toLowerCase()}
        >
          <Toast.Header className={"toast-header"}>
            <strong>{toastVariant == "success" ? "Success!" : "Error"}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>
    </div>
  );
}

export function SanitationService() {
  const { getAccessTokenSilently } = useAuth0();
  const [locationText, setLocationText] = useState("");
  const [staffText, setStaffText] = useState("");
  const [issueText, setIssueText] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const toggleShowToast = () => setShowToast(!showToast);

  const handleToast = (variant: string) => {
    variant == "success"
      ? setToastMessage("Sanitation request was successfully submitted.")
      : setToastMessage("Please fill out all the required fields.");
    setToastVariant(variant);
    toggleShowToast();
  };

  const handleSubmit = async () => {
    if (locationText && issueText && staffText && selectedRadio) {
      const dao = new SanitationRequestDao();

      await dao.create(await getAccessTokenSilently(), {
        location: locationText,
        staff: staffText,
        issue: issueText,
        urgency: selectedRadio,
      } satisfies CreateSanitationRequest);
      handleToast("success");
      console.info("Successfully created service request");
      handleClear();
    } else {
      handleToast("danger");
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

  function handleRadioChange(e: ChangeEvent<HTMLInputElement>) {
    setSelectedRadio(e.target.value);
  }

  function handleClear() {
    setLocationText("");
    setIssueText("");
    setStaffText("");
    setSelectedRadio("");
  }

  return (
    <div className={"service-request-container"}>
      <Card style={{ width: "80vw" }}>
        <Card.Header className={"service-request-header"}>
          <span className={"heading-text"}>Sanitation Request</span>
          <LinkContainer to="/service-requests/sanitation/view">
            <Button variant="outline-primary">View all requests</Button>
          </LinkContainer>
        </Card.Header>
        <Card.Body>
          <Form className={"service-request-align"}>
            <div className={"service-request-grid"}>
              <div>
                <Form.Group>
                  <Form.Label>
                    Location <RequiredAsterisk />
                  </Form.Label>
                  <Form.Control
                    className={"service-request-input"}
                    type="text"
                    value={locationText}
                    onChange={handleLocationInput}
                    required
                  />
                </Form.Group>
                <br />
                <Form.Label>
                  Associated Staff <RequiredAsterisk />
                </Form.Label>
                <Form.Control
                  className={"service-request-input"}
                  type="text"
                  value={staffText}
                  onChange={handleStaffInput}
                  required
                />
                <br />
                <Form.Label>
                  Issue <RequiredAsterisk />
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className={"service-request-textarea"}
                  type="text"
                  value={issueText}
                  onChange={handleIssueText}
                  required
                />
              </div>
              <div>
                <Form.Group>
                  <Form.Label>
                    Urgency <RequiredAsterisk />
                  </Form.Label>
                  <Form.Check
                    type="radio"
                    label="Mild"
                    name="group1"
                    value="mild"
                    onChange={handleRadioChange}
                    checked={selectedRadio === "mild"}
                    id="mild"
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="Prompt"
                    name="group1"
                    value="prompt"
                    onChange={handleRadioChange}
                    checked={selectedRadio === "prompt"}
                    id="prompt"
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="Urgent"
                    name="group1"
                    value="urgent"
                    onChange={handleRadioChange}
                    checked={selectedRadio === "urgent"}
                    id="urgent"
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="Very Urgent"
                    name="group1"
                    value="very urgent"
                    onChange={handleRadioChange}
                    checked={selectedRadio === "very urgent"}
                    id="very urgent"
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className={"service-request-submit"}>
              <Button variant="outline-danger" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <div className={"service-request-toast-container"}>
        <Toast
          show={showToast}
          onClose={toggleShowToast}
          bg={toastVariant.toLowerCase()}
        >
          <Toast.Header className={"toast-header"}>
            <strong>{toastVariant == "success" ? "Success!" : "Error"}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>
    </div>
  );
}

function RequiredAsterisk() {
  return <span style={{ color: "var(--bs-danger)" }}>*</span>;
}
