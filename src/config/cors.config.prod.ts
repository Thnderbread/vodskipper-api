import logger from "./loggerConfig"

function validateOrigin(origin: string): boolean {
  const validChromeOriginRegex = /chrome-extension:\/\/\w+/
  const validFireFoxOriginRegex = /moz-extension:\/\/\w+/

  return (
    validChromeOriginRegex.test(origin) || validFireFoxOriginRegex.test(origin)
  )
}

const corsOptsProd = {
  origin: (origin: string, callback: CallableFunction) => {
    if (validateOrigin(origin)) {
      callback(null, true)
    } else {
      logger.error(`Origin "${origin}" is not allowed by CORS.`)
      callback(new Error("Not allowed."))
    }
  },
  methods: "GET",
  credentials: false,
}

export default corsOptsProd
