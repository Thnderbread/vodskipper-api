import { v4 as uuid } from "uuid"
import logger from "../config/loggerConfig"
import type { Request, Response } from "express"

function requestLogger(req: Request, res: Response): void {
  res.on("finish", () => {
    logger.info(
      `Log id: ${uuid()}
      Date: ${new Date().toISOString()}
      Method: ${req.method}
      Referrer: ${req.headers.referer ?? "undefined"}
      Original URI: ${req.headers.origin}
      URI: ${req.url}
      Status Code: ${res.statusCode}\n`
    )
  })
}

export default requestLogger
