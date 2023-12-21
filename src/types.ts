import type { HelixVideoMutedSegmentData } from "@twurple/api/lib/interfaces/endpoints/video.external"
import type { TwurpleError } from "./Errors/TwurpleError"

type SegmentData = MutedVodSegment[] | undefined
export type MutedSegmentResponse = [SegmentData, TwurpleError | null]
export interface MutedVodSegment {
  id?: string
  title?: string
  duration: number
  endingOffset: number
  startingOffset: number
  readableVideoTime: string
}

export type FormatMutedSegmentsData = (
  vod: HelixVideoMutedSegmentData[]
) => MutedVodSegment[]

export type GetMutedSegmentsFunction = (
  vodID: string
) => Promise<MutedVodSegment[]> | undefined

export interface TwurpleErrorType {
  error: string
  status: number
  message: string
}
