import "./Pathfinding.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useLayoutEffect, useState, useRef, MutableRefObject } from "react";
import { MapNode } from "../MapComponents.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function createNode(x, y) {
  const x1 = x;
  const y1 = y;
  const n: MapNode = { x1, y1 };
  return n;
}

function Pathfinding() {
  const [mapNodes, setMapNodes] = useState<Array<MapNode>>([
    createNode(100, 100),
    createNode(200, 100),
    createNode(200, 200),
    createNode(100, 200),
  ]);
  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>;
  const c = useRef() as MutableRefObject<CanvasRenderingContext2D>;
  useLayoutEffect(() => {
    const dpi = window.devicePixelRatio;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const style_height = +getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);

    //get CSS width
    const style_width = +getComputedStyle(canvas)
      .getPropertyValue("width")
      .slice(0, -2);

    //scale the canvas
    canvas.setAttribute("height", String(style_height * dpi));
    canvas.setAttribute("width", String(style_width * dpi));

    context.imageSmoothingEnabled = false;

    let oldX = 0;
    let oldY = 0;
    if (mapNodes.length > 0) {
      context.fillRect(mapNodes[0].x1 - 3, mapNodes[0].y1 - 3, 6, 6);
      oldX = mapNodes[0].x1;
      oldY = mapNodes[0].y1;
    }
    context.beginPath();
    for (let i = 1; i < mapNodes.length; i++) {
      const n = mapNodes[i];
      context.moveTo(oldX, oldY);
      context.fillRect(n.x1 - 3, n.y1 - 3, 6, 6);
      context.lineTo(n.x1, n.y1);
      oldX = n.x1;
      oldY = n.y1;
      console.log("i");
    }
    context.stroke();
    c.current = context;
  });

  function drawPath() {
    setMapNodes([
      createNode(100, 100),
      createNode(200, 100),
      createNode(200, 200),
      createNode(100, 200),
    ]);
  }

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
    setMapNodes([]);
  }

  return (
    <div className={"Pathfinding"}>
      <div className={"pathfinding-inputs"}>
        <h1>Get Directions</h1>
        <input />
        <input />
        <button onClick={drawPath} className={"pathfindingButton"}>
          Submit
        </button>
      </div>
      <div className={"mapdiv"}>
        <TransformWrapper>
          <TransformComponent>
            <canvas className={floor} ref={canvasRef}></canvas>
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
