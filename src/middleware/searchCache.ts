import RedisClient from "../config/RedisClient"
import type { Request, Response, NextFunction } from "express"

/**
 * Searches cache for VOD data. If found, returns
 * the VOD data. If not found, continues to the controller
 * to contact the Twitch API for the VOD data.
 */
export async function searchCache(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { vodID } = req.params
  const cachedSegments = await RedisClient.get(vodID)
  if (cachedSegments !== undefined) {
    res.status(200).json({ segments: cachedSegments })
    return
  }
  next()
}
