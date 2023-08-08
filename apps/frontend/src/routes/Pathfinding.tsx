import "./Pathfinding.css";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import EdgeDao, { Edge } from "../database/edge-dao.ts";
import NodeDao, { Node } from "../database/node-dao.ts";
import { MapEdge, MapNode } from "../MapComponents.ts";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";

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
  const [originalX, setOriginalX] = useState(0);
  const [originalY, setOriginalY] = useState(0);
  const [scale, setScale] = useState(1);
  const [mapMode, setMapMode] = useState("Pan");
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(0);
  const [startButton, setStartButton] = useState("nodeSelectorButton");
  const [endButton, setEndButton] = useState("nodeSelectorButton");
  const [pathNodes, setPathNodes] = useState<Array<Node>>([]);
  const [pathBreaks, setPathBreaks] = useState<Array<number>>([]);
  const { getAccessTokenSilently } = useAuth0();
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

  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>;
  const c = useRef() as MutableRefObject<CanvasRenderingContext2D>;
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
    context.lineWidth = 4;

    if (displayMode === "Select a New Path") {
      let oldX = 0;
      let oldY = 0;
      const breaks = pathBreaks;
      let b = breaks.shift();

      for (let i = 0; i < mapNodes.length; i++) {
        const n = mapNodes[i];
        const scaleX = n.x1 - 10;
        const scaleY = n.y1 - 10;
        context.fillRect(scaleX, scaleY, 20, 20);
        if (i === b) {
          b = breaks.shift();
        } else {
          context.beginPath();
          context.moveTo(oldX, oldY);
          context.lineTo(n.x1, n.y1);
          context.stroke();
        }
        oldX = n.x1;
        oldY = n.y1;
      }
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
    pathBreaks,
  ]);

  function euclideanDistance(node1: Node, node2: Node) {
    const dx = node1.xCoord - node2.xCoord;
    const dy = node1.yCoord - node2.yCoord;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  }

  function removeNode(list: Node[], node: Node) {
    const copy: Node[] = [];
    let element;
    for (element of list) {
      if (element.id != node.id) copy.push(element);
    }
    return copy;
  }

  async function findPath(startID: number, endID: number): Promise<Node[]> {
    const nodeDao = new NodeDao();

    const nodeArray = await nodeDao.getAll(await getAccessTokenSilently());
    const indexedNodeArray: { [key: string]: Node } = {};

    let allNode;
    for (allNode of nodeArray) {
      indexedNodeArray[allNode.id] = allNode;
    }

    const start: Node = indexedNodeArray[startID];
    const end: Node = indexedNodeArray[endID];

    if (start === null || end === null) return [];
    if (start.id === null || end.id === null) return [];

    const indexedArrayG: { [key: string]: number } = {};
    const indexedArrayH: { [key: string]: number } = {};
    const indexedArrayF: { [key: string]: number } = {};
    const indexedArrayParent: { [key: string]: number } = {};

    let openList: Node[] = [start];
    let closedList: Node[] = [];

    NODE_CHECK: while (openList.length != 0) {
      // while open list is not empty
      let closed;
      let q: Node | null = openList[openList.length - 1];

      if (q.id === end.id) {
        // if the current node is the goal
        const path: Node[] = []; // create list of nodes to represent the path
        path[path.length] = q; // add the end node

        while (q.id != start.id) {
          const w = await nodeDao.get(
            await getAccessTokenSilently(),
            indexedArrayParent[q.id]
          );
          if (w != null) q = w;
          if (q != null) {
            path[path.length] = q;
          }
        }

        return path; // path is backwards xd
      }

      const deleteList: Node[] = [];
      for (let i = 0; i < openList.length - 1; i++) {
        // remove last element
        deleteList[i] = openList[i];
      }
      openList = deleteList;

      for (closed of closedList) {
        if (closed.id === q.id) {
          continue NODE_CHECK;
        }
      }

      let element;
      let inserted = false;
      const copyList: Node[] = [];
      for (element of closedList) {
        if (!inserted && indexedArrayF[element.id] <= indexedArrayF[q.id]) {
          copyList[copyList.length] = q;
          inserted = true;
        }
        copyList[copyList.length] = element;
      }
      if (!inserted) copyList[copyList.length] = q;
      closedList = copyList;

      const nodeNeighbors: number[] = [];
      const startEdges: Edge[] = q.startEdges;
      const endEdges: Edge[] = q.endEdges;

      let edge;
      for (edge of startEdges) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        nodeNeighbors[nodeNeighbors.length] = edge.endNodeId;
      }
      for (edge of endEdges) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        nodeNeighbors[nodeNeighbors.length] = edge.startNodeId;
      }

      let childID;
      NODE_LOOP: for (childID of nodeNeighbors) {
        const child: Node = indexedNodeArray[childID];

        if (child != null) {
          if (q.floor != child.floor) {
            const loc = child.locationName;
            if (loc != null) {
              if (loc.locationType == "ELEV") {
                if (indexedArrayG[q.id] != null) {
                  indexedArrayG[childID] = indexedArrayG[q.id] + 50;
                } else indexedArrayG[childID] = 50;
              } else if (loc.locationType == "STAI") {
                if (indexedArrayG[q.id] != null) {
                  indexedArrayG[childID] = indexedArrayG[q.id] + 100;
                } else indexedArrayG[childID] = 100;
              }
            } else indexedArrayG[childID] = 100; // no location name, assume stairs
          } else {
            if (indexedArrayG[q.id] != null) {
              indexedArrayG[childID] =
                indexedArrayG[q.id] + euclideanDistance(child, q);
            } else indexedArrayG[childID] = euclideanDistance(child, q);
          }

          indexedArrayH[childID] = euclideanDistance(child, end);

          let found = false;
          let openNode;
          for (openNode of openList) {
            // check if node is on open list with a lower cost
            if (openNode.id === child.id) {
              found = true;
              if (
                indexedArrayF[openNode.id] >
                indexedArrayG[childID] + indexedArrayH[childID]
              ) {
                openList = removeNode(openList, openNode);
                indexedArrayParent[childID] = q.id;
                indexedArrayF[childID] =
                  indexedArrayG[childID] + indexedArrayH[childID]; // calculate the lowest possible distance to end
                break;
              } else continue NODE_LOOP;
            }
          }

          let closedNode;
          for (closedNode of closedList) {
            // check is node is on closed list with lower cost
            if (closedNode.id === child.id) {
              found = true;
              if (
                indexedArrayF[closedNode.id] >
                indexedArrayG[childID] + indexedArrayH[childID]
              ) {
                openList = removeNode(openList, closedNode);
                indexedArrayParent[childID] = q.id;
                indexedArrayF[childID] =
                  indexedArrayG[childID] + indexedArrayH[childID]; // calculate the lowest possible distance to end
                break;
              } else continue NODE_LOOP;
            }
          }

          if (!found) {
            indexedArrayParent[childID] = q.id;
            indexedArrayF[childID] =
              indexedArrayG[childID] + indexedArrayH[childID]; // calculate the lowest possible distance to end
          }

          let element;
          let inserted = false;
          const copyList: Node[] = [];
          for (element of openList) {
            if (
              !inserted &&
              indexedArrayF[element.id] <= indexedArrayF[childID]
            ) {
              copyList[copyList.length] = child;
              inserted = true;
            }
            copyList[copyList.length] = element;
          }
          if (!inserted) copyList[copyList.length] = child;

          openList = copyList;
        }
      }
    }
    return [];
  }

  async function Submit() {
    if (displayMode === "Find Path") {
      // set pathNodes to the pathfinding result use startNode and endNode
      const temp = await findPath(startNode, endNode);
      setPathNodes(temp);

      // setPathNodes([
      //   dataNodes[572],
      //   dataNodes[575],
      //   dataNodes[555],
      //   dataNodes[347],
      //   dataNodes[360],
      // ]);

      if (temp[0].floor === "L1") {
        FloorL1();
        buildMap("L1", "Select a New Path", temp);
      } else if (temp[0].floor === "L2") {
        FloorL2();
        buildMap("L2", "Select a New Path", temp);
      } else if (temp[0].floor === "ONE") {
        Floor1();
        buildMap("ONE", "Select a New Path", temp);
      } else if (temp[0].floor === "TWO") {
        Floor2();
        buildMap("TWO", "Select a New Path", temp);
      } else if (temp[0].floor === "THREE") {
        Floor3();
        buildMap("THREE", "Select a New Path", temp);
      }
      setDisplayMode("Select a New Path");
    } else {
      setDisplayMode("Find Path");
      FloorL1();
      buildMap("L1", "Find Path", pathNodes);
      setStartNode(0);
      setEndNode(0);
      await setPathNodes([]);
    }
  }

  function buildMap(floor: string, m: string, nodes: Node[]) {
    console.log(startButton);
    console.log(endButton);
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
      const tempBreaks: Array<number> = [];
      let start = true;
      for (let i = 0; i < nodes.length; i++) {
        const node: Node = nodes[i];
        if (node.floor === floor) {
          if (start) {
            tempBreaks.push(tempNodes.length);
            start = false;
          }
          const x1: number = node.xCoord - 3;
          const y1: number = node.yCoord - 3;
          const fromDatabase = true;
          const deleted = false;
          const mn: MapNode = { x1, y1, node, fromDatabase, deleted };
          tempNodes.push(mn);
        } else {
          start = true;
        }
      }
      setPathBreaks(tempBreaks);
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
      setOriginalX(clientX - translateX);
      setOriginalY(clientY - translateY);
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
    setOriginalX(0);
    setOriginalY(0);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    if (displayMode === "Find Path") {
      setHoverNode(findNode(clientX, clientY));
    }
    if (originalX != 0) {
      const x = clientX - originalX;
      const y = clientY - originalY;
      adjMap(x, y, scale);
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
    buildMap("L1", displayMode, pathNodes);
  }

  function FloorL2() {
    setfloor("pathfindingCanvas L2");
    buildMap("L2", displayMode, pathNodes);
  }

  function Floor1() {
    setfloor("pathfindingCanvas one");
    buildMap("ONE", displayMode, pathNodes);
  }

  function Floor2() {
    setfloor("pathfindingCanvas two");
    buildMap("TWO", displayMode, pathNodes);
  }

  function Floor3() {
    setfloor("pathfindingCanvas three");
    buildMap("THREE", displayMode, pathNodes);
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
    <div className={"pathfinding-container"}>
      <div className={"pathfinding-left"}>
        <>
          <Card style={{ marginBottom: "64px" }}>
            <Card.Header
              className={"heading-text"}
              style={{ textAlign: "start" }}
            >
              Get Directions
            </Card.Header>
            <Card.Body>
              <div>
                <div className={"nodeSelectorDiv"}>
                  <Button
                    onClick={selectStartNode}
                    style={{ minWidth: "120px" }}
                    variant="outline-dark"
                  >
                    Start Node
                  </Button>
                  <span style={{ fontWeight: "bold" }}>{startNode}</span>
                </div>
                <div
                  className={"nodeSelectorDiv"}
                  style={{ marginBottom: "32px" }}
                >
                  <Button
                    onClick={selectEndNode}
                    style={{ minWidth: "120px" }}
                    variant="outline-dark"
                  >
                    End Node
                  </Button>
                  <span style={{ fontWeight: "bold" }}>{endNode}</span>
                </div>
                <Button onClick={Submit} style={{ width: "100%" }}>
                  {displayMode}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </>
        <div className={"button-div"}>
          <Button
            onClick={groundFloor}
            variant={
              floor == "pathfindingCanvas ground" ? "primary" : "outline-dark"
            }
          >
            Ground
          </Button>
          <Button
            onClick={FloorL1}
            variant={
              floor == "pathfindingCanvas L1" ? "primary" : "outline-dark"
            }
          >
            L1
          </Button>
          <Button
            onClick={FloorL2}
            variant={
              floor == "pathfindingCanvas L2" ? "primary" : "outline-dark"
            }
          >
            L2
          </Button>
          <Button
            onClick={Floor1}
            variant={
              floor == "pathfindingCanvas one" ? "primary" : "outline-dark"
            }
          >
            1
          </Button>
          <Button
            onClick={Floor2}
            variant={
              floor == "pathfindingCanvas two" ? "primary" : "outline-dark"
            }
          >
            2
          </Button>
          <Button
            onClick={Floor3}
            variant={
              floor == "pathfindingCanvas three" ? "primary" : "outline-dark"
            }
          >
            3
          </Button>
        </div>
      </div>
      <div className={"pathfinding-right"}>
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
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
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
    </div>
  );
}

export default Pathfinding;
