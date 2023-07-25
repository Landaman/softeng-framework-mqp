import "./Pathfinding.css";
import {
  useLayoutEffect,
  useState,
  useRef,
  MutableRefObject,
  useEffect,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { MapEdge, MapNode } from "../MapComponents.ts";
import EdgeDao, { Edge } from "../database/edge-dao.ts";
import NodeDao, { Node } from "../database/node-dao.ts";

function Pathfinding() {
  const [dataNodes, setDataNodes] = useState<Array<Node>>([]);
  const [dataEdges, setDataEdges] = useState<Array<Edge>>([]);
  const [displayMode, setDisplayMode] = useState<string>("Find Path");
  const [mapNodes, setMapNodes] = useState<Array<MapNode>>([]);
  const [mapEdges, setMapEdges] = useState<Array<MapEdge>>([]);
  const [hoverNode, setHoverNode] = useState(-1);
  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [origionalX, setOrigionalX] = useState(0);
  const [origionalY, setOrigionalY] = useState(0);
  const [scale, setScale] = useState(1);
  const [mapMode, setMapMode] = useState("Pan");
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(0);
  const [startButton, setStartButton] = useState("nodeSelectorButton");
  const [endButton, setEndButton] = useState("nodeSelectorButton");
  const [pathNodes, setPathNodes] = useState<Array<Node>>([]);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const get = async () => {
      const nodeDao = new NodeDao();

      setDataNodes(await nodeDao.getAll(await getAccessTokenSilently()));

      const edgeDao = new EdgeDao();

      setDataEdges(await edgeDao.getAll(await getAccessTokenSilently()));
    };
    get();
  }, [getAccessTokenSilently]);

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
    setCanvasY(style_height * dpi);
    setCanvasX(style_width * dpi);
    canvas.setAttribute("height", String(3400));
    canvas.setAttribute("width", String(5000));

    context.imageSmoothingEnabled = false;
    context.lineWidth = 4;

    if (displayMode === "Select a New Path") {
      let oldX = 0;
      let oldY = 0;
      if (mapNodes.length > 0) {
        context.fillRect(mapNodes[0].x1 - 10, mapNodes[0].y1 - 10, 20, 20);
        oldX = mapNodes[0].x1;
        oldY = mapNodes[0].y1;
      }
      context.beginPath();
      for (let i = 1; i < mapNodes.length; i++) {
        const n = mapNodes[i];
        const scaleX = n.x1 - 10;
        const scaleY = n.y1 - 10;
        context.moveTo(oldX, oldY);
        context.fillRect(scaleX, scaleY, 20, 20);
        context.lineTo(n.x1, n.y1);
        oldX = n.x1;
        oldY = n.y1;
      }
      context.stroke();
    } else {
      // draw edges
      for (let i = 0; i < mapEdges.length; i++) {
        context.beginPath();
        const edge = mapEdges[i];
        context.moveTo(mapNodes[edge.index1].x1, mapNodes[edge.index1].y1);
        context.lineTo(mapNodes[edge.index2].x1, mapNodes[edge.index2].y1);
        context.stroke();
        context.strokeStyle = "black";
      }

      // draw nodes
      for (let i = 0; i < mapNodes.length; i++) {
        const n = mapNodes[i];
        if (i === hoverNode) {
          context.fillStyle = "#00FF00";
          context.fillRect(n.x1 - 10, n.y1 - 10, 20, 20);
          context.fillStyle = "black";
        } else if (n.node.id === startNode) {
          context.fillStyle = "#0000FF";
          context.fillRect(n.x1 - 10, n.y1 - 10, 20, 20);
          context.fillStyle = "black";
        } else if (n.node.id === endNode) {
          context.fillStyle = "#FF0000";
          context.fillRect(n.x1 - 10, n.y1 - 10, 20, 20);
          context.fillStyle = "black";
        } else {
          context.fillRect(n.x1 - 10, n.y1 - 10, 20, 20);
        }
      }
    }
    c.current = context;
  }, [
    displayMode,
    dataNodes,
    mapEdges,
    mapNodes,
    hoverNode,
    startNode,
    endNode,
  ]);

  function Submit() {
    if (displayMode === "Find Path") {
      setDisplayMode("Select a New Path");

      // set pathNodes to the pathfinding result use startNode and endNode
      setPathNodes([
        dataNodes[572],
        dataNodes[575],
        dataNodes[555],
        dataNodes[347],
        dataNodes[360],
      ]);

      if (pathNodes[0].floor === "L1") {
        FloorL1();
        buildMap("L1", "Select a New Path");
      } else if (pathNodes[0].floor === "L2") {
        FloorL2();
        buildMap("L2", "Select a New Path");
      } else if (pathNodes[0].floor === "ONE") {
        Floor1();
        buildMap("ONE", "Select a New Path");
      } else if (pathNodes[0].floor === "TWO") {
        Floor2();
        buildMap("TWO", "Select a New Path");
      } else if (pathNodes[0].floor === "THREE") {
        Floor3();
        buildMap("THREE", "Select a New Path");
      }
    } else {
      setDisplayMode("Find Path");
      FloorL1();
      buildMap("L1", "Find Path");
      setStartNode(0);
      setEndNode(0);
    }
  }

  function buildMap(floor: string, m: string) {
    clearCanvas();
    if (m === "Find Path") {
      const tempNodes: Array<MapNode> = [];
      for (let i = 0; i < dataNodes.length; i++) {
        const node: Node = dataNodes[i];
        if (node.floor === floor) {
          const x1: number = node.xCoord - 3;
          const y1: number = node.yCoord - 3;
          const fromDatabase = true;
          const deleted = false;
          const mn: MapNode = { x1, y1, node, fromDatabase, deleted };
          tempNodes.push(mn);
        }
      }
      setMapNodes(tempNodes);

      const tempEdges: Array<MapEdge> = [];
      for (let i = 0; i < dataEdges.length; i++) {
        const edge: Edge = dataEdges[i];
        if (edge.endNode.floor === floor && edge.startNode.floor === floor) {
          const index1: number = getMapNodeIndex(edge.startNode.id, tempNodes);
          const index2: number = getMapNodeIndex(edge.endNode.id, tempNodes);
          const fromDatabase = true;
          const deleted = false;
          const me: MapEdge = { index1, index2, edge, fromDatabase, deleted };
          tempEdges.push(me);
        }
      }
      setMapEdges(tempEdges);
    } else {
      const tempNodes: Array<MapNode> = [];
      for (let i = 0; i < pathNodes.length; i++) {
        const node: Node = pathNodes[i];
        if (node.floor === floor) {
          const x1: number = node.xCoord - 3;
          const y1: number = node.yCoord - 3;
          const fromDatabase = true;
          const deleted = false;
          const mn: MapNode = { x1, y1, node, fromDatabase, deleted };
          tempNodes.push(mn);
        }
      }
      setMapNodes(tempNodes);
    }
  }

  function getMapNodeIndex(nodeID: number, nodes: Array<MapNode>): number {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].node.id === nodeID) {
        return i;
      }
    }
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    if (mapMode === "Pan") {
      setOrigionalX(clientX - translateX);
      setOrigionalY(clientY - translateY);
    } else if (mapMode === "Start") {
      const i = findNode(clientX, clientY);
      if (i >= 0) {
        setStartNode(mapNodes[i].node.id);
        setMapMode("Pan");
        setStartButton("nodeSelectorButton");
      }
    } else {
      const i = findNode(clientX, clientY);
      if (i >= 0) {
        setEndNode(mapNodes[i].node.id);
        setEndButton("nodeSelectorButton");
        setMapMode("Pan");
      }
    }
  };

  const handleMouseUp = () => {
    setOrigionalX(0);
    setOrigionalY(0);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setHoverNode(findNode(clientX, clientY));
    if (origionalX != 0) {
      setTranslateX(clientX - origionalX);
      setTranslateY(clientY - origionalY);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleWheel = (event) => {
    if (event.deltaY > 0) {
      setScale(scale / 1.1);
    } else {
      setScale(scale * 1.1);
    }
  };

  function findNode(x: number, y: number) {
    const adjX =
      (((x - 512 - translateX) * 5000) / canvasX - 2500) / scale + 2500;
    const adjY =
      (((y - 114 - translateY) * 3400) / canvasY - 1700) / scale + 1700;
    for (let i = 0; i < mapNodes.length; i++) {
      if (
        adjX - 12 < mapNodes[i].x1 &&
        mapNodes[i].x1 < adjX + 12 &&
        adjY - 12 < mapNodes[i].y1 &&
        mapNodes[i].y1 < adjY + 12
      ) {
        return i;
      }
    }
    return -1;
  }

  const [floor, setfloor] = useState("pathfindingCanvas L1");
  function groundFloor() {
    setfloor("pathfindingCanvas ground");
    clearCanvas();
  }
  function FloorL1() {
    setfloor("pathfindingCanvas L1");
    buildMap("L1", displayMode);
  }
  function FloorL2() {
    setfloor("pathfindingCanvas L2");
    buildMap("L2", displayMode);
  }
  function Floor1() {
    setfloor("pathfindingCanvas one");
    buildMap("ONE", displayMode);
  }
  function Floor2() {
    setfloor("pathfindingCanvas two");
    buildMap("TWO", displayMode);
  }
  function Floor3() {
    setfloor("pathfindingCanvas three");
    buildMap("THREE", displayMode);
  }
  function clearCanvas() {
    setMapNodes([]);
    setMapEdges([]);
  }

  const selectStartNode = () => {
    if (mapMode != "Start") {
      setMapMode("Start");
      setStartButton("nodeSelectorButtonSelected");
      setEndButton("nodeSelectorButton");
    } else {
      setMapMode("Pan");
      setStartButton("nodeSelectorButton");
    }
  };

  const selectEndNode = () => {
    if (mapMode != "End") {
      setMapMode("End");
      setStartButton("nodeSelectorButton");
      setEndButton("nodeSelectorButtonSelected");
    } else {
      setMapMode("Pan");
      setEndButton("nodeSelectorButton");
    }
  };

  return (
    <div className={"Pathfinding"}>
      <div className={"pathfinding-inputs"}>
        <h1 style={{ marginBottom: "32px" }}>Get Directions</h1>
        <div className={"nodeSelectorDiv"}>
          <button className={startButton} onClick={selectStartNode}>
            start Node
          </button>
          <p>{startNode}</p>
        </div>
        <div className={"nodeSelectorDiv"}>
          <button className={endButton} onClick={selectEndNode}>
            end Node
          </button>
          <p>{endNode}</p>
        </div>
        <button onClick={Submit} className={"pathfindingButton"}>
          {displayMode}
        </button>
      </div>
      <div className={"mapdiv"}>
        <div
          style={{
            overflow: "hidden",
            display: "flex",
            flexGrow: "1",
            width: "100%",
            height: "100px",
          }}
        >
          <div
            style={{
              transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
              display: "flex",
            }}
          >
            <canvas
              className={floor}
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
            ></canvas>
          </div>
        </div>
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
