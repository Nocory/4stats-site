const webpack = require("webpack")

const PurifyCSSPlugin = require('purifycss-webpack')
const MinifyPlugin = require("babel-minify-webpack-plugin")
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const path = require('path')
const glob = require('glob')

const PrerenderSpaPlugin = require('prerender-spa-plugin')

//const PrerendererWebpackPlugin = require('prerenderer-webpack-plugin')
//const BrowserRenderer = PrerendererWebpackPlugin.BrowserRenderer // or JSDOMRenderer, or ChromeRenderer

module.exports = {
	plugins: [
		new PurifyCSSPlugin({
			styleExtensions: [".css", ".sass", ".scss"],
			paths: glob.sync(path.join(__dirname, '/src/{*.html,components/*.vue,js/**/*.vue}')),
			//paths: glob.sync(path.join(__dirname, '/build/*.js')),
			verbose: true,
			purifyOptions: {
				whitelist: ["*:not*","greentext"] //
			}
		}),
		new OptimizeCssAssetsPlugin(),
		new MinifyPlugin(),
		/*
		new PrerenderSpaPlugin(
			// Absolute path to compiled SPA
			path.join(__dirname, '/build'),
			// List of routes to prerender
			['/'], {
				captureAfterTime: 2000
			}
		)
		*/
		/*
		new PrerendererWebpackPlugin({
			// Required - The path to the webpack-outputted app to prerender.
			staticDir: path.join(__dirname, 'build'),
			// Required - Routes to render.
			routes: [ '/'],

			// Optional - This is the default.
			// or new ChromeRenderer({ command: 'chrome-start-command' })
			// or new JSDOMRenderer()
			renderAfterTime: 2000,
			renderer: new BrowserRenderer({
				renderAfterTime: 2000,
				opn: {
					// Mac: google-chrome, Windows: chrome, Linux: varies, probably google-chrome or google-chrome stable. chromium works too.
					app: ['chrome']
				}
			})
		})
		*/
	]
}