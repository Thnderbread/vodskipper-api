import request from "supertest"
import app from "../../src/server"
import { MutedVodSegment } from "../../src/types"
import RedisClient from "../../src/config/RedisClient"
import assert from "assert"

const MUTEDVODID = "1780240732"
const INVALIDVODID = "1234756"
const UNMUTEDVODID = "2050655749"

interface Response {
  status: number
  body: {
    segments: MutedVodSegment[]
  }
}

describe("API Integration Tests", () => {
  jest.setTimeout(60_000)

  afterAll(async () => {
    await RedisClient.disconnect()
  })

  it("should return a 200 status and segment data for GET /vods/muted/:id when the requested vod is found", async () => {
    const response: Response = await request(app)
      .get(`/vods/muted/${MUTEDVODID}`)
      .set("host", "www.twitch.tv")
    await RedisClient.del(MUTEDVODID)
    expect(response.status).toBe(200)
    expect(response.body.segments).toBeInstanceOf(Array)
    expect(response.body.segments).not.toHaveLength(0)
  })

  it("should cache the response for a segment after the request.", async () => {
    const mutedResponse = await request(app)
      .get(`/vods/muted/${MUTEDVODID}`)
      .set("host", "www.twitch.tv")
    const mutedSegments = mutedResponse.body.segments
    const mutedCached = await RedisClient.get(MUTEDVODID)
    await RedisClient.del(MUTEDVODID)
    assert.ok(mutedCached !== null)
    const mutedParsed = JSON.parse(mutedCached)

    await request(app)
      .get(`/vods/muted/${UNMUTEDVODID}`)
      .set("host", "www.twitch.tv")

    const unmutedCached = await RedisClient.get(UNMUTEDVODID)
    await RedisClient.del(UNMUTEDVODID)
    if (unmutedCached === null) {
      throw new Error("Cache miss for unmuted vod segments.")
    }
    const unmutedParsed = JSON.parse(unmutedCached)

    expect(unmutedParsed).toMatchObject([])
    expect(mutedParsed).toMatchObject<MutedVodSegment[]>(mutedSegments)
  })

  it("should return a 404 status for GET /vods/muted/:id when the requested vod is not found", async () => {
    const response = await request(app)
      .get(`/vods/muted/${INVALIDVODID}`)
      .set("host", "www.twitch.tv")

    expect(response.status).toBe(404)
  })

  it("should return a 404 status for GET /vods/muted/:id when the requested vod has no muted segments", async () => {
    const response = await request(app)
      .get(`/vods/muted/${UNMUTEDVODID}`)
      .set("host", "www.twitch.tv")
    await RedisClient.del(UNMUTEDVODID)
    expect(response.status).toBe(404)
  })

  it("should return a 404 status for invalid vodID parameters", async () => {
    const firstResponse = await request(app)
      .get(`/vods/muted/''`)
      .set("host", "www.twitch.tv")
    const secondResponse = await request(app)
      .get(`/vods/muted/${true}`)
      .set("host", "www.twitch.tv")

    expect(firstResponse.status).toBe(404)
    expect(secondResponse.status).toBe(404)
  })

  it("should return a 405 status for a POST request", async () => {
    const response = await request(app)
      .post(`/vods/muted/${MUTEDVODID}`)
      .send()
      .set("host", "www.twitch.tv")

    expect(response.status).toBe(405)
  })

  it("should return a 400 status for a request from an invalid host", async () => {
    const response = await request(app)
      .get(`/vods/muted/${MUTEDVODID}`)
      .set("host", "www.google.com")

    expect(response.status).toBe(400)
  })
})
