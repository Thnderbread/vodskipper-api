import path from "path"
import { createLogger, format, transports } from "winston"
import { addColors } from "winston/lib/winston/config"

const logDir = path.join(__dirname, "..", "..", "logs")

const infoLogFilepath = path.join(logDir, "infoLog.log")
const debugLogFilepath = path.join(logDir, "debugLog.log")
const errorLogFilepath = path.join(logDir, "errorLog.log")

const fileLogger = createLogger({
  format: format.printf(({ message }) => {
    return `\n${message}\n${"-".repeat(160)}\n`
  }),
  transports: [
    new transports.File({ filename: debugLogFilepath, level: "debug" }),
    new transports.File({ filename: errorLogFilepath, level: "error" }),
    new transports.File({ filename: infoLogFilepath, level: "info" }),
  ],
})

addColors({
  error: "red",
  info: "blue",
  debug: "cyan",
  warn: "yellow",
})

const alignLoggerOutput = format.combine(
  format.combine(
    format.label({
      label: "[LOGGER]",
    }),
    format.timestamp({
      format: "YY-MM-DD HH:mm:ss",
    }),
    format.colorize({
      all: true,
    }),
    format.printf(
      (info) =>
        `${info.label}\t${info.timestamp}\t${info.level.toUpperCase()}\t${
          info.message
        }`
    )
  )
)

const consoleLogger = createLogger({
  format: format.json(),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), alignLoggerOutput),
    }),
  ],
})

const logger = process.env.LOG_OPTION === "file" ? fileLogger : consoleLogger

export default logger
