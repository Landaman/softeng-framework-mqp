import "./Login.css";
import { Button } from "react-bootstrap";
import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { User } from "database";
import axios from "axios";

function Login() {
  const [user, setUser] = useState("");

  const [password, setPassword] = useState("");
  const [dbPass, setDbPass] = useState("");

  const handleLoginButton = useCallback(() => {
    if (password && user) {
      axios
        .get<User>(`/api/user/${user}`)
        .then(
          (response) => {
            setDbPass(response.data.password);
            console.info(`Successfully fetched user: ${response}`);
            if (dbPass === password) {
              // check login info here
              window.location.href = "/";
            } else {
              console.log("Invalid credentials"); // put this on the page somewhere
            }
          },
          () => {
            console.log("Invalid credentials");
          }
        )
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("Invalid credentials");
    }
  }, [user, dbPass, password]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleLoginButton();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleLoginButton]);

  function handleUsernameInput(e: ChangeEvent<HTMLInputElement>) {
    setUser(e.target.value);
  }

  function handlePasswordInput(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

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
            value={user}
            placeholder="Enter your username"
            style={{ marginBottom: "12px", marginTop: "36px" }}
            onChange={handleUsernameInput}
          />

          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            style={{ marginBottom: "63px" }}
            onChange={handlePasswordInput}
          />
          <Button
            className={"defaultbutton"}
            variant="contained"
            onClick={handleLoginButton}
          >
            Login{" "}
          </Button>
        </div>
      </div>
    </>
  );
}
export default Login;
