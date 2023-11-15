import { Client } from "memjs"

export const MemClient: Client<string | Buffer, Buffer> = Client.create()
