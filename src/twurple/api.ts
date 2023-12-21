import { ApiClient } from "@twurple/api"
import logger from "../config/loggerConfig"
// import authProvider from "./appAuthProvider"
import authProvider from "./staticAuthProvider"
import { isTwurpleError } from "./TwurpleError"
import { TwurpleError } from "../Errors/TwurpleError"
import type {
  MutedSegmentResponse,
  MutedVodSegment,
  TwurpleErrorType,
} from "../types"
import type { HelixVideoMutedSegmentData } from "@twurple/api/lib/interfaces/endpoints/video.external"

const apiClient = new ApiClient({ authProvider })

/**
 * Shows the given time in a friendlier HH:mm:ss format.
 *
 * @param seconds The current time in seconds to format.
 * @returns A HH:mm:ss string based on the given seconds value.
 */
function formatCurrentTime(seconds: number): string {
  if (isNaN(seconds)) {
    return ""
  }

  /**
   * Creates a string for the given number.
   * Adds a 0 in front of the given number if
   * necessary.
   *
   * @param time The number to beautify.
   * @returns The number as a string.
   */
  function beautifyNumber(time: number): string {
    return time > 10
      ? Math.floor(time).toString()
      : Math.floor(time).toString().padStart(2, "0")
  }

  /**
   * Format the number. If the current time is under 60s,
   * pass it to beautifyNumber and return it.
   *
   * Otherwise - calculate the needed values (HH, mm, ss),
   * construct a string based off of them, and return that.
   */
  if (seconds < 60) {
    return beautifyNumber(seconds)
  } else if (seconds < 3600) {
    const minutes = beautifyNumber(Math.floor(seconds / 60))
    const remainingSeconds = beautifyNumber(seconds % 60)
    return `${minutes}:${remainingSeconds}.`
  } else {
    const hours = beautifyNumber(Math.floor(seconds / 3600))
    const remainingMinutes = beautifyNumber(Math.floor((seconds % 3600) / 60))
    const remainingSeconds = beautifyNumber(seconds % 60)

    return `${hours}:${remainingMinutes}:${remainingSeconds}`
  }
}

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
        startingOffset: segment.offset,
        endingOffset: segment.offset + segment.duration,
        duration: segment.duration,
        readableVideoTime: formatCurrentTime(segment.offset),
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
): Promise<MutedSegmentResponse> {
  logger.debug(`Fetching muted segments for ${vodID}`)

  // let mutedSegments: HelixVideoMutedSegmentData[] | undefined

  try {
    const vod = await apiClient.videos.getVideoById(vodID)
    const mutedSegments = vod?.mutedSegmentData

    if (mutedSegments !== undefined) {
      return [formatMutedSegmentsData(mutedSegments), null]
    }
  } catch (error: unknown) {
    if (isTwurpleError(error)) {
      const errorObj: TwurpleErrorType = JSON.parse(error.body)
      if (errorObj.status === 404) {
        return [undefined, new TwurpleError(404, "data not found.")]
      } else if (errorObj.status === 401) {
        return [undefined, new TwurpleError(401, errorObj.message)]
      }
      logger.error(`Twurple Error: ${error.body}`)
    } else {
      throw error
    }
  }
  return [undefined, null]
}
