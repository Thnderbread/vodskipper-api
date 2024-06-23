import logger from "../config/loggerConfig"
import { TwurpleError } from "../Errors/TwurpleError"
import { getMutedVodSegmentsFromTwitch } from "../twurple/api"
import type { NextFunction, Request, Response } from "express"

function handleMutedSegmentsRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { vodID } = req.params
  getMutedVodSegmentsFromTwitch(vodID)
    .then(({ success, data, error }) => {
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
