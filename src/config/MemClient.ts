import { Client } from "memjs"

export const MemClient: Client<string | Buffer, Buffer> = Client.create(
  process.env.AWS_MEMCACHED_NODE_EPT
)
