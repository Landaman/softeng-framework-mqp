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

function createMapNode(x: number, y: number) {
  const x1 = x;
  const y1 = y;
  const node: Node = {
    id: 0,
    building: "",
    floor: Floor.L1,
    xCoord: 0,
    yCoord: 0,
    locationName: null,
  };
  const n: MapNode = { x1, y1, node, fromDatabase: false, deleted: false };
  return n;
}

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
    },
    endNode: {
      id: 0,
      building: "",
      floor: Floor.L1,
      xCoord: 0,
      yCoord: 0,
      locationName: null,
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
      const nodeDao = new NodeDao();
      setDataNodes(await nodeDao.getAll(await getAccessTokenSilently()));

      const edgeDao = new EdgeDao();
      setDataEdges(await edgeDao.getAll(await getAccessTokenSilently()));
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
        const index1: number = getMapNodeIntex(edge.startNode.id, tempNodes);
        const index2: number = getMapNodeIntex(edge.endNode.id, tempNodes);
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

  function getMapNodeIntex(nodeID: number, nodes: Array<MapNode>): number {
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

  const [floor, setfloor] = useState<Floor>(Floor.L1);
  function FloorL1() {
    setfloor(Floor.L1);
    buildMap(Floor.L1);
  }
  function FloorL2() {
    setfloor(Floor.L2);
    buildMap(Floor.L2);
  }
  function Floor1() {
    setfloor(Floor.ONE);
    buildMap(Floor.ONE);
  }
  function Floor2() {
    setfloor(Floor.TWO);
    buildMap(Floor.TWO);
  }
  function Floor3() {
    setfloor(Floor.THREE);
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
          floor: floor,
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
