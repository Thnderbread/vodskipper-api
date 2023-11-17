import type { Database } from "better-sqlite3"
import type { DatabaseTokenData, TokenDatabase, TokenModel } from "./dbtypes"

/**
 * Implementation of the `TokenDatabase` interface
 * using SQLite3 as the database.
 */
export class SQLiteTokenDatabase implements TokenDatabase {
  /**
   * @param db Database connection.
   */
  constructor(private readonly db: Database) {}

  /**
   * Add a new entry to the database. The user's id
   * is required. If the id in the userOptions object
   * does not match the private variable containing
   * the user id, the private variable will be replaced
   * with the id in the userOptions object.
   *
   * @param newTokenData Object containing the data for
   * to be added to the database.
   */
  public addNewEntry(newTokenData: TokenModel): void {
    if (Object.keys(newTokenData).length === 0) {
      throw new Error("Please supply user newTokenData object.")
    } else if (newTokenData.userId === undefined) {
      throw new Error("User id is required.")
    }

    const sql = this.db.prepare(
      `INSERT INTO tokens 
        (userId, accessToken, refreshToken, expiresIn, obtainmentTimestamp, scope) 
        VALUES (?, ?, ?, ?, ?, ?)`
    )

    sql.run(
      newTokenData.userId,
      newTokenData.accessToken,
      newTokenData.refreshToken,
      newTokenData.expiresIn,
      newTokenData.obtainmentTimestamp,
      newTokenData.scope?.join(" ")
    )
  }

  /**
   * Removes the current user's data from the
   * database. Contacts Twitch to revoke their
   * access token.
   *
   * @param userId The user's Twitch Id.
   */
  public removeData(userId: string): string | undefined {
    const token = this.deleteAccessToken(userId)

    this.db.prepare("DELETE FROM tokens WHERE userId = ?").run(userId)

    return token ?? undefined
  }

  /**
   * Gets all the user's data from the database.
   *
   * @param userId The user's Twitch id.
   * @returns The user's data or an empty value.
   */
  public getUserData(userId: string): TokenModel | undefined {
    const sql = this.db.prepare("SELECT * FROM tokens WHERE userId = ?")
    const data: DatabaseTokenData = sql.get(userId) as DatabaseTokenData

    if (data !== undefined) {
      // explicitly assign null for simplicity in sqlite db.
      const scopeArr = data.scope?.split(" ") ?? undefined

      return {
        userId: data.userId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        obtainmentTimestamp: data.obtainmentTimestamp,
        scope: scopeArr,
      }
    }
  }

  /**
   * Inserts new token data into
   * the database.
   *
   * @param newTokenData
   */
  public setNewTokenData(newTokenData: TokenModel): void {
    const scopeStr = newTokenData.scope?.join(" ") ?? null

    const sql = this.db.prepare(
      `UPDATE tokens SET 
          accessToken = ?,
          refreshToken = ?,
          expiresIn = ?,
          obtainmentTimestamp = ?,
          scope = ?
          WHERE userId = ?`
    )
    sql.run(
      newTokenData.accessToken,
      newTokenData.refreshToken,
      newTokenData.expiresIn,
      newTokenData.obtainmentTimestamp,
      scopeStr,
      newTokenData.userId
    )
  }

  /**
   * Gets the access token from database.
   *
   * @param userId The user's Twitch id
   * @returns The token if it exists. Undefined if it is not found.
   */
  public getAccessToken(userId: string): string | undefined {
    const sql = this.db.prepare(
      "SELECT accessToken FROM tokens WHERE userId = ?"
    )
    const data: DatabaseTokenData = sql.get(userId) as DatabaseTokenData
    return data.accessToken ?? undefined
  }

  /**
   * Deletes the user's access token from the database.
   * Returns the access token string for further processing.
   *
   * @param userId The user's Twitch id.
   * @returns The token if deleted successfully. Null if a token is not found.
   * @throws An error if something goes wrong while querying the db.
   */
  public deleteAccessToken(userId: string): string | undefined {
    const sqlGet = this.db.prepare(
      "SELECT accessToken FROM tokens WHERE userId = ?"
    )
    const sqlDelete = this.db.prepare(
      `UPDATE tokens SET 
        accessToken = null, 
        obtainmentTimestamp = 0, 
        expiresIn = 0 
        WHERE userId = ?`
    )
    const data: DatabaseTokenData = sqlGet.get(userId) as DatabaseTokenData

    /**
     * Delete the access token from db and return
     * it for further processing.
     */
    if (data !== undefined) {
      sqlDelete.run(userId)
      return data.accessToken
    } else {
      return undefined
    }
  }
}
