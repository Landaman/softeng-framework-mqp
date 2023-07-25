import type { Node as PrismaNodeType, LocationName, Prisma } from "database";
import { Dao } from "./dao.ts";
import axios, { AxiosError } from "axios";
import { Edge } from "./edge-dao.ts";

// Base type, remove location as we have locationName
type baseType = Omit<PrismaNodeType, "location">;

// Types that stuff using the DAO should use
export type Node = baseType & { locationName: LocationName | null } & {
  startEdges: Edge[];
  endEdges: Edge[];
};
export type CreateNode = Omit<baseType, "id"> & {
  locationName: LocationName | string | null;
};
export type UpdateNode = Omit<
  Omit<Prisma.NodeUpdateInput, "startEdges">,
  "endEdges"
> & {
  locationName?: LocationName | string | null;
  id: number;
};

// As far as I can tell, this is the only way to do this
export enum Floor {
  L1 = "L1",
  L2 = "L2",
  ONE = "ONE",
  TWO = "TWO",
  THREE = "THREE",
}

/**
 * DAO for the node table
 */
export default class NodeDao
  implements Dao<Node, number, CreateNode, UpdateNode>
{
  /**
   * Creates the Prisma create input based on LocationName input
   * @param input the input to create. Either a LocationName, a string, or nothing
   * @returns either the Prisma create input, or undefined if there's nothing
   */
  static locationNameInputToPrismaCreateInput(
    input: LocationName | string | null
  ): Prisma.LocationNameCreateNestedOneWithoutNodeInput | undefined {
    // If we have one
    if (input) {
      // Determine what to do based on its type
      if (typeof input === "string") {
        // Connect to it if it's a string
        return {
          connect: {
            longName: input,
          },
        };
      } else {
        // Otherwise, create it
        return {
          create: input,
        };
      }
    }
  }

  /**
   * Method that converts a location name to Prisma update input
   * @param input the Prisma update input, either the LocationName, a string, or null
   * @return the Prisma update parameters based on that input
   */
  static locationNameInputToPrismaUpdateInput(
    input: LocationName | string | null | undefined
  ): Prisma.LocationNameUpdateOneWithoutNodeNestedInput | undefined {
    // Handle the undefined case by just passing it up to prisma (do nothing)
    if (input === undefined) {
      return undefined;
    }

    // Try having the create input crate it
    const createInput = NodeDao.locationNameInputToPrismaCreateInput(input);

    if (createInput) {
      // If that works, return it
      return createInput;
    } else {
      // Otherwise, just disconnect it
      return {
        disconnect: true,
      };
    }
  }

  /**
   * Creates a Node in the database
   * @param token the API token to use
   * @param row the row to use in creating the node. If the location name is a string, it will automatically
   * link to the location with that long name. If it is a CreateLocationName type, it will create the location name.
   * Otherwise, it will not link the location name
   * @return the fully created Node object, including the ID
   */
  async create(token: string, row: CreateNode): Promise<Node> {
    // Delegate to axios and await the response
    return (
      await axios.post(
        "/api/nodes",
        {
          xCoord: row.xCoord,
          yCoord: row.yCoord,
          floor: row.floor,
          building: row.building,
          locationName: NodeDao.locationNameInputToPrismaCreateInput(
            row.locationName
          ),
        } satisfies Prisma.NodeCreateInput,
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
    await axios.delete("/api/nodes/" + key, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Gets a single node from the database
   * @param token the API token to use
   * @param key the key of the node to get
   * @return the found request, or null if there is none
   */
  async get(token: string, key: number): Promise<Node | null> {
    try {
      return (
        await axios.get("/api/nodes/" + key, {
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
   * Gets all nodes in the database
   * @param token the API token to use in getting the nodes
   * @return a list of all nodes in the table
   */
  async getAll(token: string): Promise<Node[]> {
    return (
      await axios.get("/api/nodes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
  }

  /**
   * Updates the given node
   * @param token the token to use for the API calls
   * @param row the node to update. If the location name is a string, it will link it to the location with that
   * long name. Otherwise, it will attempt to create a location like that
   */
  async update(token: string, row: UpdateNode): Promise<Node> {
    // Ensure that the location name is set to be that new one
    return (
      await axios.patch(
        "/api/nodes/" + row.id,
        {
          xCoord: row.xCoord,
          yCoord: row.yCoord,
          floor: row.floor,
          building: row.building,
          locationName: NodeDao.locationNameInputToPrismaUpdateInput(
            row.locationName
          ),
        } satisfies Prisma.NodeUpdateInput,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    ).data;
  }
}
