/**
 * Interface representing the data of an
 * OAuth access token returned from Twitch.
 * Also used to populate database entries.
 */
export interface TokenModel {
  /**
   * The user's Twitch id.
   */
  userId: string

  /**
   * The access token associated with
   * the given user.
   */
  accessToken: string | undefined
  /**
   * The refresh token associated with
   * the given user.
   */
  refreshToken: string | undefined
  /**
   * Expiry of the access token.
   */
  expiresIn: number | undefined
  /**
   * When the access token was obtained.
   */
  obtainmentTimestamp: number | undefined
  /**
   * Scopes for which the access token is
   * valid. Will be converted to space-delimited
   * string in db.
   */
  scope: string[] | undefined
}

/**
 * Interface representing what is returned from
 * the database.
 */
export interface DatabaseTokenData extends Omit<TokenModel, "scope"> {
  /**
   * Scopes for which the access token is
   * valid. Represented as a space-delimited
   * string.
   */
  scope: string | null
}

/**
 * Model for interacting with token data
 * in a database. Designed to work in tandem with Twurple.
 */
export interface TokenDatabase {
  addNewEntry: (newTokenData: TokenModel) => void
  removeData: (userId: string) => string | undefined
  getUserData: (userId: string) => TokenModel | undefined
  getAccessToken: (userId: string) => string | undefined
  setNewTokenData: (newTokenData: TokenModel) => void
  deleteAccessToken: (userId: string) => string | undefined
}
