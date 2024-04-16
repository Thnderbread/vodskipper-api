import { config } from "dotenv"
import { createClient } from "redis"

config()

const RedisClient = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    connectTimeout: 50,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? ""),
  },
})

RedisClient.on("error", (error) => {
  console.error(error)
})

void (async () => {
  await RedisClient.connect()
})()

export default RedisClient
