import cors from "cors"
import dotenv from "dotenv" // for caching?
import { MutedVodSegment } from "./types"
import { getMutedVodSegmentsFromTwitch } from "./twurple/api"
import express, { Express, Request, Response } from "express"

const app: Express = express()
const PORT = process.env.PORT || 8080

const TWITCHDOMAIN = "twitch.tv/videos/*"

app.use(
  cors({
    origin: TWITCHDOMAIN,
    methods: "GET",
    credentials: false,
  }),
)

app.use(express.json())

app.get("/vodData/:vodID", async (req: Request, res: Response) => {
  if (req.method !== "GET") {
    return res.sendStatus(405)
  }

  try {
    const { vodID } = req.params

    const response: MutedVodSegment[] | string =
      await getMutedVodSegmentsFromTwitch(vodID)

    /**
     * cache that shit, key will be vod id, expiry time of 1 week? 2?
     * cache only if mutedSegmentData is not undefined
     */

    switch (typeof response) {
      /**
       * Denotes a bad token. Not sure
       * What happens if a twurple request
       * fails, so leaving this here for now.
       */
      case "string":
        return res.status(401).json({ message: "Bad token." })
      /**
       * Array - means that there is
       * segment data.
       */
      case "object":
        return res.status(200).json({ response })
      /**
       * Undefined - no data found.
       */
      default:
        return res.sendStatus(404)
    }
  } catch (error) {
    console.error("Damn. ", error)
    res.sendStatus(500)
  }
})

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`App now listening on port ${PORT}`))
}

export default app
