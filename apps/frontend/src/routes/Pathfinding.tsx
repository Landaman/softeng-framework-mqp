import "./Pathfinding.css";
import {
  useLayoutEffect,
  useState,
  useRef,
  MutableRefObject,
  useEffect,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import EdgeDao, { Edge } from "../database/edge-dao.ts";
import NodeDao, { Node } from "../database/node-dao.ts";
import { MapEdge, MapNode } from "../MapComponents.ts";

function Pathfinding() {
  const [dataNodes, setDataNodes] = useState<Array<Node>>([]);
  const [dataEdges, setDataEdges] = useState<Array<Edge>>([]);
  const [displayMode, setDisplayMode] = useState<string>("Map");
  const [mapNodes, setMapNodes] = useState<Array<MapNode>>([]);
  const [mapEdges, setMapEdges] = useState<Array<MapEdge>>([]);
  const [hoverNode, setHoverNode] = useState(-1);
  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [originalX, setOriginalX] = useState(0);
  const [originalY, setOriginalY] = useState(0);
  const [scale, setScale] = useState(1);
  const [mapMode, setMapMode] = useState("Pan");
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");
  // const [neighbors, setNeighbors] = useState<Array<Edge>>([]);
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

    if (displayMode === "Path") {
      let oldX = 0;
      let oldY = 0;
      if (dataNodes.length > 0) {
        context.fillRect(
          dataNodes[0].xCoord - 3,
          dataNodes[0].yCoord - 3,
          6,
          6
        );
        oldX = dataNodes[0].xCoord - 3;
        oldY = dataNodes[0].yCoord - 3;
      }
      context.beginPath();
      for (let i = 1; i < dataNodes.length; i++) {
        const n = dataNodes[i];
        const scaleX = n.xCoord - 3;
        const scaleY = n.yCoord - 3;
        context.moveTo(oldX, oldY);
        context.fillRect(scaleX, scaleY, 6, 6);
        context.lineTo(scaleX, scaleY);
        oldX = scaleX;
        oldY = scaleY;
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
        } else if (n.node.nodeID === startNode) {
          context.fillStyle = "#0000FF";
          context.fillRect(n.x1 - 10, n.y1 - 10, 20, 20);
          context.fillStyle = "black";
        } else if (n.node.nodeID === endNode) {
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

  // function euclideanDistance(node1: Node, node2: Node) {
  //   const dx = node1.xCoord - node2.xCoord;
  //   const dy = node1.yCoord - node2.yCoord;
  //   return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  // }

  // function getNeighbors(node: Node) {
  //   axios
  //     .get<Edge[]>(`/api/edge/${node.nodeID}`)
  //     .then(
  //       (response) => {
  //         setNeighbors(response.data);
  //         console.info(`Successfully fetched edges: ${response}`);
  //       },
  //       () => {
  //         console.log("fetch failed");
  //       }
  //     )
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  // function findPath(start: Node, end: Node, accessible: boolean) {
  //   if (start.nodeID == null || end.nodeID == null) return;
  //
  //   const openList: Node[] = [start]; // TODO: REALISTICALLY NEEDS TO BE EDGES SINCE NO WRAPPER
  //   const closedList: Node[] = [];
  //
  //   // const NodeWrapper = {node:start, parent:null, g:0, h:0, f:0}
  //
  //   NODE_CHECK: while (openList.length != 0) {
  //     // while open list is not empty
  //     let closed;
  //     const q: Node = openList[0]; // get node with the lowest estimated cost //TODO: NEEDS TO REMOVE FROM LIST
  //
  //     for (closed of closedList) {
  //       if (closed == q) {
  //         continue NODE_CHECK;
  //       }
  //     }
  //
  //     if (q == end) {
  //       // if the current node is the goal
  //       const path: Node[] = []; // create list of nodes to represent the path
  //       path[path.length] = q; // add the end node
  //       return path; // path is backwards xd
  //     }
  //
  //     let edge;
  //     const nodeNeighbors: Node[] = [];
  //     for (edge of neighbors) {
  //       if (edge.endNodeId == q.nodeID) {
  //         nodeNeighbors[nodeNeighbors.length] = edge.startNode; //TODO: ???????
  //       } else {
  //         nodeNeighbors[nodeNeighbors.length] = edge.endNode; //TODO: ???????
  //       }
  //     }
  //
  //     let node;
  //     NODE_LOOP: for (node of nodeNeighbors) {
  //       // get the neighbors of the current node
  //       // PathFinder.NodeWrapper child =
  //       //     new PathFinder.NodeWrapper(node, q); // todo: create node wrapper out of current node
  //       if (q.floor != node.floor) {
  //         const loc: locationName = node.locationName; //TODO: ???????
  //         if (loc.locationType == "ELEV") {
  //           child.g = q.g + 50; // cost for elevator //TODO: WRAPPER FOR COST
  //         } else if (loc.locationType == "STAI") {
  //           if (accessible) continue;
  //           child.g = q.g + 100; // cost for stairs //TODO: WRAPPER FOR COST
  //         }
  //       } else {
  //         child.g = q.g + euclideanDistance(node, q); // calculate distance from start //TODO: WRAPPER FOR COST
  //       }
  //
  //       child.h = euclideanDistance(child.node, end); // calculate the lowest possible distance to end //TODO: COST!!!!!
  //       child.f = child.g + child.h;
  //
  //       let openNode;
  //       for (openNode of openList) {
  //         // check if node is on open list with a lower cost
  //         if (openNode == node && open.f < child.f) {
  //           //TODO: COST!!!!!
  //           continue NODE_LOOP;
  //         }
  //       }
  //
  //       let closedNode;
  //       for (closedNode of closedList) {
  //         // check is node is on closed list with lower cost
  //         if (closedNode == node) {
  //           if (closed.f < child.f) {
  //             //TODO: COST!!!!!
  //             continue NODE_LOOP;
  //           }
  //         }
  //       }
  //       openList.add(child); //todo: INSERT IN ORDER
  //     }
  //     closedList.add(q); //todo: INSERT IN ORDER
  //   }
  //   return null;
  // }

  function drawPath() {
    setDataEdges(dataEdges);
  }

  function buildMap(floor: string) {
    clearCanvas();
    const tempNodes: Array<MapNode> = [];
    for (let i = 0; i < dataNodes.length; i++) {
      const node: Node = dataNodes[i];
      if (node.floor === floor) {
        const x1: number = node.xCoord - 3;
        const y1: number = node.yCoord - 3;
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
        const index1: number = getMapNodeIndex(edge.startNodeId, tempNodes);
        const index2: number = getMapNodeIndex(edge.endNodeId, tempNodes);
        const me: MapEdge = { index1, index2, edge };
        tempEdges.push(me);
      }
    }
    setMapEdges(tempEdges);
  }

  function getMapNodeIndex(nodeID: string, nodes: Array<MapNode>): number {
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
    if (mapMode === "Pan") {
      setOriginalX(clientX - translateX);
      setOriginalY(clientY - translateY);
    } else if (mapMode === "Start") {
      const i = findNode(clientX, clientY);
      if (i >= 0) {
        setStartNode(mapNodes[i].node.nodeID);
        setMapMode("Pan");
      }
    } else {
      const i = findNode(clientX, clientY);
      if (i >= 0) {
        setEndNode(mapNodes[i].node.nodeID);
        setMapMode("Pan");
      }
    }
  };

  const handleMouseUp = () => {
    setOriginalX(0);
    setOriginalY(0);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setHoverNode(findNode(clientX, clientY));
    if (originalX != 0) {
      setTranslateX(clientX - originalX);
      setTranslateY(clientY - originalY);
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
      (((x - 510 - translateX) * 5000) / canvasX - 2500) / scale + 2500;
    const adjY =
      (((y - 110 - translateY) * 3400) / canvasY - 1700) / scale + 1700;
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
    setDisplayMode("Map");
    buildMap("L1");
  }
  function FloorL2() {
    setfloor("pathfindingCanvas L2");
    setDisplayMode("Map");
    buildMap("L2");
  }
  function Floor1() {
    setfloor("pathfindingCanvas one");
    setDisplayMode("Map");
    buildMap("1");
  }
  function Floor2() {
    setfloor("pathfindingCanvas two");
    setDisplayMode("Map");
    buildMap("2");
  }
  function Floor3() {
    setfloor("pathfindingCanvas three");
    setDisplayMode("Map");
    buildMap("3");
  }
  function clearCanvas() {
    setMapNodes([]);
    setMapEdges([]);
  }

  const selectStartNode = () => {
    setMapMode("Start");
  };

  const selectEndNode = () => {
    setMapMode("End");
  };

  return (
    <div className={"Pathfinding"}>
      <div className={"pathfinding-inputs"}>
        <h1>Get Directions</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button onClick={selectStartNode}>start Node</button>
          <p>{startNode}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button onClick={selectEndNode}>end Node</button>
          <p>{endNode}</p>
        </div>
        <button onClick={drawPath} className={"pathfindingButton"}>
          Submit
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
