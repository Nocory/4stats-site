const PurifyCSSPlugin = require('purifycss-webpack')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')

const path = require('path')
const glob = require('glob')

module.exports = {
	mode: "production",
	optimization: {
		namedModules: false,
		namedChunks: false
	},
	plugins: [
		new PurifyCSSPlugin({
			styleExtensions: [".css", ".sass", ".scss"],
			paths: glob.sync(path.join('src/{*.html,components/*.vue,js/**/*.vue}')),
			//paths: glob.sync(path.join(__dirname, '/build/*.js')),
			verbose: true,
			purifyOptions: {
				whitelist: ["*:not*","greentext"] //
			}
		}),
		new OptimizeCssAssetsPlugin(),
		new Visualizer()
	]
}