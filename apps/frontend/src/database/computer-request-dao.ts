import { ComputerRequest, Prisma } from "database";
import { Dao } from "./dao.ts";
import axios, { AxiosError } from "axios";

export type { ComputerRequest };
/**
 * DAO for the computer request table
 */
export default class ComputerRequestDao
  implements Dao<ComputerRequest, number>
{
  /**
   * Creates a computer request in the database
   * @param token the API token to use
   * @param row the row to use in creating the computer request. The ID should NOT be filled in
   * @return the fully created ComputerRequest object, including the ID
   */
  async create(token: string, row: ComputerRequest): Promise<ComputerRequest> {
    // Delegate to Axios, return what Axios sends us back
    return await axios.post(
      "/api/computer-requests",
      {
        location: row.location,
        staff: row.staff,
        reason: row.reason,
        type: row.type,
      } satisfies Prisma.ComputerRequestCreateInput,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
      return await axios.get("/api/computer-requests/" + key, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    return await axios.get("/api/computer-requests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
