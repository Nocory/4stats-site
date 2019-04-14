const npmEvent = process.env.npm_lifecycle_event

const merge = require("webpack-merge")

console.log("NODE VERSION:", process.version)
console.log("NODE_ENV:", process.env.NODE_ENV)
console.log("npmEvent:", npmEvent)

let baseConfig = require(`./webpack.config.base.js`)
let eventConfig = require(`./webpack.config.${npmEvent}.js`)

module.exports = merge(baseConfig, eventConfig)
