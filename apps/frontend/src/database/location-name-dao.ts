import type {
  LocationName as PrismaLocationNameType,
  Node,
  Prisma,
} from "database";
import { Dao } from "./dao.ts";
import axios, { AxiosError } from "axios";
import { CreateNode } from "./node-dao.ts";

// Types that stuff using the DAO should use
export type LocationName = PrismaLocationNameType & { node: Node | null };
export type CreateLocationName = PrismaLocationNameType & {
  node: Exclude<CreateNode, "locationName"> | number | null;
};
export type UpdateLocationName = PrismaLocationNameType & {
  node: Exclude<CreateNode, "locationName"> | number | null;
};

/**
 * DAO for the node table
 */
export default class LocationNameDao
  implements Dao<LocationName, number, CreateLocationName, UpdateLocationName>
{
  /**
   * Creates the Prisma create input based on Node input
   * @param input the input to create. Either a node, a number, or nothing
   * @returns either the Prisma create input, or undefined if there's nothing
   */
  static nodeInputToPrismaCreateInput(
    input: Exclude<CreateNode, "locationName"> | number | null
  ): Prisma.NodeCreateNestedOneWithoutLocationNameInput | undefined {
    // If we have one
    if (input) {
      // Determine what to do based on its type
      if (typeof input === "number") {
        // Connect to it if it's a number
        return {
          connect: {
            id: input,
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
   * Method that converts a node to Prisma update input
   * @param input the Prisma update input, either the node, a number, or null
   * @return the Prisma update parameters based on that input
   */
  static nodeInputToPrismaUpdateInput(
    input: Exclude<CreateNode, "locationName"> | number | null
  ): Prisma.NodeUpdateOneWithoutLocationNameNestedInput {
    // Try having the create input crate it
    const createInput = LocationNameDao.nodeInputToPrismaCreateInput(input);

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
   * Creates a LocationName in the database
   * @param token the API token to use
   * @param row the row to use in creating the location name. If the node is a number, it will automatically
   * link to the node with that ID. If it is a CreateNode type, it will create the node
   * @return the fully created location name object, including the ID
   */
  async create(token: string, row: CreateLocationName): Promise<LocationName> {
    // Delegate to axios and await the response
    return (
      await axios.post(
        "/api/location-names",
        {
          longName: row.longName,
          shortName: row.shortName,
          locationType: row.locationType,
          node: LocationNameDao.nodeInputToPrismaCreateInput(row.node),
        } satisfies Prisma.LocationNameCreateInput,
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
    await axios.delete("/api/location-names/" + key, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Gets a single node from the database
   * @param token the API token to use
   * @param key the key of the location name to get
   * @return the found request, or null if there is none
   */
  async get(token: string, key: number): Promise<LocationName | null> {
    try {
      return (
        await axios.get("/api/location-names/" + key, {
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
   * Gets all location names in the database
   * @param token the API token to use in getting the location names
   * @return a list of all nodes in the table
   */
  async getAll(token: string): Promise<LocationName[]> {
    return (
      await axios.get("/api/location-names", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
  }

  /**
   * Updates the given node
   * @param token the token to use for the API calls
   * @param row the node to update. If the node is a number, links the node with that number. If the node
   * is a CreateNode type, it will create that node
   */
  async update(token: string, row: UpdateLocationName): Promise<LocationName> {
    // Ensure that the location name is set to be that new one
    return (
      await axios.patch(
        "/api/location-names/" + row.longName,
        {
          longName: row.longName,
          shortName: row.shortName,
          locationType: row.locationType,
          node: LocationNameDao.nodeInputToPrismaUpdateInput(row.node),
        } satisfies Prisma.LocationNameUpdateInput,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    ).data;
  }
}
