import React, { ChangeEvent, useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import "./PrototypeForm.css";

/**
 * This is the function that will be used to display your page.
 * Put your html code in the return statement.
 * @constructor
 */
export function PrototypeForm() {
  const [selectedRadio, setSelectedRadio] = useState(""); // This is used to manage state of variables
  // Use the "set[variableName]" to change state

  /**
   * This is a helper function for the page, these functions can have various uses
   * This function allows the selection menu to work properly
   * @param e --> the event that the selection menu has changed
   *              events and event handlers are very useful for detected mouse clicks, keyboard inputs, etc.
   */
  function handleRadioChange(e: ChangeEvent<HTMLInputElement>) {
    setSelectedRadio(e.target.value); // sets the selection menu to the selected option
  }

  /**
   * This is a helper function to demonstrate how you can call a function through clicking on a button
   * Implementation not complete
   */
  function handleSubmit() {
    return;
  }

  /**
   * This is a helper function to demonstrate how you can call a function through clicking on a button
   * Implementation not complete
   */
  function handleClear() {
    return;
  }

  // This is where you will put your html
  return (
    <div className={"prototype-form-container"}>
      {" "}
      {/* Naming a component or container is how you will style these components independently in css */}
      <Card style={{ width: "80vw" }}>
        {" "}
        {/* cards are excellent tools for styling, they can often be used to break your page into different sections, especially with
                                            blog posts, announcements, forms, etc. */}
        {/* cards generally have two parts: a header and a body */}
        <Card.Header className={"prototype-heading"}>
          <span className={"heading-text"}>Employee Feedback Form</span>
        </Card.Header>
        <Card.Body className={"prototype-card"}>
          <Tabs className={"prototype-tabs"} defaultActiveKey="emp" justify>
            {" "}
            {/* tabs can be used in many different ways, this example uses them
                                                                                        to display different components on the same page */}
            <Tab eventKey="emp" title="Employee Information">
              {" "}
              {/* the event key is how you dictate which tab is active */}
              <Form className={"prototype-align"}>
                {" "}
                {/* Forms are great for creating pages with user inputs, such as text fields, selections, etc */}
                <div className={"prototype-grid"}>
                  <div className={"prototype-emp-info"}>
                    <Form.Group>
                      {" "}
                      {/* Form groups are like divs, with some built in styling for the components inside the group */}
                      <Form.Label>
                        {" "}
                        {/* Using Form components instead of generic components is needed inside
                                                            Form groups to ensure that the styling is maintained */}
                        Employee to be Rated <RequiredAsterisk />{" "}
                        {/* Notice the use of a function within the label text,
                                                                                            this can be helpful for using different styles of text within the same label */}
                      </Form.Label>
                      <Form.Control
                        className={"prototype-employee"}
                        type="text"
                        required
                      />{" "}
                      {/* Form.Control is how you will create these user input components.
                                                "text" is for a text box and is going to be your most used type.
                                                some other types you may want to use: email, password, file, textarea */}
                    </Form.Group>
                    <Form.Group>
                      <Form.Group>
                        <Form.Label>
                          Rating <RequiredAsterisk />
                        </Form.Label>
                        <Form.Group className={"prototype-rating"}>
                          {/* Form.Check is how you will create selections.
                                                    The most common form that you will use is "radio"
                                                    Radios, if made properly, will ensure that only one
                                                    option can be selected at once. Name for all options
                                                    within the same selection MUST be the same to ensure
                                                    that radios work correctly. value, onChange, and checked
                                                    are needed for Radios to work properly as well, but they also
                                                    allow the selected option to used in functions through the
                                                    selectedRadio variable.*/}
                          <Form.Check
                            type={"radio"}
                            label={"1"}
                            name="group1"
                            value="1"
                            onChange={handleRadioChange}
                            checked={selectedRadio === "1"}
                            required
                          />
                          <br />
                          <Form.Check
                            type={"radio"}
                            label={"2"}
                            name="group1"
                            value="2"
                            onChange={handleRadioChange}
                            checked={selectedRadio === "2"}
                            required
                          />
                          <br />
                          <Form.Check
                            type={"radio"}
                            label={"3"}
                            name="group1"
                            value="3"
                            onChange={handleRadioChange}
                            checked={selectedRadio === "3"}
                            required
                          />
                          <br />
                          <Form.Check
                            type={"radio"}
                            label={"4"}
                            name="group1"
                            value="4"
                            onChange={handleRadioChange}
                            checked={selectedRadio === "4"}
                            required
                          />
                          <br />
                          <Form.Check
                            type={"radio"}
                            label={"5"}
                            name="group1"
                            value="5"
                            onChange={handleRadioChange}
                            checked={selectedRadio === "5"}
                            required
                          />
                          <Form.Check
                            type={"radio"}
                            label={"6"}
                            name="group1"
                            value="6"
                            onChange={handleRadioChange}
                            checked={selectedRadio === "6"}
                            required
                          />
                          <br />
                          <Form.Check
                            type={"radio"}
                            label={"7"}
                            name="group1"
                            value="7"
                            onChange={handleRadioChange}
                            checked={selectedRadio === "7"}
                            required
                          />
                          <br />
                          <Form.Check
                            type={"radio"}
                            label={"8"}
                            name="group1"
                            value="8"
                            onChange={handleRadioChange}
                            checked={selectedRadio === "8"}
                            required
                          />
                          <br />
                          <Form.Check
                            type={"radio"}
                            label={"9"}
                            name="group1"
                            value="9"
                            onChange={handleRadioChange}
                            checked={selectedRadio === "9"}
                            required
                          />
                          <br />
                          <Form.Check
                            type={"radio"}
                            label={"10"}
                            name="group1"
                            value="10"
                            onChange={handleRadioChange}
                            checked={selectedRadio === "10"}
                            required
                          />
                        </Form.Group>
                      </Form.Group>
                    </Form.Group>
                  </div>
                  <div>
                    <Form.Group>
                      <Form.Label>
                        Location of Interaction <RequiredAsterisk />
                      </Form.Label>
                      <Form.Control
                        className={"prototype-location"}
                        type="text"
                        required
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        Description of Interaction <RequiredAsterisk />
                      </Form.Label>
                      {/* sometimes, you will need to use "as" instead of "type".
                                             This is the case for textareas, which are text boxes with
                                             a variable number of rows */}
                      <Form.Control
                        className={"prototype-description"}
                        as="textarea"
                        rows={5}
                        required
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        Reason for Rating <RequiredAsterisk />
                      </Form.Label>
                      <Form.Control
                        className={"prototype-description"}
                        as="textarea"
                        rows={5}
                        required
                      />
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </Tab>
            <Tab eventKey="customer" title="Customer Information (optional)">
              {" "}
              {/* Note here is where the tab component is used to switch
                                                                                              which components are displayed on the page. Again, the eventKey
                                                                                              is important for this functionality*/}
              <Form className={"prototype-align"}>
                <div className={"prototype-grid"}>
                  <div className={"prototype-emp-info"}>
                    <Form.Group>
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control
                        className={"prototype-customer"}
                        type="text"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Email Address</Form.Label>
                      {/* Example use of the "email" type in the Form.Control component
                                            essentially very similar to the "text" type, however this can be
                                            useful for browsers that will autofill your saved emails for you.
                                            a simple way to add ease of use to your application */}
                      <Form.Control
                        className={"prototype-email"}
                        type={"email"}
                      />
                    </Form.Group>
                  </div>
                  <div>
                    <Form.Group>
                      <Form.Label>Most Frequented Store Location</Form.Label>
                      <Form.Select>
                        {" "}
                        {/* the Form.Select component, not to be confused with Form.Check,
                                                            is used for dropdown boxes. list your items in options. You will
                                                            need to declare a const variable to use these in functions, as seen
                                                            with the radios. It will also be worth looking into how you might
                                                            auto-populate these dropdown boxes with your options */}
                        <option>Select Location</option>
                        <option value="1">Worcester, MA</option>
                        <option value="2">Boston, MA</option>
                        <option value="3">Pittsburgh, PA</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </Tab>
            <Tab eventKey="extra" title="Navigation Examples">
              {" "}
              {/* Note here is where the tab component is used to switch
                                                                           which components are displayed on the page. Again, the eventKey
                                                                           is important for this functionality*/}
              <div className={"prototype-grid"}>
                These buttons take you to different pages.
                <div className={"prototype-examples"}>
                  {/* These buttons are examples of how you might navigate to different pages throughout your application
                                     using the "href" field, you can use the path to the desired page to directly navigate
                                     These paths will have to be declared within in your routes in your app */}
                  <Button variant="primary" href={"/home"}>
                    Home Page
                  </Button>
                  <Button variant="primary" href={"/pathfinding"}>
                    Pathfinding
                  </Button>
                  <Button variant="primary" href={"/mapeditor"}>
                    Map Editor
                  </Button>
                </div>
              </div>
            </Tab>
          </Tabs>
          <div className={"prototype-submit"}>
            {/* with buttons, onClick can be used to call functions
                         this allows you to create buttons with different uses throughout
                         your application, such as clearing all fields.
                         (implementation is not done for these functions) */}
            <Button variant="outline-danger" onClick={handleClear}>
              Clear
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

/**
 * helper function to style an asterisk
 * Changes the color to red
 * @constructor
 */
function RequiredAsterisk() {
  return <span style={{ color: "var(--bs-danger)" }}>*</span>;
}
