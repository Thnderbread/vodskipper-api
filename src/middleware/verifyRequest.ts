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
  const env = process.env.NODE_ENV ?? "dev"
  if (env === "dev") {
    next()
    return
  }

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
  } else if (req.headers.host !== "www.twitch.tv") {
    logger.warn(
      `Rejected request from host${req.headers.host} due to invalid host.`
    )
    res.sendStatus(400)
    return
  }
  next()
}

export default validateRequest
