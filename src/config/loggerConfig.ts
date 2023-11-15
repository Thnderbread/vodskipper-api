import path from "path"
import { createLogger, format, transports } from "winston"

const logDir = path.join(__dirname, "..", "..", "logs")

const infoLogFilepath = path.join(logDir, "infoLog.log")
const debugLogFilepath = path.join(logDir, "debugLog.log")
const errorLogFilepath = path.join(logDir, "errorLog.log")

export const fileLogger = createLogger({
  format: format.printf(({ message }) => {
    return `\n${message}\n${"-".repeat(160)}\n`
  }),
  transports: [
    new transports.File({ filename: debugLogFilepath, level: "debug" }),
    new transports.File({ filename: errorLogFilepath, level: "error" }),
    new transports.File({ filename: infoLogFilepath, level: "info" }),
  ],
})

export const consoleLogger = createLogger({
  format: format.json(),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
})
