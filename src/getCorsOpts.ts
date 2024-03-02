import corsOptsDev from "./config/cors.config.dev"
import corsOptsProd from "./config/cors.config.prod"

const corsOpts = process.env.NODE_ENV === "prod" ? corsOptsProd : corsOptsDev

export default corsOpts
