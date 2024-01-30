import path from "path"
import { readFileSync } from "fs"
import { createServer } from "https"
import logger from "./config/loggerConfig"
import express, { type Express } from "express"
import requestLogger from "./middleware/requestLogger"
import handleMutedSegmentsRequest from "./controllers/mutedSegmentsController"

const app: Express = express()
const PORT = process.env.PORT ?? 8000

app.use(express.json())

app.get("/vodData/:vodID", handleMutedSegmentsRequest)

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
    logger.info(`[server]: HTTPS server started at ${PORT} at ${new Date()}`)
    console.log(`[server]: HTTPS server listening on port ${PORT}`)
  })
}

export default app
