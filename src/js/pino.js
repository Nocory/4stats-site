import config from "./config"

import pino from "pino"

export default pino({
  name: "4stats",
  safe: true,
  prettyPrint: process.env.NODE_ENV != "production",
  level: process.env.PINO_LEVEL || (process.env.NODE_ENV == "production" ? config.debugLevelProduction : config.debugLevelDevelopment),
  base: null
})
