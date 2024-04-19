import logger from "../config/loggerConfig"
import RedisClient from "../config/RedisClient"
import type { Request, Response, NextFunction } from "express"

/**
 * Searches cache for VOD data. If found, returns
 * the VOD data. If not found, continues to the controller
 * to contact the Twitch API for the VOD data.
 */
function searchCache(req: Request, res: Response, next: NextFunction): void {
  const { vodID } = req.params
  RedisClient.get(vodID)
    .then((segments) => {
      if (segments !== null) {
        // signaling the main fetch function doesn't need to operate
        res.locals.handled = true
        res.status(200).json({ segments: JSON.parse(segments) })
        next()
        return
      }
      next()
    })
    .catch((error) => {
      logger.error("Failed to set value in cache: ", error)
    })
}

export default searchCache
