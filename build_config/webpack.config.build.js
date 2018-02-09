const webpack = require("webpack")

const PurifyCSSPlugin = require('purifycss-webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const path = require('path')
const glob = require('glob')

module.exports = {
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
		new UglifyJsPlugin({
			cache: true,
			parallel: 4
		})
	]
}