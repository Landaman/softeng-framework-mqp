import Form from "react-bootstrap/Form";
import { useState } from "react";

// Simple element that prompts for, and receives, name
export default function Home() {
  const [name, setName] = useState("");

  return (
    <>
      <Form.Label htmlFor="nameInput">Name</Form.Label>
      <Form.Control
        id="nameInput"
        size="lg"
        type="text"
        placeholder="Large text"
        onChange={(event) => setName(event.target.value)}
      />
      <br />
      <p>Your name is {name}</p>
    </>
  );
}
