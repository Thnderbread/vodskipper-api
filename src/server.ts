import cors from "cors"
import logger from "./config/loggerConfig"
// import { MemClient } from "./config/MemClient"
import { getMutedVodSegmentsFromTwitch } from "./twurple/api"
import express, {
  type NextFunction,
  type Express,
  type Request,
  type Response,
} from "express"
import { TwurpleError } from "./Errors/TwurpleError"
import requestLogger from "./middleware/requestLogger"

const app: Express = express()
const PORT = process.env.PORT ?? 8000

const TWITCHDOMAIN = "twitch.tv/videos/*"

// app.use(
//   cors({
//     origin: TWITCHDOMAIN,
//     methods: "GET",
//     credentials: false,
//   })
// )

app.use(express.json())

app.get(
  "/vodData/:vodID",
  (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") {
      res.sendStatus(405)
      next()
    }

    const { vodID } = req.params

    getMutedVodSegmentsFromTwitch(vodID)
      .then((response) => {
        // A bad token
        const [data, error] = response
        if (error !== null) {
          throw error
        }
        if (data !== undefined && data.length > 0) {
          // Cache the data before returning it
          // MemClient.set(
          //   vodID,
          //   JSON.stringify(response),
          //   { expires: 604800 },
          //   (error) => {
          //     if (error !== null) {
          //       logger.error(`Couldn't cache data for ${vodID}:`, error)
          //       return
          //     }
          //     logger.info(`Cached data for ${vodID}.`)
          //   }
          // )
          res.status(200).json({ segments: data })
          next()
        } else {
          res.sendStatus(404)
          next()
        }
      })
      .catch((error) => {
        if (error instanceof TwurpleError) {
          res.sendStatus(error.statusCode)
          next()
        } else {
          logger.error("Damn. ", error)
          res.sendStatus(500)
          next()
        }
      })
  }
)

app.use(requestLogger)

// this check fixes some issue that was being
// being encountered w/ the tests that I should've
// documented at the time but forgot to
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    logger.info(`App now listening on port ${PORT}`)
  })
}

export default app
