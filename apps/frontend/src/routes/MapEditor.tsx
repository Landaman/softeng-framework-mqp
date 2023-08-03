import "./MapEditor.css";
import {
  useState,
  useRef,
  MutableRefObject,
  useLayoutEffect,
  useEffect,
  MouseEvent,
} from "react";
import { MapNode, MapEdge } from "../MapComponents.ts";
import { useAuth0 } from "@auth0/auth0-react";
import NodeDao, { Floor, Node } from "../database/node-dao.ts";
import EdgeDao, { Edge } from "../database/edge-dao.ts";
import { round } from "@popperjs/core/lib/utils/math";

function createMapEdge(i1: number, i2: number) {
  const index1 = i1;
  const index2 = i2;
  const edge: Edge = {
    id: 0,
    startNode: {
      id: 0,
      building: "",
      floor: Floor.L1,
      xCoord: 0,
      yCoord: 0,
      locationName: null,
      startEdges: [],
      endEdges: [],
    },
    endNode: {
      id: 0,
      building: "",
      floor: Floor.L1,
      xCoord: 0,
      yCoord: 0,
      locationName: null,
      startEdges: [],
      endEdges: [],
    },
  };
  const e: MapEdge = {
    index1,
    index2,
    edge,
    fromDatabase: false,
    deleted: false,
  };
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
  const [panChecked, setPan] = useState(true);
  const [mode, setMode] = useState("Pan");
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
  const [mapFloor, setMapFloor] = useState(Floor.L1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [origionalX, setOrigionalX] = useState(0);
  const [origionalY, setOrigionalY] = useState(0);
  const [scale, setScale] = useState(1);

  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>;
  const c = useRef() as MutableRefObject<CanvasRenderingContext2D>;

  useEffect(() => {
    const get = async () => {
      const nodeDao = new NodeDao();
      const nodes: Node[] = await nodeDao.getAll(
        await getAccessTokenSilently()
      );
      setDataNodes(nodes);

      const edgeDao = new EdgeDao();
      const edges: Edge[] = await edgeDao.getAll(
        await getAccessTokenSilently()
      );
      setDataEdges(edges);

      const tempNodes: Array<MapNode> = [];
      for (let i = 0; i < nodes.length; i++) {
        const node: Node = nodes[i];
        if (node.floor === "L1") {
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
      for (let i = 0; i < edges.length; i++) {
        const edge: Edge = edges[i];
        if (edge.endNode.floor === "L1" && edge.startNode.floor === "L1") {
          const index1: number = getMapNodeIndex(edge.startNode.id, tempNodes);
          const index2: number = getMapNodeIndex(edge.endNode.id, tempNodes);
          const fromDatabase = true;
          const deleted = false;
          const me: MapEdge = { index1, index2, edge, fromDatabase, deleted };
          tempEdges.push(me);
        }
      }
      setMapEdges(tempEdges);
    };

    get();
  }, [getAccessTokenSilently]);

  useLayoutEffect(() => {
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
    setCanvasY(style_height);
    setCanvasX(style_width);
    canvas.setAttribute("height", String(3400));
    canvas.setAttribute("width", String(5000));

    context.imageSmoothingEnabled = false;

    // draw edges
    context.lineWidth = 4;
    for (let i = 0; i < mapEdges.length; i++) {
      const edge = mapEdges[i];
      if (!edge.deleted) {
        if (i === hoverEdge || i === selectedEdge) {
          context.strokeStyle = "#00FF00";
        }
        context.beginPath();

        context.moveTo(mapNodes[edge.index1].x1, mapNodes[edge.index1].y1);
        context.lineTo(mapNodes[edge.index2].x1, mapNodes[edge.index2].y1);
        context.stroke();
        context.strokeStyle = "black";
      }
    }

    // draw nodes
    for (let i = 0; i < mapNodes.length; i++) {
      const n = mapNodes[i];
      if (!n.deleted) {
        if (i === selectedNode || i === hoverNode) {
          context.fillStyle = "#00FF00";
          context.fillRect(n.x1 - 10, n.y1 - 10, 20, 20);
          context.fillStyle = "black";
        } else {
          context.fillRect(n.x1 - 10, n.y1 - 10, 20, 20);
        }
      }
    }

    c.current = context;
  }, [hoverEdge, hoverNode, mapEdges, mapNodes, selectedEdge, selectedNode]);

  function buildMap(floor: string) {
    clearCanvas();
    const tempNodes: Array<MapNode> = [];
    for (let i = 0; i < dataNodes.length; i++) {
      const node: Node = dataNodes[i];
      if (node.floor === floor) {
        const x1: number = node.xCoord;
        const y1: number = node.yCoord;
        const mn: MapNode = {
          x1,
          y1,
          node,
          fromDatabase: true,
          deleted: false,
        };
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
        const me: MapEdge = {
          index1,
          index2,
          edge,
          fromDatabase: true,
          deleted: false,
        };
        tempEdges.push(me);
      }
    }
    setMapEdges(tempEdges);
  }

  function getMapNodeIndex(nodeID: number, nodes: Array<MapNode>): number {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].node.id === nodeID) {
        return i;
      }
    }
    return 0;
  }

  const handleMouseDown = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    if (mode === "Node") {
      setMapNodes((prevState) => [
        ...prevState,
        createMapNode(clientX, clientY),
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
    } else if (mode === "Pan") {
      setOrigionalX(clientX - translateX);
      setOrigionalY(clientY - translateY);
    }
  };

  const handleMouseUp = () => {
    setMovingIndex(-1);
    setOrigionalX(0);
    setOrigionalY(0);
  };

  const handleMouseMove = (event: MouseEvent) => {
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
      if (origionalX != 0) {
        const x = clientX - origionalX;
        const y = clientY - origionalY;
        adjMap(x, y, scale);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleWheel = (event) => {
    const { clientX, clientY } = event;
    const adjX = clientX - canvasX / 2 - 512;
    const adjY = clientY - canvasY / 2 - 114;

    if (event.deltaY > 0 && scale > 1) {
      const x = adjX - (adjX - translateX) / 1.1;
      const y = adjY - (adjY - translateY) / 1.1;
      const s = scale / 1.1;
      adjMap(x, y, s);
      setScale(s);
    } else if (scale < 5 && event.deltaY < 0) {
      const x = adjX - (adjX - translateX) * 1.1;
      const y = adjY - (adjY - translateY) * 1.1;
      const s = scale * 1.1;
      adjMap(x, y, s);
      setScale(s);
    }
  };

  function updateNode(index: number, x: number, y: number) {
    const x1 = round(
      (((x - 512 - translateX) * 5000) / canvasX - 2500) / scale + 2500
    );
    const y1 = round(
      (((y - 114 - translateY) * 3400) / canvasY - 1700) / scale + 1700
    );
    const n: MapNode = mapNodes[index];
    n.x1 = x1;
    n.y1 = y1;
    const temp = [...mapNodes];
    temp[index] = n;
    setMapNodes(temp);
  }

  function adjMap(x: number, y: number, s: number) {
    let correct = true;
    const highX = canvasX / -2 - (canvasX / -2) * s;
    const lowX = canvasX / 2 - (canvasX / 2) * s;
    const highY = canvasY / -2 - (canvasY / -2) * s;
    const lowY = canvasY / 2 - (canvasY / 2) * s;
    console.log(highX);
    console.log(x);
    if (highX < x) {
      console.log("HighX");
      setTranslateX(highX);
      correct = false;
    } else if (lowX > x) {
      console.log("LowX");
      setTranslateX(lowX);
      correct = false;
    } else {
      setTranslateX(x);
    }
    if (highY < y) {
      setTranslateY(highY);
      console.log("HighY");
      correct = false;
    } else if (lowY > y) {
      console.log("LowY");
      setTranslateY(lowY);
      correct = false;
    } else {
      setTranslateY(y);
    }

    return correct;
  }

  function createMapNode(x: number, y: number) {
    const x1 = round(
      (((x - 512 - translateX) * 5000) / canvasX - 2500) / scale + 2500
    );
    const y1 = round(
      (((y - 114 - translateY) * 3400) / canvasY - 1700) / scale + 1700
    );
    const node: Node = {
      id: 0,
      building: "",
      floor: Floor.L1,
      xCoord: 0,
      yCoord: 0,
      locationName: null,
      startEdges: [],
      endEdges: [],
    };
    const n: MapNode = { x1, y1, node, fromDatabase: false, deleted: false };
    return n;
  }

  function deleteNode(index: number) {
    // Mark the node for deletion
    mapNodes[index].deleted = true;

    for (let i = 0; i < mapEdges.length; i++) {
      const e = mapEdges[i];
      if (e.index1 === index || e.index2 === index) {
        e.deleted = true;
      }
    }
    setSelectedNode(-1);
    setHoverNode(-1);
  }

  function deleteEdge(index: number) {
    // Mark the edge as deleted
    mapEdges[index].deleted = true;

    setSelectedEdge(-1);
  }

  const [floor, setfloor] = useState("pathfindingCanvas L1");
  function FloorGround() {
    setfloor("pathfindingCanvas ground");
    clearCanvas();
  }

  function FloorL1() {
    setfloor("pathfindingCanvas L1");
    setMapFloor(Floor.L1);
    buildMap(Floor.L1);
  }
  function FloorL2() {
    setfloor("pathfindingCanvas L2");
    setMapFloor(Floor.L2);
    buildMap(Floor.L2);
  }
  function Floor1() {
    setfloor("pathfindingCanvas one");
    setMapFloor(Floor.ONE);
    buildMap(Floor.ONE);
  }
  function Floor2() {
    setfloor("pathfindingCanvas two");
    setMapFloor(Floor.TWO);
    buildMap(Floor.TWO);
  }
  function Floor3() {
    setfloor("pathfindingCanvas three");
    setMapFloor(Floor.THREE);
    buildMap(Floor.THREE);
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
    setPan(false);
    setMode("Node");
    setSelectedNode(-1);
  }

  function handleEdge() {
    setNode(false);
    setEdge(true);
    setMove(false);
    setDelete(false);
    setPan(false);
    setMode("Edge");
    setSelectedNode(-1);
  }

  function handleMove() {
    setNode(false);
    setEdge(false);
    setMove(true);
    setDelete(false);
    setPan(false);
    setMode("Move");
    setSelectedNode(-1);
  }

  function handleDelete() {
    setNode(false);
    setEdge(false);
    setMove(false);
    setDelete(true);
    setPan(false);
    setMode("Delete");
    setSelectedNode(-1);
  }

  function handlePan() {
    setNode(false);
    setEdge(false);
    setMove(false);
    setDelete(false);
    setPan(true);
    setMode("Pan");
    setSelectedNode(-1);
  }

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

  function findEdge(x: number, y: number) {
    const x1 =
      (((x - 512 - translateX) * 5000) / canvasX - 2500) / scale + 2500;
    const y1 =
      (((y - 114 - translateY) * 3400) / canvasY - 1700) / scale + 1700;
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

  /**
   * Command to submit changes on the map page, persisting all map nodes to the database
   */
  async function submitChanges() {
    // Create the DAO we'll use
    const nodeDao = new NodeDao();

    // For each of the map nodes, commit them to the DB
    for (const argument of mapNodes) {
      // If we got this from the database
      if (argument.fromDatabase) {
        // Determine what to do based on deletion status
        if (!argument.deleted) {
          // Just update the X and Y
          await nodeDao.update(await getAccessTokenSilently(), {
            id: argument.node.id,
            xCoord: argument.x1,
            yCoord: argument.y1,
          });
        } else {
          // Delete the node, since it's from the database
          await nodeDao.delete(
            await getAccessTokenSilently(),
            argument.node.id
          );
        }
      } else {
        // Otherwise, create this
        argument.node = await nodeDao.create(await getAccessTokenSilently(), {
          xCoord: argument.x1,
          yCoord: argument.y1,
          building: "",
          floor: mapFloor,
          locationName: null,
        });

        // Make sure we mark this as coming from the database now (since it is), so we don't create it again
        argument.fromDatabase = true;
      }
    }

    // Create the edge dao
    const edgeDao = new EdgeDao();

    // For each of the edges, commit them to the DB
    for (const argument of mapEdges) {
      // If the edge was from the database
      if (argument.fromDatabase) {
        // It can only change if it's deleted
        if (argument.deleted) {
          // If that's the case, delete it
          await edgeDao.delete(
            await getAccessTokenSilently(),
            argument.edge.id
          );
        }
      } else {
        // Update the edge to be the newly created one. We can safely use the IDs
        // of the nodes, since they were just persisted to the database
        argument.edge = await edgeDao.create(await getAccessTokenSilently(), {
          startNode: mapNodes[argument.index1].node.id,
          endNode: mapNodes[argument.index2].node.id,
        });

        // make sure we mark this as from the database (since it now is), so we don't create it again
        argument.fromDatabase = true;
      }
    }

    // Force a refresh, to redraw the map elements (some have been deleted)
    window.location.reload();
  }

  return (
    <div className={"Pathfinding"}>
      <div className={"pathfinding-inputs"}>
        <h1>Map Editor</h1>
        <div className={"modesDiv"}>
          <label className="selection-label">Mode</label>
          <div className="mode-container" onClick={handlePan}>
            <input
              className="checkbox"
              type="checkbox"
              checked={panChecked}
              onChange={handlePan}
            ></input>
            <label>Pan and Zoom</label>
          </div>
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
        <button onClick={FloorGround} className={"floorButton"}>
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
        <button onClick={submitChanges} className={"pathfindingButton"}>
          Submit changes
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
            outline: "#012d5a solid 3px",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            style={{
              transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
              display: "flex",
            }}
          >
            <canvas className={floor} ref={canvasRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapEditor;
