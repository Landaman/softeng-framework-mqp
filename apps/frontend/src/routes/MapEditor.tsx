import "./MapEditor.css";
import {
  useState,
  useRef,
  MutableRefObject,
  useLayoutEffect,
  useEffect,
} from "react";
import { MapNode, MapEdge } from "../MapComponents.ts";
import { Edge, Node } from "database";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

function createMapNode(x: number, y: number) {
  const x1 = x;
  const y1 = y;
  const node: Node = {
    building: "",
    floor: "",
    location: null,
    nodeID: "",
    xCoord: 0,
    yCoord: 0,
  };
  const n: MapNode = { x1, y1, node };
  return n;
}

function createMapEdge(i1: number, i2: number) {
  const index1 = i1;
  const index2 = i2;
  const edge: Edge = { edgeID: "", endNodeId: "", startNodeId: "" };
  const e: MapEdge = { index1, index2, edge };
  return e;
}

const distance = (
  a: { x1: number; y1: number },
  b: { x1: number; y1: number }
) => Math.sqrt(Math.pow(a.x1 - b.x1, 2) + Math.pow(a.y1 - b.y1, 2));
function MapEditor() {
  const [mapNodes, setMapNodes] = useState<Array<MapNode>>([]);
  const [mapEdges, setMapEdges] = useState<Array<MapEdge>>([]);
  const [nodeChecked, setNode] = useState(false);
  const [edgeChecked, setEdge] = useState(false);
  const [moveChecked, setMove] = useState(false);
  const [deleteChecked, setDelete] = useState(false);
  const [mode, setMode] = useState("");
  const [movingIndex, setMovingIndex] = useState(-1);
  const [hoverNode, setHoverNode] = useState(-1);
  const [selectedNode, setSelectedNode] = useState(-1);
  const [hoverEdge, setHoverEdge] = useState(-1);
  const [selectedEdge, setSelectedEdge] = useState(-1);
  const [dataNodes, setDataNodes] = useState<Array<Node>>([]);
  const [dataEdges, setDataEdges] = useState<Array<Edge>>([]);
  const { getAccessTokenSilently } = useAuth0();
  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);

  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>;
  const c = useRef() as MutableRefObject<CanvasRenderingContext2D>;

  useEffect(() => {
    const get = async () => {
      axios
        .get<Node[]>(`/api/node/${""}`, {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        })
        .then((response) => {
          setDataNodes(response.data as Array<Node>);
        });

      axios
        .get<Edge[]>(`/api/edge/${""}`, {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        })
        .then((response) => {
          setDataEdges(response.data as Array<Edge>);
        });
    };
    get();
  }, [getAccessTokenSilently]);

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
    canvas.setAttribute("height", String(canvasY));
    canvas.setAttribute("width", String(canvasX));

    context.imageSmoothingEnabled = false;

    // draw edges
    for (let i = 0; i < mapEdges.length; i++) {
      if (i === hoverEdge || i === selectedEdge) {
        context.strokeStyle = "#00FF00";
      }
      context.beginPath();
      const edge = mapEdges[i];
      context.moveTo(
        mapNodes[edge.index1].x1 + 3,
        mapNodes[edge.index1].y1 + 3
      );
      context.lineTo(
        mapNodes[edge.index2].x1 + 3,
        mapNodes[edge.index2].y1 + 3
      );
      context.stroke();
      context.strokeStyle = "black";
    }

    // draw nodes
    for (let i = 0; i < mapNodes.length; i++) {
      const n = mapNodes[i];
      if (i === selectedNode || i === hoverNode) {
        context.fillStyle = "#00FF00";
        context.fillRect(n.x1, n.y1, 6, 6);
        context.fillStyle = "black";
      } else {
        context.fillRect(n.x1, n.y1, 6, 6);
      }
    }

    c.current = context;
  }, [
    canvasX,
    canvasY,
    hoverEdge,
    hoverNode,
    mapEdges,
    mapNodes,
    selectedEdge,
    selectedNode,
  ]);

  function buildMap(floor: string) {
    clearCanvas();
    const tempNodes: Array<MapNode> = [];
    for (let i = 0; i < dataNodes.length; i++) {
      const node: Node = dataNodes[i];
      if (node.floor === floor) {
        const x1: number = node.xCoord * (canvasX / 5000) - 3;
        const y1: number = node.yCoord * (canvasY / 3400) - 3;
        const mn: MapNode = { x1, y1, node };
        tempNodes.push(mn);
      }
    }
    setMapNodes(tempNodes);

    const tempEdges: Array<MapEdge> = [];
    for (let i = 0; i < dataEdges.length; i++) {
      const edge: Edge = dataEdges[i];
      if (
        edge.endNodeId.slice(0, floor.length) === floor &&
        edge.startNodeId.slice(0, floor.length) === floor
      ) {
        const index1: number = getMapNodeIntex(edge.startNodeId, tempNodes);
        const index2: number = getMapNodeIntex(edge.endNodeId, tempNodes);
        const me: MapEdge = { index1, index2, edge };
        tempEdges.push(me);
      }
    }
    setMapEdges(tempEdges);
  }

  function getMapNodeIntex(nodeID: string, nodes: Array<MapNode>): number {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].node.nodeID === nodeID) {
        return i;
      }
    }
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (mode === "Node") {
      setMapNodes((prevState) => [
        ...prevState,
        createMapNode(clientX - 514, clientY - 115),
      ]);
    } else if (mode === "Move") {
      setMovingIndex(findNode(clientX, clientY));
    } else if (mode === "Edge") {
      if (selectedNode === -1) {
        setSelectedNode(findNode(clientX, clientY));
      } else {
        const temp = findNode(clientX, clientY);
        if (temp != -1) {
          setMapEdges((prevState) => [
            ...prevState,
            createMapEdge(selectedNode, temp),
          ]);
          setSelectedNode(-1);
        }
      }
    } else if (mode === "Delete") {
      if (selectedNode != -1) {
        const temp = findNode(clientX, clientY);
        if (temp === selectedNode) {
          deleteNode(temp);
        } else {
          setSelectedNode(temp);
          if (temp === -1) {
            setSelectedEdge(findEdge(clientX, clientY));
          }
        }
      } else if (selectedEdge != -1) {
        const temp = findEdge(clientX, clientY);
        if (temp === selectedEdge) {
          deleteEdge(temp);
        } else {
          setSelectedNode(findNode(clientX, clientY));
          if (selectedNode != -1) {
            setSelectedEdge(-1);
          } else {
            setSelectedEdge(temp);
          }
        }
      } else {
        let temp = findNode(clientX, clientY);
        setSelectedNode(temp);
        if (selectedNode != -1) {
          setSelectedEdge(-1);
        } else {
          setSelectedEdge(findEdge(clientX, clientY));
        }
      }
    }
  };

  const handleMouseUp = () => {
    setMovingIndex(-1);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    if (movingIndex != -1) {
      updateNode(movingIndex, clientX, clientY);
    } else {
      setHoverNode(findNode(clientX, clientY));
      if (hoverNode === -1) {
        setHoverEdge(findEdge(clientX, clientY));
      } else {
        setHoverEdge(-1);
      }
    }
  };

  function updateNode(index: number, x: number, y: number) {
    const x1 = x - 514;
    const y1 = y - 115;
    const n: MapNode = mapNodes[index];
    n.x1 = x1;
    n.y1 = y1;
    const temp = [...mapNodes];
    temp[index] = n;
    setMapNodes(temp);
  }

  function deleteNode(index: number) {
    const tempNodes = [];
    for (let i = 0; i < mapNodes.length; i++) {
      if (i != index) {
        tempNodes.push(mapNodes[i]);
      }
    }
    setMapNodes(tempNodes);

    const tempEdges = [];
    for (let i = 0; i < mapEdges.length; i++) {
      const e = mapEdges[i];
      if (!(e.index1 === index || e.index2 === index)) {
        if (e.index1 > index) {
          e.index1 -= 1;
        }
        if (e.index2 > index) {
          e.index2 -= 1;
        }
        tempEdges.push(e);
      }
    }
    setMapEdges(tempEdges);
    setSelectedNode(-1);
    setHoverNode(-1);
  }

  function deleteEdge(index: number) {
    const tempEdges = [];
    for (let i = 0; i < mapEdges.length; i++) {
      if (i != index) {
        tempEdges.push(mapEdges[i]);
      }
    }
    setMapEdges(tempEdges);
    setSelectedEdge(-1);
  }

  const [floor, setfloor] = useState("mapEditorCanvas L1");
  function groundFloor() {
    setfloor("mapEditorCanvas ground");
    clearCanvas();
  }
  function FloorL1() {
    setfloor("mapEditorCanvas L1");
    buildMap("L1");
  }
  function FloorL2() {
    setfloor("mapEditorCanvas L2");
    buildMap("L2");
  }
  function Floor1() {
    setfloor("mapEditorCanvas one");
    buildMap("1");
  }
  function Floor2() {
    setfloor("mapEditorCanvas two");
    buildMap("2");
  }
  function Floor3() {
    setfloor("mapEditorCanvas three");
    buildMap("3");
  }
  function clearCanvas() {
    setMapNodes([]);
    setMapEdges([]);
    setSelectedNode(-1);
  }

  function handleNode() {
    setNode(true);
    setEdge(false);
    setMove(false);
    setDelete(false);
    setMode("Node");
    setSelectedNode(-1);
  }

  function handleEdge() {
    setNode(false);
    setEdge(true);
    setMove(false);
    setDelete(false);
    setMode("Edge");
    setSelectedNode(-1);
  }

  function handleMove() {
    setNode(false);
    setEdge(false);
    setMove(true);
    setDelete(false);
    setMode("Move");
    setSelectedNode(-1);
  }

  function handleDelete() {
    setNode(false);
    setEdge(false);
    setMove(false);
    setDelete(true);
    setMode("Delete");
    setSelectedNode(-1);
  }

  function findNode(x: number, y: number) {
    const adjX = x - 514;
    const adjY = y - 115;
    for (let i = 0; i < mapNodes.length; i++) {
      if (
        adjX - 6 < mapNodes[i].x1 &&
        mapNodes[i].x1 < adjX + 6 &&
        adjY - 6 < mapNodes[i].y1 &&
        mapNodes[i].y1 < adjY + 6
      ) {
        return i;
      }
    }
    return -1;
  }

  function findEdge(x: number, y: number) {
    const x1 = x - 514;
    const y1 = y - 115;
    for (let i = 0; i < mapEdges.length; i++) {
      const n1 = mapNodes[mapEdges[i].index1];
      const n2 = mapNodes[mapEdges[i].index2];

      if (
        1 >
        distance(n1, { x1, y1 }) + distance(n2, { x1, y1 }) - distance(n1, n2)
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
        <div className={"modesDiv"}>
          <label className="selection-label">Mode</label>
          <div className="mode-container" onClick={handleNode}>
            <input
              className="checkbox"
              type="checkbox"
              checked={nodeChecked}
              onChange={handleNode}
            ></input>
            <label>Add Node</label>
          </div>
          <div className="mode-container" onClick={handleEdge}>
            <input
              className="checkbox"
              type="checkbox"
              checked={edgeChecked}
              onChange={handleEdge}
            ></input>
            <label>Add Edge</label>
          </div>
          <div className="mode-container" onClick={handleMove}>
            <input
              className="checkbox"
              type="checkbox"
              checked={moveChecked}
              onChange={handleMove}
            ></input>
            <label>Move Nodes</label>
          </div>
          <div className="mode-container" onClick={handleDelete}>
            <input
              className="checkbox"
              type="checkbox"
              checked={deleteChecked}
              onChange={handleDelete}
            ></input>
            <label>Delete</label>
          </div>
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
