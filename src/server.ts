import path from "path"
import cors from "cors"
import { readFileSync } from "fs"
import { createServer } from "https"
import corsOpts from "./getCorsOpts"
import logger from "./config/loggerConfig"
import express, { type Express } from "express"
import requestLogger from "./middleware/requestLogger"
import validateRequest from "./middleware/verifyRequest"
import handleMutedSegmentsRequest from "./controllers/mutedSegmentsController"

const app: Express = express()
const PORT = process.env.PORT ?? 8000

// @ts-expect-error works fine, not sure what the issue is
app.use(cors(corsOpts))

app.use(express.json())

app.use("/vods/muted/:vodID", validateRequest, handleMutedSegmentsRequest)

app.use(requestLogger)

if (process.env.NODE_ENV === "dev") {
  const options = {
    key: readFileSync(path.join(__dirname, "..", "localhost-key.pem")),
    cert: readFileSync(path.join(__dirname, "..", "localhost.pem")),
  }

  const server = createServer(options, app)

  server.listen(PORT, () => {
    logger.info(`[server]: HTTPS server listening at https://localhost:${PORT}`)
  })
} else if (process.env.NODE_ENV === "prod") {
  app.listen(PORT, () => {
    logger.info(
      `[server]: HTTP server started listening on  
      port ${PORT} on ${new Date().toISOString()}`
    )
  })
}

export default app
