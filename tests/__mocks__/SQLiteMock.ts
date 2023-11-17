jest.mock("better-sqlite3", () => {
  return {
    Database: jest.fn().mockImplementation(() => {
      return {
        prepare: jest.fn().mockReturnValue(statementMock),
      }
    }),
  }
})

const statementMock = {
  get: jest.fn(),
  run: jest.fn(),
}
