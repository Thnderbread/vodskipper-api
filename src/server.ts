import cors from "cors"
import corsOpts from "./getCorsOpts"
import logger from "./config/loggerConfig"
import express, { type Express } from "express"
import searchCache from "./middleware/searchCache"
import requestLogger from "./middleware/requestLogger"
import validateRequest from "./middleware/verifyRequest"
import handleMutedSegmentsRequest from "./controllers/mutedSegmentsController"
import RedisClient from "./config/RedisClient"

const app: Express = express()
const PORT = process.env.PORT ?? 8000

// @ts-expect-error Everything is fine, don't know what the issue is
app.use(cors(corsOpts))
app.use(express.json())

app.use(
  "/vods/muted/:vodID",
  validateRequest,
  searchCache,
  handleMutedSegmentsRequest,
  requestLogger
)
app.all(
  "*",
  (_, res, next) => {
    res.sendStatus(404)
    next()
  },
  requestLogger
)

if (process.env.NODE_ENV === "dev") {
  app.listen(PORT, () => {
    logger.info(`[server]: HTTP server listening at http://localhost:${PORT}`)
  })
} else if (process.env.NODE_ENV === "prod") {
  app.listen(PORT, () => {
    logger.info(
      `[server]: Server started listening on  
      port ${PORT} on ${new Date().toISOString()}`
    )
  })
}

process.on("SIGINT", () => {
  logger.warn("[server]: Exiting due to SIGINT signal")
  RedisClient.disconnect()
})

export default app
