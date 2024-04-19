import Redis from "ioredis"
import { config } from "dotenv"
import logger from "./loggerConfig"
import { clearInterval } from "timers"

config()

const RedisClient = new Redis({
  lazyConnect: true,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASS,
  port: parseInt(process.env.REDIS_PORT ?? ""),
})

/**
 * Pings redis every 50 minutes to
 * keep the connection alive.
 */
export function pingRedis(): NodeJS.Timeout {
  const PING_DELAY = 50 * 60 * 1000 // 50 minutes
  return setInterval(() => {
    logger.info("Pinging redis to keep connection alive")
    RedisClient.ping()
      .then((response) => {
        logger.info(`Redis ping response: ${response}`)
      })
      .catch((error) => {
        logger.error(`Error pinging redis: ${error}`)
      })
  }, PING_DELAY)
}

RedisClient.on("error", (error) => {
  logger.error("Redis client error: ", error)
})

void (async () => {
  await RedisClient.connect()
  const pingInterval = pingRedis()
  RedisClient.on("close", () => {
    clearInterval(pingInterval)
  })
})()

export default RedisClient
