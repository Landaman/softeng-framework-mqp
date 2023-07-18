import { Node, Edge } from "database";

export interface MapNode {
  x1: number;
  y1: number;
  node: Node;
}

export interface MapEdge {
  index1: number;
  index2: number;
  edge: Edge;
}
