import { HelixVideoMutedSegmentData } from "@twurple/api/lib/interfaces/endpoints/video.external"

export interface MutedVodSegment {
  id?: string
  title?: string
  duration: number
  endingOffset: number
  startingOffset: number
}

export type FormatMutedSegmentsData = (
  vod: HelixVideoMutedSegmentData[],
) => MutedVodSegment[]

export type GetMutedSegmentsFunction = (
  vodID: string,
) => Promise<MutedVodSegment[]> | undefined

/**
 * Sourced from @twurple library.
 */
export interface HelixVideoData {
  id: string
  user_id: string
  user_login: string
  user_name: string
  title: string
  description: string
  created_at: string
  published_at: string
  url: string
  thumbnail_url: string
  viewable: "public" | "private"
  view_count: number
  language: string
  type: "upload" | "archive" | "highlight"
  duration: string
  stream_id: string | null
  muted_segments: HelixVideoMutedSegmentData[] | null
}
