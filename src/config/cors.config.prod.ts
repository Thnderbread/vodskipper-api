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
      console.log("Request Confirmed valid by CORS.")
      callback(null, true)
    } else {
      console.log("Request rejected by CORS.")
      callback(new Error("Not allowed by CORS."))
    }
  },
  methods: "GET",
  credentials: false,
}

export default corsOptsProd
