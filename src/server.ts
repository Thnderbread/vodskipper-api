import cors from "cors"
import corsOpts from "./getCorsOpts"
import logger from "./config/loggerConfig"
import express, { type Express } from "express"
import requestLogger from "./middleware/requestLogger"
import validateRequest from "./middleware/verifyRequest"
import handleMutedSegmentsRequest from "./controllers/mutedSegmentsController"

const app: Express = express()
const PORT = process.env.PORT ?? 8000

// @ts-expect-error Everything is fine, don't know what the issue is
app.use(cors(corsOpts))
app.use(express.json())

app.use(
  "/vods/muted/:vodID",
  validateRequest,
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
      `[server]: Production server started listening on  
      port ${PORT} on ${new Date().toISOString()}`
    )
  })
}

export default app
