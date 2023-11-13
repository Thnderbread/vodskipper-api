import { Database } from "better-sqlite3"

jest.mock("../src/model/Token", () => {
  return {
    SQLiteTokenDatabase: jest.fn().mockImplementation((db: Database) => {
      return {
        setNewTokenData: jest.fn(),
        getAccessToken: jest
          .fn()
          .mockImplementation((userId) => "niceAccessToken123"),
        deleteAccessToken: jest
          .fn()
          .mockImplementation((userId) => "niceAccessToken123"),
      }
    }),
  }
})
