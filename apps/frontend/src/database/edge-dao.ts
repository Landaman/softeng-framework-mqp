import type { Edge as PrismaEdgeType, Prisma } from "database";
import { Dao } from "./dao.ts";
import axios, { AxiosError } from "axios";
import NodeDao, { Node, CreateNode } from "./node-dao.ts";

// Base type, remove the start and end node IDs
type edgeBase = Omit<Omit<PrismaEdgeType, "startNodeId">, "endNodeId">;

// Types to use
export type Edge = edgeBase & { startNode: Node; endNode: Node };
export type CreateEdge = Omit<edgeBase, "id"> & {
  startNode: CreateNode | number;
  endNode: CreateNode | number;
};
export type UpdateEdge = {
  startNode?: CreateNode | number;
  endNode?: CreateNode | number;
} & { id: number };

/**
 * DAO for the computer request table
 */
export default class EdgeDao
  implements Dao<Edge, number, CreateEdge, UpdateEdge>
{
  /**
   * Method that converts node input to the Prisma create input
   * @param input the input, either create node or the number
   * @return the Prisma node creation input
   */
  static nodeInputToPrismaCreateInput(
    input: CreateNode | number
  ): Prisma.NodeCreateNestedOneWithoutStartEdgesInput {
    // If we have a number
    if (typeof input === "number") {
      // Simply do the connection
      return {
        connect: {
          id: input,
        },
      };
    } else {
      // Manually expand, fill in the location name
      return {
        create: {
          xCoord: input.xCoord,
          yCoord: input.yCoord,
          floor: input.floor,
          building: input.building,
          locationName: NodeDao.locationNameInputToPrismaCreateInput(
            input.locationName
          ),
        },
      };
    }
  }

  /**
   * Method that converts node input to the Prisma update input
   * @param input the input, either create node or the number
   * @return the Prisma node update input
   */
  static nodeInputToPrismaUpdateInput(
    input: CreateNode | number | undefined
  ): Prisma.NodeUpdateOneRequiredWithoutStartEdgesNestedInput | undefined {
    // Handle cases where we didn't actually get a node to update
    if (!input) {
      return undefined; // Just return undefined
    }

    // If we have a number
    if (typeof input === "number") {
      // Simply do the connection
      return {
        connect: {
          id: input,
        },
      };
    } else {
      // Manually expand, fill in the location name
      return {
        create: {
          xCoord: input.xCoord,
          yCoord: input.yCoord,
          floor: input.floor,
          building: input.building,
          locationName: NodeDao.locationNameInputToPrismaUpdateInput(
            input.locationName
          ),
        },
      };
    }
  }

  /**
   * Creates an Edge in the database
   * @param token the API token to use
   * @param row the row to use in creating the edge. If the startNode/endNode are numbers, this will link them to
   * the nodes with those IDs
   * @return the fully created Edge object, including the ID
   */
  async create(token: string, row: CreateEdge): Promise<Edge> {
    // Delegate to axios
    return (
      await axios.post(
        "/api/edges",
        {
          startNode: EdgeDao.nodeInputToPrismaCreateInput(row.startNode),
          endNode: EdgeDao.nodeInputToPrismaCreateInput(row.endNode),
        } satisfies Prisma.EdgeCreateInput,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    ).data;
  }

  /**
   * Deletes a node from the database
   * @param token the API token to use to delete the node
   * @param key the key to use to delete the node
   */
  async delete(token: string, key: number): Promise<void> {
    await axios.delete("/api/edges/" + key, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Gets a single edges from the database
   * @param token the API token to use
   * @param key the key of the edge to get
   * @return the found request, or null if there is none
   */
  async get(token: string, key: number): Promise<Edge | null> {
    try {
      return (
        await axios.get("/api/edges/" + key, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
    } catch (error) {
      // Cast the error to an axios error
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        // If the error is 404 (not found)
        return null; // Return null
      }

      // Otherwise, pass up the error
      throw error;
    }
  }

  /**
   * Gets all edges in the database
   * @param token the API token to use in getting the nodes
   * @return a list of all edges in the table
   */
  async getAll(token: string): Promise<Edge[]> {
    return (
      await axios.get("/api/edges", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
  }

  /**
   * Updates the given edge
   * @param token the token to use for the API calls
   * @param row the edge to update. If the startNode/endNode are numbers, this will link them to
   * the nodes with those IDs
   */
  async update(token: string, row: UpdateEdge): Promise<Edge> {
    // Delegate to axios and await the result
    return (
      await axios.patch(
        "/api/edges/" + row.id,
        {
          startNode: EdgeDao.nodeInputToPrismaUpdateInput(row.startNode),
          endNode: EdgeDao.nodeInputToPrismaUpdateInput(row.endNode),
        } satisfies Prisma.EdgeUpdateInput,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    ).data;
  }
}
