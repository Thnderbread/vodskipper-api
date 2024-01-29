import request from "supertest"
import app from "../../src/server"
import { MutedVodSegment } from "../../src/types"

const VALIDVOD = "2045617286"
const INVALIDVOD = "1234756"
const UNMUTEDVOD = "1991896028"

interface Response {
  status: number
  body: {
    segments: MutedVodSegment[]
  }
}

describe("API Integration Tests", () => {
  jest.setTimeout(60_000)

  /**
   * This test will be enabled when the Twitch
   * Helix api is fixed, and app access tokens
   * return muted segment data instead of null.
   */
  it("should return a 200 status and segment data for GET /vodData/:id when the requested vod is found", async () => {
    const response: Response = await request(app).get(`/vodData/${VALIDVOD}`)

    expect(response.status).toBe(200)
    expect(response.body.segments).toBeInstanceOf(Array)
    expect(response.body.segments).not.toHaveLength(0)
  }),
    it("should return a 404 status for GET /vodData/:id when the requested vod is not found", async () => {
      const response = await request(app).get(`/vodData/${INVALIDVOD}`)

      expect(response.status).toBe(404)
    })
  it("should return a 404 status for GET /vodData/:id when the requested vod has no muted segments", async () => {
    const response = await request(app).get(`/vodData/${UNMUTEDVOD}`)

    expect(response.status).toBe(404)
  })
})
