import request from "supertest"
import app from "../../src/server"

const VALIDVOD = "1954413289"
const INVALIDVOD = "1234756"

describe("API Integration Tests", () => {
  jest.setTimeout(60_000)

  it("should return a 200 status and segment data for GET /vodData/:id when the requested vod is found", async () => {
    const response = await request(app).get(`/vodData/${VALIDVOD}`)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)

    /**
     * Will be changed to .not.toHaveLength when
     * The Helix api is fixed
     */
    expect(response.body).toHaveLength(0)

    /**
     * for when the Helix api is fixed, and segment data can be
     * obtained w/ an app access token.
     */
    // expect(response.body as MutedVodSegment[]).toMatchObject(
    //   response.body as MutedVodSegment[],
    // )
  }),
    it("should return a 404 status for GET /vodData/:id when the requested vod is not found", async () => {
      const response = await request("http://localhost:8080").get(
        `/vodData/${INVALIDVOD}`,
      )

      expect(response.status).toBe(404)
    })
})
