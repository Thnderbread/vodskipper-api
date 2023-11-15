import { Request, Response, NextFunction } from "express"
import { MemClient } from "../config/MemClient"

/**
 * Searches memcached cache for VOD data. If found, returns
 * the VOD data. If not found, continues to the controller
 * to contact the Twitch API for the VOD data.
 */
export function searchCache(req: Request, res: Response, next: NextFunction) {
  const { vodID } = req.params

  if (!vodID) {
    return res.sendStatus(400)
  }

  if (req.method !== "GET") {
    return res.sendStatus(405)
  }

  try {
    MemClient.get(vodID, (error, data) => {
      if (error) {
        throw error
      } else if (!data) {
        next()
      } else {
        const mutedSegmentData: string = JSON.parse(data.toString())

        return res.status(200).json({ mutedSegmentData })
      }
    })
  } catch (error) {
    console.error("Damn. ", error)
    return res.sendStatus(500)
  }
}
