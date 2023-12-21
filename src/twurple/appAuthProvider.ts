/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { config } from "dotenv"
import { AppTokenAuthProvider } from "@twurple/auth"

import logger from "../config/loggerConfig"

config()

const clientId = process.env.CLIENT_ID!
const clientSecret = process.env.CLIENT_SECRET!

const authProvider = new AppTokenAuthProvider(clientId, clientSecret)

logger.info("Set up auth provider successfully.")

export default authProvider
