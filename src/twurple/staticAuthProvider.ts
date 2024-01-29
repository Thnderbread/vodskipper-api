/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv"
import logger from "../config/loggerConfig"
import { StaticAuthProvider } from "@twurple/auth"

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
