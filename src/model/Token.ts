import { revokeToken } from "@twurple/auth"
import type { TokenModel, TokenDatabase } from "./dbtypes"

/**
 * Model for interacting with token data.
 */
export class Token {
  /**
   * Sets the user id in the class
   * as a private variable. Does not
   * create the user in the database.
   *
   * @param userId The user's Twitch id.
   * @param database The database instance.
   */
  constructor(
    private readonly userId: string,
    private readonly database: TokenDatabase
  ) {}

  /**
   * Adds new data to the database based on the
   * given data.
   *
   * @param newTokenData The new Twitch access token data.
   */
  public addNewEntry(newTokenData: TokenModel): void {
    this.database.addNewEntry(newTokenData)
  }

  /**
   * Removes all of a user's data from the database.
   * Contacts Twitch to revoke their access token.
   */
  public async removeData(): Promise<void> {
    const token = this.database.removeData(this.userId)

    if (token !== undefined) {
      await this.revokeTokenFromTwitch(token)
    }
  }

  /**
   * Gets the data associated with a user as an object.
   */
  public getUserData(): TokenModel | undefined {
    return this.database.getUserData(this.userId)
  }

  /**
   * Sets new token data in the database.
   *
   * @param newTokenData The new Twitch access token data.
   */
  public setNewTokenData(newTokenData: TokenModel): void {
    this.database.setNewTokenData(newTokenData)
  }

  /**
   * Retrieves the access token string from the database.
   */
  public getAccessToken(): string | undefined {
    return this.database.getAccessToken(this.userId)
  }

  /**
   * Deletes Token from database, and then
   * Revokes it from Twitch.
   *
   * @returns True if the operation succeeds.
   * Null if the token was not found.
   */
  public async deleteAccessToken(): Promise<boolean | null> {
    const token = this.database.deleteAccessToken(this.userId)
    if (token !== undefined) {
      await this.revokeTokenFromTwitch(token)
      return true
    } else {
      return null
    }
  }

  /**
   * Contacts Twitch to revoke the given token.
   *
   * @param token The token to revoke.
   * @throws An error if the client id could not be found.
   */
  private async revokeTokenFromTwitch(token: string): Promise<boolean> {
    if (process.env.CLIENT_ID !== undefined) {
      await revokeToken(process.env.CLIENT_ID, token)
      return true
    }
    throw new Error("Missing client id.")
  }
}
