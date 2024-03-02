import type { HelixVideoMutedSegmentData } from "@twurple/api/lib/interfaces/endpoints/video.external"

interface SuccessfulTwurpleFetch {
  success: true
  error?: never
  data: MutedVodSegment[]
}

interface UnsuccessfulTwurpleFetch {
  success: false
  data?: never
  error: Error
}

export type MutedSegmentResponse =
  | SuccessfulTwurpleFetch
  | UnsuccessfulTwurpleFetch

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
