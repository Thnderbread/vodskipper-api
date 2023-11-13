import { Database } from "better-sqlite3"
import { TokenModel } from "../src/model/dbtypes"

// Dummy scope arr
export const scopesArr = ["chat:read", "chat:write", "chat:ban"]

/**
 * Data after setNewTokenData() call
 */
const updatedData: TokenModel = {
  userId: "user1234",
  accessToken: "newAccessToken123",
  refreshToken: "niceRefreshToken123",
  expiresIn: 280,
  obtainmentTimestamp: 5789,
  scope: scopesArr,
}

/**
 * Initial seed data
 */
const seedData: TokenModel = {
  userId: "user1234",
  accessToken: "niceAccessToken123",
  refreshToken: "niceRefreshToken123",
  expiresIn: 180,
  obtainmentTimestamp: 4789,
  scope: scopesArr,
}

/**
 * Data after deleteAccessToken() call
 */
const staleData: TokenModel = {
  userId: "user1234",
  accessToken: null,
  refreshToken: "niceRefreshToken123",
  expiresIn: 0,
  obtainmentTimestamp: 0,
  scope: scopesArr,
}

/**
 * Mock Data object
 */
export const MockData = {
  updatedData,
  staleData,
  seedData,
}

/**
 * Clear Database
 */
export function clearDB(db: Database) {
  const clearStmt = db.prepare(`DELETE FROM tokens`)
  clearStmt.run()
}

/**
 * Database seeder.
 *
 * @param db Database connection instance.
 * @param seedData Data to seed database with. Leave empty
 * to only create the table.
 */
export function seedDB(db: Database, seedData?: TokenModel): void {
  const createTableStmt = db.prepare(
    `CREATE TABLE IF NOT EXISTS tokens (
        userId VARCHAR(255) PRIMARY KEY NOT NULL,
        accessToken VARCHAR(255),
        expiresIn INTEGER,
        obtainmentTimestamp INTEGER,
        scope TEXT,
        refreshToken VARCHAR(255))`,
  )
  createTableStmt.run()

  if (seedData) {
    const seedDataStmt = db.prepare(
      `INSERT INTO tokens
    (userId, accessToken, refreshToken, expiresIn, obtainmentTimestamp, scope)
    VALUES (?, ?, ?, ?, ?, ?)`,
    )
    seedDataStmt.run(
      seedData.userId,
      seedData.accessToken,
      seedData.refreshToken,
      seedData.expiresIn,
      seedData.obtainmentTimestamp,
      seedData.scope?.join(" "),
    )
  }
}
