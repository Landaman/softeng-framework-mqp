import { SanitationRequest, Prisma } from "database";
import { Dao } from "./dao.ts";
import axios, { AxiosError } from "axios";

export type { SanitationRequest };
export type CreateSanitationRequest = Prisma.SanitationRequestCreateInput;
export type UpdateSanitationRequest = Prisma.SanitationRequestUpdateInput & {
  id: number;
};

/**
 * DAO for the sanitation request table
 */
export default class SanitationRequestDao
  implements
    Dao<
      SanitationRequest,
      number,
      CreateSanitationRequest,
      UpdateSanitationRequest
    >
{
  /**
   * Creates a sanitation request in the database
   * @param token the API token to use
   * @param row the row to use in creating the sanitation request. The ID should NOT be filled in
   * @return the fully created SanitationRequest object, including the ID
   */
  async create(
    token: string,
    row: CreateSanitationRequest
  ): Promise<SanitationRequest> {
    // Delegate to Axios, return what Axios sends us back
    return await axios.post("/api/sanitation-requests", row, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Deletes a sanitation request from the database
   * @param token the API token to use to delete the sanitation request
   * @param key the key to use to delete the request
   */
  async delete(token: string, key: number): Promise<void> {
    await axios.delete("/api/sanitation-requests/" + key, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Gets a single sanitation request from the database
   * @param token the API token to use
   * @param key the key of the request to get
   * @return the found request, or null if there is none
   */
  async get(token: string, key: number): Promise<SanitationRequest | null> {
    try {
      return await axios.get("/api/sanitation-requests/" + key, {
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
   * Gets all sanitation requests in the database
   * @param token the API token to use in getting the requests
   * @return a list of all sanitation requests in the table
   */
  async getAll(token: string): Promise<SanitationRequest[]> {
    return await axios.get("/api/sanitation-requests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Updates the given computer request
   * @param token the token to use for the API calls
   * @param row the row to update
   */
  async update(
    token: string,
    row: UpdateSanitationRequest
  ): Promise<SanitationRequest> {
    return await axios.patch(
      "/api/computer-requests/" + row.id,
      {
        location: row.location,
        staff: row.staff,
        issue: row.issue,
        urgency: row.urgency,
      } satisfies Prisma.SanitationRequestUpdateInput,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
