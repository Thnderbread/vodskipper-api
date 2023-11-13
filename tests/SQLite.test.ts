import Database from "better-sqlite3"
import { SQLiteTokenDatabase } from "../src/model/SqliteTokenDb"
import { clearDB, seedDB, MockData } from "./seeder"

describe("SQLiteTokenDatabase", () => {
  const db = require("better-sqlite3")(":memory:")
  const tokenDb = new SQLiteTokenDatabase(db)

  beforeEach(() => {
    seedDB(db, MockData.seedData)
  })

  afterEach(() => {
    clearDB(db)
  })

  // Successfully set new token data
  it("should successfully replace token data with new data.", () => {
    tokenDb.setNewTokenData(MockData.updatedData)

    tokenDb.getUserData = jest.fn().mockImplementation((userId) => {
      return MockData.updatedData
    })
    const resultData = tokenDb.getUserData("user1234")

    expect(resultData).toMatchObject(MockData.updatedData)
  })

  // Delete access token from database.
  it("should successfully remove the access token from the database.", () => {
    tokenDb.deleteAccessToken("user1234")
    tokenDb.getUserData = jest.fn().mockImplementation((userId) => {
      return MockData.staleData
    })
    const data = tokenDb.getUserData("user1234")

    expect(data).toMatchObject(MockData.staleData)
  })
})
