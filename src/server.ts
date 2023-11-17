import cors from "cors"
import logger from "./config/loggerConfig"
import { MemClient } from "./config/MemClient"
import { getMutedVodSegmentsFromTwitch } from "./twurple/api"
import express, { type Express, type Request, type Response } from "express"

const app: Express = express()
const PORT = process.env.PORT ?? 8080

const TWITCHDOMAIN = "twitch.tv/videos/*"

app.use(
  cors({
    origin: TWITCHDOMAIN,
    methods: "GET",
    credentials: false,
  })
)

app.use(express.json())

app.get("/vodData/:vodID", (req: Request, res: Response) => {
  if (req.method !== "GET") {
    res.sendStatus(405)
  }

  const { vodID } = req.params

  getMutedVodSegmentsFromTwitch(vodID)
    .then((response) => {
      // A bad token
      if (typeof response === "string") {
        return res.status(401).json({ message: "Bad token." })
      } else if (Array.isArray(response)) {
        // Cache the data before returning it
        MemClient.set(
          vodID,
          JSON.stringify(response),
          { expires: 604800 },
          (error) => {
            if (error !== null) {
              logger.error(`Couldn't cache data for ${vodID}:`, error)
              return
            }
            logger.info(`Cached data for ${vodID}.`)
          }
        )
        return res.status(200).json({ response })
      } else {
        // No data found
        return res.sendStatus(404)
      }
    })
    .catch((error) => {
      logger.error("Damn. ", error)
      return res.sendStatus(500)
    })
})

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App now listening on port ${PORT}`)
  })
}

export default app
