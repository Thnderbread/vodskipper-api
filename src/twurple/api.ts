import logger from "../config/loggerConfig"
import authProvider from "./refreshAuthProvider"
import { isTwurpleError } from "./TwurpleError"
import { ApiClient, type HelixVideo } from "@twurple/api"
import type { MutedVodSegment, TwurpleError } from "../types"
import type { HelixVideoMutedSegmentData } from "@twurple/api/lib/interfaces/endpoints/video.external"

const apiClient = new ApiClient({ authProvider })

/**
 * Formats the muted segment data retrieved from
 * Twitch. Adds an endingOffset property.
 *
 * @param mutedSegments The muted segments array
 * received from Twitch.
 */
export function formatMutedSegmentsData(
  mutedSegments: HelixVideoMutedSegmentData[]
): MutedVodSegment[] {
  // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
  return mutedSegments
    .map((segment) => {
      const formattedSegment: MutedVodSegment = {
        duration: segment.duration,
        startingOffset: segment.offset,
        endingOffset: segment.offset + segment.duration,
      }
      return formattedSegment
    })
    .sort()
}

/**
 * Given a vodID, attempt to retrieve the VOD's muted segments data.
 *
 *
 * @param vodID String of the vod's id.
 * @returns A formatted array of all the muted segments in the vod w/
 * a property denoting when the segment ends. Returns undefined if the
 * vod has no muted segment data. This could be because the vod could not
 * be found, or there could simply be no data for the given vod.
 */
export async function getMutedVodSegmentsFromTwitch(
  vodID: string
): Promise<MutedVodSegment[] | string | undefined> {
  logger.debug(`Fetching muted segments for ${vodID}`)

  let vod: HelixVideo | null
  let mutedSegments: HelixVideoMutedSegmentData[] | undefined

  try {
    vod = await apiClient.videos.getVideoById(vodID)
    mutedSegments = vod?.mutedSegmentData
  } catch (error: unknown) {
    if (isTwurpleError(error)) {
      const errorObj: TwurpleError = JSON.parse(error.body)
      if (errorObj.status === 404) {
        return undefined
      } else if (errorObj.status === 401) {
        return "Token Expired."
      }
      logger.error(`Twurple Error: ${error.body}`)
    } else {
      throw error
    }
  }

  logger.debug(`Calling format function for vod ${vodID}`)

  if (mutedSegments === undefined || mutedSegments.length === 0) {
    return undefined
  } else {
    return formatMutedSegmentsData(mutedSegments)
  }
}
