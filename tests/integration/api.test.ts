import request from "supertest"
import app from "../../src/server"

const VALIDVOD = "1954413289"
const INVALIDVOD = "1234756"

describe("API Integration Tests", () => {
  jest.setTimeout(60_000)

  /**
   * This test will be enabled when the Twitch
   * Helix api is fixed, and app access tokens
   * return muted segment data instead of null.
   */
  // it("should return a 200 status and segment data for GET /vodData/:id when the requested vod is found", async () => {
  //   const response = await request(app).get(`/vodData/${VALIDVOD}`)

  //   expect(response.status).toBe(200)
  //   expect(response.body).toBeInstanceOf(Array)
  //   expect(response.body).not.toHaveLength(0)
  //   expect(response.body as MutedVodSegment[]).toMatchObject(
  //     response.body as MutedVodSegment[],
  //   )
  // }),
  it("should return a 404 status for GET /vodData/:id when the requested vod is not found", async () => {
    const response = await request(app).get(`/vodData/${INVALIDVOD}`)

    expect(response.status).toBe(404)
  })
})
