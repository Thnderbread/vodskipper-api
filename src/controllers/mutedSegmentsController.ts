import logger from "../config/loggerConfig"
import RedisClient from "../config/RedisClient"
import { TwurpleError } from "../Errors/TwurpleError"
import { getMutedVodSegmentsFromTwitch } from "../twurple/api"
import type { NextFunction, Request, Response } from "express"

function handleMutedSegmentsRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // if vod stuff was found in cache
  if (res.locals.handled === true) {
    next()
    return
  }
  const { vodID } = req.params
  getMutedVodSegmentsFromTwitch(vodID)
    .then(async ({ success, data, error }) => {
      if (!success) {
        logger.error(error.message)
        if (error instanceof TwurpleError) {
          res.sendStatus(error.statusCode)
        } else {
          res.sendStatus(500)
        }
        next()
        return
      }

      try {
        await RedisClient.set(vodID, JSON.stringify(data))
      } catch (error) {
        logger.error(
          "Couldn't set value in cache due to error: ",
          (error as Error).message
        )
      }
      if (data.length > 0) {
        res.status(200).json({ segments: data })
      } else {
        res.sendStatus(404)
      }
      next()
    })
    .catch((error) => {
      logger.error("Unhandled error: ", error.message)
      res.sendStatus(500)
      next()
    })
}

export default handleMutedSegmentsRequest
