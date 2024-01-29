import logger from "../config/loggerConfig"
// import { MemClient } from "./config/MemClient"
import { TwurpleError } from "../Errors/TwurpleError"
import { getMutedVodSegmentsFromTwitch } from "../twurple/api"
import type { NextFunction, Request, Response } from "express"

function handleMutedSegmentsRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
        logger.error(error)
        res.sendStatus(500)
        next()
      }
    })
}

export default handleMutedSegmentsRequest
