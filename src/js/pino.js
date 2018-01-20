const config = require("./config")

const pino = require("pino")({
	name: '4stats',
	safe: true,
	prettyPrint: process.env.NODE_ENV != "production",
	level: process.env.PINO_LEVEL || (process.env.NODE_ENV == "production" ? config.debugLevelProduction : config.debugLevelDevelopment),
	base: null
})

module.exports = pino