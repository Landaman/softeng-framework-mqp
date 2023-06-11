import "./Pathfinding.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useState, useRef } from "react";
function Pathfinding() {
  const canvasRef = useRef(null);
  const c = useRef(null);
  useEffect(() => {
    const dpi = window.devicePixelRatio;
    const canvas = canvasRef.current;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const context = canvas.getContext("2d");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const style_height = +getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);
    //get CSS width
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const style_width = +getComputedStyle(canvas)
      .getPropertyValue("width")
      .slice(0, -2);
    //scale the canvas
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    canvas.setAttribute("height", style_height * dpi);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    canvas.setAttribute("width", style_width * dpi);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const canvasX = canvas.width;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const canvasY = canvas.height;
    context.imageSmoothingEnabled = false;
    context.fillRect(canvasX / 2, canvasY / 2, 3, 3);
    c.current = context;
  }, []);
  const [floor, setfloor] = useState("pathfindingCanvas L1");
  function groundFloor() {
    setfloor("pathfindingCanvas ground");
    clearCanvas();
  }
  function FloorL1() {
    setfloor("pathfindingCanvas L1");
    clearCanvas();
  }
  function FloorL2() {
    setfloor("pathfindingCanvas L2");
    clearCanvas();
  }
  function Floor1() {
    setfloor("pathfindingCanvas one");
    clearCanvas();
  }
  function Floor2() {
    setfloor("pathfindingCanvas two");
    clearCanvas();
  }
  function Floor3() {
    setfloor("pathfindingCanvas three");
    clearCanvas();
  }
  function clearCanvas() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    c.current.clearRect(
      0,
      0,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      canvasRef.current.width,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      canvasRef.current.height
    );
  }

  return (
    <div className={"Pathfinding"}>
      <div className={"pathfinding-inputs"}>
        <h1>Get Directions</h1>
        <input />
        <input />
        <button className={"pathfindingButton"}>Submit</button>
      </div>
      <div className={"mapdiv"}>
        <TransformWrapper>
          <TransformComponent>
            <canvas className={floor} ref={canvasRef} id={"test"}></canvas>
          </TransformComponent>
        </TransformWrapper>
        <div className={"buttondiv"}>
          <button onClick={groundFloor} className={"floorButton"}>
            Ground
          </button>
          <button onClick={FloorL1} className={"floorButton"}>
            L1
          </button>
          <button onClick={FloorL2} className={"floorButton"}>
            L2
          </button>
          <button onClick={Floor1} className={"floorButton"}>
            1
          </button>
          <button onClick={Floor2} className={"floorButton"}>
            2
          </button>
          <button onClick={Floor3} className={"floorButton"}>
            3
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pathfinding;
