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
      callback(new Error(`Origin "${origin}" is not allowed by CORS.`))
    }
  },
  methods: "GET",
  credentials: false,
}

export default corsOptsProd
