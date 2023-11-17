import { MemClient } from "../config/MemClient"
import logger from "../config/loggerConfig"
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
): Response | undefined {
  const { vodID } = req.params
  const senderUrl = req.headers.referer + req.url.substring(1)

  if (vodID === "" || typeof vodID !== "string") {
    logger.debug(
      `Rejected request from ${senderUrl} because no vod id was given.`
    )
    return res.sendStatus(400)
  }

  if (req.method !== "GET") {
    logger.debug(
      `Rejected request from ${senderUrl} due to invalid request method: ${req.method}`
    )
    return res.sendStatus(405)
  }

  MemClient.get(vodID, (error, data) => {
    if (error !== null) {
      logger.error("Damn.", error)
      return res.sendStatus(500)
    } else if (data.length === 0) {
      logger.info(`Data for ${vodID} not found in cache.`)
      next()
    } else {
      logger.info(`Data for ${vodID} found in cache.`)
      const mutedSegmentData: string = JSON.parse(data.toString())
      return res.status(200).json({ mutedSegmentData })
    }
  })
}
