import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { IEvenRequest, IEvenResponse } from "common/src/INumbers.ts";
import axios from "axios";
import { Prisma, HighScore } from "database";

/**
 * Simple app that has a counter that is even/odd
 * @constructor Create the react component
 */
function App() {
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
    // Doing a "post" request is asynchronous (it takes a while, we don't want our UI to wait forever on it),
    // so we run it and then set the API even variable to the response. The angular brackets determine the return
    // type
    axios
      .post<IEvenResponse>("/api/numbers/isEven", {
        number: count,
      } satisfies IEvenRequest)
      .then((response) => {
        setIsEven(response.data.isEven);
        console.info(`Got is even response for count ${count}:
                ${response}`);
      })
      .catch((error) =>
        // Always handle any API errors :P
        console.error(error)
      );

    // This posts our attempt at a high score
    axios
      .post<void>("/api/highScore", {
        score: count,
        time: new Date(Date.now()),
      } satisfies Prisma.HighScoreCreateInput)
      .then(() => {
        console.info("Successfully posted score");

        // This gets the current high score. Done after POST to avoid a race condition
        axios
          .get<HighScore>("/api/highScore")
          .then((response) => {
            setHighScore(response.data.score);
            console.info(`Successfully fetched high score: ${response}`);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [count]);

  // React code
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Count is {isEven ? "even" : "odd"}</p>
        <p>High score is {highScore}</p>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
