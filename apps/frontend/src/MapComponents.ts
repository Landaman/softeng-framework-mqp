import { Edge } from "./database/edge-dao.ts";
import { Node } from "./database/node-dao.ts";

export interface MapNode {
  x1: number;
  y1: number;
  node: Node;
  fromDatabase: boolean;
  deleted: boolean;
}

export interface MapEdge {
  index1: number;
  index2: number;
  edge: Edge;
  fromDatabase: boolean;
  deleted: boolean;
}
