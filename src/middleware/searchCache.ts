import logger from "../config/loggerConfig"
import RedisClient from "../config/RedisClient"
import type { Request, Response, NextFunction } from "express"

/**
 * Searches cache for VOD data. If found, returns
 * the VOD data. If not found, continues to the controller
 * to contact the Twitch API for the VOD data.
 */
export function searchCache(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { vodID } = req.params
  logger.info("Trying to get stuff")
  RedisClient.get(vodID)
    .then((segments) => {
      if (segments !== null) {
        res.locals.handled = true
        res.status(200).json({ segments: JSON.parse(segments) })
        next()
        return
      }
      // signaling the main function doesn't need to operate
      next()
    })
    .catch((error) => {
      logger.error("Failed to set value in cache: ", error)
    })
}
