const webpack = require("webpack")

const path = require('path')
//const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

//const DashboardPlugin = require('webpack-dashboard/plugin')

//const front-matter = null;

module.exports = {
	entry: {
		app: ['js/main.js']
	},
	output: {
		//filename: '[name]_[chunkhash:8].js',
		filename: '[name].js',
		path: path.resolve('dist')
	},
	/*
	watch: true,
	watchOptions: {
		ignored: path.resolve(__dirname, 'node_modules'),
		aggregateTimeout: 300
	},
	*/
	module: {
		rules: [{
			test: /\.md$/,
			//use: ['json-loader', 'yaml-frontmatter-loader']
			use: ['json-loader', 'front-matter']
		},
		{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', "postcss-loader"],
				allChunks: true
			})
		},
		{
			test: /\.(sass|scss)$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', "postcss-loader", 'sass-loader'],
				allChunks: true
			})
		},
		{
			test: /\.(ttf|eot|woff|woff2|svg)$/,
			loader: "url-loader?limit=10240&name=fonts/[name]_[hash:8].[ext]"
		},
		{
			test: /\.(png|jpg|jpeg|gif)$/,
			loader: "url-loader?limit=10240&name=img/[name]_[hash:8].[ext]"
		},
		{
			test: /\.js$/,
			exclude: /node_modules/,
			use: [{
				loader: 'babel-loader'
			}]
		},
		{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {
					css: ExtractTextPlugin.extract({
						use: ['css-loader', "postcss-loader", 'sass-loader'],
						fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
					}),
					scss: ExtractTextPlugin.extract({
						use: ['css-loader', "postcss-loader", 'sass-loader'],
						fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
					})
				}
			}
		}
		]
	},
	resolve: {
		alias: {
			//"vue$": 'vue/dist/vue.esm.js',
			//"vue-router$": 'vue-router/dist/vue-router.esm.js'
		},
		modules: [
			path.resolve('src'),
			path.resolve('node_modules')
		]
	},
	plugins: [
		//new DashboardPlugin(),
		//new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		//new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
		
		new webpack.optimize.ModuleConcatenationPlugin(),
		new CleanWebpackPlugin(['dist'], {
			root: __dirname,
			verbose: false,
			dry: false,
			watch: false
		}),

		new webpack.EnvironmentPlugin(['NODE_ENV']),

		new HtmlWebpackPlugin({
			//inlineSource: '\.(js|css)$',
			//inlineSource: '.css$',
			manifest: "manifest.json",
			template: 'src/index.html'
		}),
		//new HtmlWebpackInlineSourcePlugin(),
		new CopyWebpackPlugin([
			{ from: 'src/static/_headers', to: '_headers', toType: 'file'}, // hints for netlify http2 push
			{ from: 'src/static', to: '' }
		]),
		new ExtractTextPlugin({
			//filename: "[name]_[contenthash:8].css",
			filename: "[name].css",
			disable: false,
			allChunks: true
		}),

		//new BundleAnalyzerPlugin()
	]
}