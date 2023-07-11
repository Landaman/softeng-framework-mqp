import { useEffect, useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "./HighScore.css";
import { IEvenRequest, IEvenResponse } from "common/src/numbers.ts";
import axios from "axios";
import { Prisma, HighScore } from "database";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * Simple app that has a counter that is even/odd and a high score
 * @constructor Create the react component
 */
function HighScore() {
  const { getAccessTokenSilently } = useAuth0();
  // Changeable counter
  const [count, setCount] = useState(0);

  // Result of the API determining if the number is even
  const [isEven, setIsEven] = useState(true);

  // High score from the API
  const [highScore, setHighScore] = useState(0);

  // This "effect" (how React handles talking to external services - such as our API)
  // This MUST be done here, at the top
  // Deps (at the bottom) means that every time "count" changes, the effect is rerun
  useEffect(() => {
    // This lets you use async functions in useEffect. DO NOT make the outer function async
    const fun = async () => {
      const token = await getAccessTokenSilently();

      // Doing a "post" request is asynchronous (it takes a while, we don't want our UI to wait forever on it),
      // so we run it and then set the API even variable to the response. The angular brackets determine the return
      // type
      const isEvenResponse = await axios.post<IEvenResponse>(
        "/api/numbers/is-even",
        {
          number: count,
        } satisfies IEvenRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response
      setIsEven(isEvenResponse.data.isEven);
      console.info(
        `Got is even response for count ${count}: ${isEvenResponse.data.isEven}`
      );

      // This posts our attempt at a high score
      await axios.post<void>(
        "/api/high-score",
        {
          score: count,
          time: new Date(Date.now()),
        } satisfies Prisma.HighScoreCreateInput,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.info("Successfully posted score");

      // This gets the current high score. Done after POST to avoid a race condition
      const highScoreResponse = await axios.get<HighScore>("/api/high-score", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle the response
      setHighScore(highScoreResponse.data.score);
      console.info(`Successfully fetched high score: ${highScoreResponse}`);
    };

    fun().catch((error) => console.error(error));
  }, [getAccessTokenSilently, count]);

  // React code
  return (
    <Stack className="align-items-center">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="fw-bold">Vite + React</h1>
      <Card style={{ width: "fit-content" }}>
        <Card.Header>
          <h4>Counter</h4>
        </Card.Header>
        <Card.Body>
          <p className="text-black">Count is {isEven ? "even" : "odd"}</p>
          <p className="text-black">High score is {highScore}</p>
          <p className="text-black">
            Edit <code className="text-danger">src/App.tsx</code> and save to
            test HMR
          </p>
        </Card.Body>
        <Card.Footer>
          <Button
            variant="primary"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </Button>
        </Card.Footer>
      </Card>
      <p className="text-secondary">
        Click on the Vite and React logos to learn more
      </p>
    </Stack>
  );
}

export default HighScore;
