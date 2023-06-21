import "./login.css";
import { Button } from "react-bootstrap";
import { useState } from "react";
function Login() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [password, setPassword] = useState("");

  return (
    <>
      <div className={"parent"}>
        <div className={"background"} />
        <div className={"rightside"}>
          <img
            src={"./src/assets/Brigham_and_Womens_Hospital_Logo.png"}
            width="199"
            height="57"
          />

          <input
            type="user"
            placeholder="Enter your username"
            style={{ marginBottom: "12px", marginTop: "36px" }}
          />

          <input
            type="password"
            placeholder="Enter your password"
            style={{ marginBottom: "63px" }}
          />
          <Button className={"defaultbutton"} variant="contained" href={"/"}>
            Login{" "}
          </Button>
        </div>
      </div>
    </>
  );
}
export default Login;
