/**
 * Interface defining what a DAO should look for on a given
 * row and row type
 */
export interface Dao<Type, KeyType> {
  /**
   * Gets all rows associated with the table represented
   * by this DAO
   * @param token the API token to use on the API
   * @return all rows in the table
   */
  getAll(token: string): Promise<Type[]>;

  /**
   * Gets a singular row from this table
   * @param token the API token to use on the API
   * @param key the id of the row
   * @return the row that was looked up, or null if it does not exist
   */
  get(token: string, key: KeyType): Promise<Type | null>;

  /**
   * Creates a new row in this table
   * @param token the API token to use
   * @param row the row object to create
   * @return the finished row object, in case an ID is required to be generated
   */
  create(token: string, row: Type): Promise<Type>;

  /**
   * Deletes a row object from the table
   * @param token the API token to use
   * @param key the key of the object to delete
   */
  delete(token: string, key: KeyType): Promise<void>;

  update(token: string, row: Type): Promise<void>;
}
