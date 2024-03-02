import { v4 as uuid } from "uuid"
import logger from "../config/loggerConfig"
import type { Request, Response } from "express"

function requestLogger(req: Request, res: Response): void {
  // ! maybe remove req.host - see what it looks like over https first
  res.on("finish", () => {
    logger.info(`
      Log id: ${uuid()}
      Date: ${new Date().toISOString()}
      Method: ${req.method}
      Request Origin: ${req.headers.origin}
      Host: ${req.headers.host ?? "undefined"}
      Endpoint: ${req.url}
      Status Code: ${res.statusCode}\n`)
  })
}

export default requestLogger
