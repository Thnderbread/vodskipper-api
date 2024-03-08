import logger from "../config/loggerConfig"
import type { NextFunction, Request, Response } from "express"

/**
 * Simple validator middleware to ensure the request comes from
 * the service worker on twitch.
 */
function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const vodIdRegex = /\d{8,}/
  const { vodID } = req.params
  const { origin } = req.headers
  if (!vodIdRegex.test(vodID)) {
    logger.warn(
      `Rejected request from origin ${origin} because of invalid vod id.`
    )
    res.sendStatus(404)
    return
  } else if (req.method !== "GET") {
    logger.warn(
      `Rejected request from origin ${origin} due to invalid request method: ${req.method}`
    )

    res.sendStatus(405)
    return
  }
  next()
}

export default validateRequest
