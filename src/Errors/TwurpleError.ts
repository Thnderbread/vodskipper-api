export class TwurpleError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
    this.name = "TwurpleError"
    this.statusCode = statusCode
  }
}
