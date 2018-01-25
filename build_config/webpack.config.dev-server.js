const npmEvent = process.env.npm_lifecycle_event
const merge = require('webpack-merge')
const path = require('path')

let devConfig = require(`./webpack.config.dev.js`)

module.exports = merge(devConfig, {
	devServer: {
		contentBase: path.join("dist"),
		compress: true,
		host: "0.0.0.0",
		port: 3000,
		overlay: true
	},
})