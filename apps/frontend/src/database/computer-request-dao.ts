import type { ComputerRequest, Prisma } from "database";
import { Dao } from "./dao.ts";
import axios, { AxiosError } from "axios";

// Types that stuff using the DAO should use
export type { ComputerRequest };
export type CreateComputerRequest = Prisma.ComputerRequestCreateInput;
export type UpdateComputerRequest = Prisma.ComputerRequestUpdateInput & {
  id: number;
};

/**
 * DAO for the computer request table
 */
export default class ComputerRequestDao
  implements
    Dao<ComputerRequest, number, CreateComputerRequest, UpdateComputerRequest>
{
  /**
   * Creates a computer request in the database
   * @param token the API token to use
   * @param row the row to use in creating the computer request. The ID should NOT be filled in
   * @return the fully created ComputerRequest object, including the ID
   */
  async create(
    token: string,
    row: CreateComputerRequest
  ): Promise<ComputerRequest> {
    // Delegate to Axios, return what Axios sends us back
    return (
      await axios.post("/api/computer-requests", row, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
  }

  /**
   * Deletes a computer request from the database
   * @param token the API token to use to delete the computer request
   * @param key the key to use to delete the request
   */
  async delete(token: string, key: number): Promise<void> {
    await axios.delete("/api/computer-requests/" + key, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Gets a single computer request from the database
   * @param token the API token to use
   * @param key the key of the request to get
   * @return the found request, or null if there is none
   */
  async get(token: string, key: number): Promise<ComputerRequest | null> {
    try {
      return (
        await axios.get("/api/computer-requests/" + key, {
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
   * Gets all computer requests in the database
   * @param token the API token to use in getting the requests
   * @return a list of all computer requests in the table
   */
  async getAll(token: string): Promise<ComputerRequest[]> {
    return (
      await axios.get("/api/computer-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
  }

  /**
   * Updates the given computer request
   * @param token the token to use for the API calls
   * @param row the row to update
   */
  async update(
    token: string,
    row: UpdateComputerRequest
  ): Promise<ComputerRequest> {
    return (
      await axios.patch("/api/computer-requests/" + row.id, row, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
  }
}
