/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv"
import { StaticAuthProvider } from "@twurple/auth"
import { ApiClient } from "@twurple/api/lib"
import logger from "../config/loggerConfig"

dotenv.config()

const clientId = process.env.CLIENT_ID!
const accessTokenString = process.env.ACCESS_TOKEN!

let authProvider: StaticAuthProvider
try {
  authProvider = new StaticAuthProvider(clientId, accessTokenString)
} catch (error) {
  logger.error(error)
  throw error
}

export default authProvider
