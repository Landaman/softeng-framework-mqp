import "./MapEditor.css";
import { useState, useRef, MutableRefObject, useLayoutEffect } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function createNode(x, y) {
  const x1 = x - 514;
  const y1 = y - 114;
  const n: Node = { x1, y1 };
  return n;
}

interface Node {
  x1: number;
  y1: number;
}
function MapEditor() {
  const [nodes, setNodes] = useState<Array<Node>>([]);
  const [nodeChecked, setNode] = useState(false);
  const [edgeChecked, setEdge] = useState(false);
  const [moveChecked, setMove] = useState(false);
  const [mode, setMode] = useState("");
  const [movingIndex, setMovingIndex] = useState(-1);

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
    if (nodes.length > 0) {
      context.fillRect(nodes[0].x1, nodes[0].y1, 5, 5);
      oldX = nodes[0].x1;
      oldY = nodes[0].y1;
    }
    context.beginPath();
    for (let i = 1; i < nodes.length; i++) {
      const n = nodes[i];
      context.moveTo(oldX, oldY);
      context.fillRect(n.x1, n.y1, 5, 5);
      context.lineTo(n.x1, n.y1);
      oldX = n.x1;
      oldY = n.y1;
    }
    context.stroke();
    c.current = context;
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (mode === "Node") {
      setNodes((prevState) => [...prevState, createNode(clientX, clientY)]);
      console.log(mode);
    } else if (mode === "Move") {
      setMovingIndex(findNode(clientX - 512, clientY - 114));
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleMouseUp = () => {
    setMovingIndex(-1);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleMouseMove = (event) => {
    console.log(movingIndex);
    const { clientX, clientY } = event;
    if (movingIndex != -1) {
      updateNode(movingIndex, clientX, clientY);
    }
  };

  function updateNode(index: number, x: number, y: number) {
    const x1 = x - 514;
    const y1 = y - 114;
    const n: Node = { x1, y1 };
    const temp = nodes;
    temp[index] = n;
    setNodes(temp);
  }

  const [floor, setfloor] = useState("mapEditorCanvas L1");
  function groundFloor() {
    setfloor("mapEditorCanvas ground");
    clearCanvas();
  }
  function FloorL1() {
    setfloor("mapEditorCanvas L1");
    clearCanvas();
  }
  function FloorL2() {
    setfloor("mapEditorCanvas L2");
    clearCanvas();
  }
  function Floor1() {
    setfloor("mapEditorCanvas one");
    clearCanvas();
  }
  function Floor2() {
    setfloor("mapEditorCanvas two");
    clearCanvas();
  }
  function Floor3() {
    setfloor("mapEditorCanvas three");
    clearCanvas();
  }
  function clearCanvas() {
    setNodes([]);
  }

  function handleNode() {
    setNode(true);
    setEdge(false);
    setMove(false);
    setMode("Node");
  }

  function handleEdge() {
    setNode(false);
    setEdge(true);
    setMove(false);
    setMode("Edge");
  }

  function handleMove() {
    setNode(false);
    setEdge(false);
    setMove(true);
    setMode("Move");
  }

  function findNode(x: number, y: number) {
    for (let i = 0; i < nodes.length; i++) {
      if (
        x - 3 < nodes[i].x1 &&
        nodes[i].x1 < x + 3 &&
        y - 3 < nodes[i].y1 &&
        nodes[i].y1 < y + 3
      ) {
        return i;
      }
    }
    return -1;
  }

  return (
    <div className={"Pathfinding"}>
      <div className={"pathfinding-inputs"}>
        <h1>Map Editor</h1>
        <label className="selection-label">Device Type:</label>
        <div className="selection-container" onClick={handleNode}>
          <input
            className="checkbox"
            type="checkbox"
            checked={nodeChecked}
            onChange={handleNode}
          ></input>
          <label className="descriptor">Add Node</label>
        </div>
        <div className="selection-container" onClick={handleEdge}>
          <input
            className="checkbox"
            type="checkbox"
            checked={edgeChecked}
            onChange={handleEdge}
          ></input>
          <label className="descriptor">Add Edge</label>
        </div>
        <div className="selection-container" onClick={handleMove}>
          <input
            className="checkbox"
            type="checkbox"
            checked={moveChecked}
            onChange={handleMove}
          ></input>
          <label className="descriptor">Move Nodes</label>
        </div>
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
        <button className={"pathfindingButton"}>Submit changes</button>
      </div>
      <div className={"mapdiv"}>
        <canvas
          className={floor}
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></canvas>
      </div>
    </div>
  );
}

export default MapEditor;
