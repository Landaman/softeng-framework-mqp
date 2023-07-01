import "./MapEditor.css";
import { useState, useRef, MutableRefObject, useLayoutEffect } from "react";
import { MapNode, MapEdge } from "../MapComponents.ts";

function createMapNode(x: number, y: number) {
  const x1 = x - 514;
  const y1 = y - 115;
  const color = "blue";
  const n: MapNode = { x1, y1, color };
  return n;
}

function createMapEdge(i1: number, i2: number) {
  const index1 = i1;
  const index2 = i2;
  const e: MapEdge = { index1, index2 };
  return e;
}
function MapEditor() {
  const [mapNodes, setMapNodes] = useState<Array<MapNode>>([]);
  const [mapEdges, setMapEdges] = useState<Array<MapEdge>>([]);
  const [nodeChecked, setNode] = useState(false);
  const [edgeChecked, setEdge] = useState(false);
  const [moveChecked, setMove] = useState(false);
  const [mode, setMode] = useState("");
  const [movingIndex, setMovingIndex] = useState(-1);
  let tempEdgeIndex = -1;

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

    // draw nodes

    for (let i = 0; i < mapNodes.length; i++) {
      const n = mapNodes[i];
      context.fillRect(n.x1, n.y1, 6, 6);
    }

    // draw edges
    context.beginPath();
    for (let i = 0; i < mapEdges.length; i++) {
      const edge = mapEdges[i];
      context.moveTo(
        mapNodes[edge.index1].x1 + 3,
        mapNodes[edge.index1].y1 + 3
      );
      context.lineTo(
        mapNodes[edge.index2].x1 + 3,
        mapNodes[edge.index2].y1 + 3
      );
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
      setMapNodes((prevState) => [
        ...prevState,
        createMapNode(clientX, clientY),
      ]);
      console.log(mode);
    } else if (mode === "Move") {
      setMovingIndex(findNode(clientX - 514, clientY - 115));
    } else if (mode === "Edge") {
      if (tempEdgeIndex === -1) {
        tempEdgeIndex = findNode(clientX - 514, clientY - 115);
      } else {
        const temp = findNode(clientX - 514, clientY - 115);
        if (temp != -1) {
          setMapEdges((prevState) => [
            ...prevState,
            createMapEdge(tempEdgeIndex, temp),
          ]);
          tempEdgeIndex = -1;
        }
      }
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
      updateNode(movingIndex, clientX, clientY, "blue");
    }
  };

  function updateNode(index: number, x: number, y: number, color: string) {
    const x1 = x - 514;
    const y1 = y - 115;
    const n: MapNode = { x1, y1, color };
    const temp = [...mapNodes];
    temp[index] = n;
    setMapNodes(temp);
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
    setMapNodes([]);
    setMapEdges([]);
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
    for (let i = 0; i < mapNodes.length; i++) {
      if (
        x - 3 < mapNodes[i].x1 &&
        mapNodes[i].x1 < x + 3 &&
        y - 3 < mapNodes[i].y1 &&
        mapNodes[i].y1 < y + 3
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
