import Form from "react-bootstrap/Form";
import { useState } from "react";

// Simple element that prompts for, and receives, name
export default function Home() {
  const [name, setName] = useState("");

  return (
    <div className="text-center">
      <Form.Label htmlFor="nameInput">Name</Form.Label>
      <Form.Control
        id="nameInput"
        size="lg"
        type="text"
        placeholder="Large text"
        style={{ width: "fit-content" }}
        className="mx-auto"
        onChange={(event) => setName(event.target.value)}
      />
      <br />
      <p>Your name is {name}</p>
    </div>
  );
}
