import { resolve } from "path"
import Database, { type Database as DatabaseType } from "better-sqlite3"
import logger from "./loggerConfig"

const filepath = resolve(__dirname, "..", "..", "data", "vodskipper.db")

/**
 * Creates connection to SQLite3 database.
 */
export function createConn(): DatabaseType | undefined {
  try {
    const db = new Database(filepath, {
      fileMustExist: false,
    })

    const sql = db.prepare(
      `CREATE TABLE IF NOT EXISTS tokens (
        userId VARCHAR(255) PRIMARY KEY NOT NULL,
        accessToken VARCHAR(255),
        expiresIn INTEGER,
        obtainmentTimestamp INTEGER,
        scope TEXT,
        refreshToken VARCHAR(255))`
    )
    sql.run()

    logger.info(
      "SQLite database connection established. Table created or already existed."
    )
    return db
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Unable to create the database connection: ${error.message}`)
      throw error
    }
  }
}

export const connection = createConn()
