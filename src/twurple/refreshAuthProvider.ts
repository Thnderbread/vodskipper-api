import { config } from "dotenv"
import { Token } from "../model/Token"
import logger from "../config/loggerConfig"
import { connection } from "../config/dbConfig"
import type { TokenModel } from "../model/dbtypes"
import { RefreshingAuthProvider } from "@twurple/auth"
import { SQLiteTokenDatabase } from "../model/SqliteTokenDb"

config()

const userId = process.env.USER_ID
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

if (connection === undefined) {
  throw new Error("Database connection not established.")
} else if (
  userId === undefined ||
  clientId === undefined ||
  clientSecret === undefined
) {
  throw new Error(
    "Missing credentials. Ensure user id, client id, and client secret are all provided as environment variables."
  )
}

const authProvider = new RefreshingAuthProvider({
  clientId,
  clientSecret,
})

const user = new Token(userId, new SQLiteTokenDatabase(connection))

try {
  user.addNewEntry({
    userId,
    accessToken: process.env.ACCESS_TOKEN ?? undefined,
    refreshToken: process.env.REFRESH_TOKEN ?? undefined,
    expiresIn: 0,
    obtainmentTimestamp: 0,
    scope: [],
  })

  const userToken = user.getUserData()
  if (userToken !== undefined) {
    // @ts-expect-error TokenModel type satisfies the type requirements at runtime.
    authProvider.addUser(userId, userToken)
  }
} catch (error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNIQUE constraint failed: tokens.userId") {
      logger.warn(
        "Entry for this user already exists. Ignoring creation statement."
      )
    } else {
      throw error
    }
  }
}

authProvider.onRefresh((userId, newTokenData) => {
  // @ts-expect-error TokenModel type satisfies the type requirements at runtime.
  const dataToBeAdded: TokenModel = { ...newTokenData, userId }
  user.setNewTokenData(dataToBeAdded)
})

/**
 * Notify about refresh failure
 * Prompt for re-auth client-side?
 * Just obtain new access token?
 */
authProvider.onRefreshFailure((userId) => {
  authProvider
    .getAccessTokenForUser(userId)
    .then((newTokenData) => {
      logger.debug(`Retrieved new token data for user: ${userId}`)
      user.setNewTokenData(newTokenData as TokenModel)
    })
    .catch((error) => {
      throw error
    })
})

export default authProvider
