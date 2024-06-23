import request from "supertest"
import app from "../../src/server"
import { type MutedVodSegment } from "../../src/types"

const MUTEDVODID = "1780317987"
const INVALIDVODID = "1234756"
const UNMUTEDVODID = "2111779905"

interface Response {
  status: number
  body: {
    segments: MutedVodSegment[]
  }
}

describe("API Integration Tests", () => {
  jest.setTimeout(60_000)

  it("should return a 200 status and segment data for GET /vods/muted/:id when the requested vod is found", async () => {
    const response: Response = await request(app).get(
      `/vods/muted/${MUTEDVODID}`
    )
    expect(response.status).toBe(200)
    expect(response.body.segments).toBeInstanceOf(Array)
    expect(response.body.segments).not.toHaveLength(0)
  })

  it("should return a 404 status for GET /vods/muted/:id when the requested vod is not found", async () => {
    const response = await request(app).get(`/vods/muted/${INVALIDVODID}`)

    expect(response.status).toBe(404)
  })

  it("should return a 404 status for GET /vods/muted/:id when the requested vod has no muted segments", async () => {
    const response = await request(app).get(`/vods/muted/${UNMUTEDVODID}`)
    expect(response.status).toBe(404)
  })

  it("should return a 404 status for invalid vodID parameters", async () => {
    const firstResponse = await request(app).get(`/vods/muted/`)
    const secondResponse = await request(app).get(`/vods/muted/${true}`)

    expect(firstResponse.status).toBe(404)
    expect(secondResponse.status).toBe(404)
  })

  it("should return a 405 status for a POST request", async () => {
    const response = await request(app).post(`/vods/muted/${MUTEDVODID}`).send()
    expect(response.status).toBe(405)
  })

  it("should return a 404 status for requests made to unmatched endpoints", async () => {
    const response = await request(app).get("/")
    expect(response.status).toBe(404)
  })
})
