import "./Pathfinding.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  useLayoutEffect,
  useState,
  useRef,
  MutableRefObject,
  useEffect,
} from "react";
import { Edge, Node } from "database";
import axios from "axios";

function Pathfinding() {
  const [nodes, setNodes] = useState<Array<Node>>([]);
  const [edges, setEdges] = useState<Array<Edge>>([]);
  useEffect(() => {
    axios.get<Node[]>(`/api/node/${""}`).then((response) => {
      console.log(response.data);
      setNodes(response.data as Array<Node>);
    });
    axios.get<Edge[]>(`/api/node/${""}`).then((response) => {
      setEdges(response.data as Array<Edge>);
    });
  }, []);

  console.log(nodes.length);
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
      context.fillRect(nodes[0].xCoord - 3, nodes[0].yCoord - 3, 6, 6);
      oldX = nodes[0].xCoord;
      oldY = nodes[0].yCoord;
    }
    context.beginPath();
    for (let i = 1; i < nodes.length; i++) {
      const n = nodes[i];
      context.moveTo(oldX, oldY);
      context.fillRect(n.xCoord - 3, n.yCoord - 3, 6, 6);
      context.lineTo(n.xCoord, n.yCoord);
      oldX = n.xCoord;
      oldY = n.yCoord;
      console.log("i");
    }
    context.stroke();
    c.current = context;
  });

  function drawPath() {
    setEdges(edges);
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
    setNodes([]);
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
