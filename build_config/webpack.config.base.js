const webpack = require("webpack")

const path = require('path')
//const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin')
//const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
//const ExtractTextPlugin = require("extract-text-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
	entry: {
		app: ['js/main.js']
	},
	output: {
		filename: '[name].js',
		path: path.resolve('dist')
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: [
				MiniCssExtractPlugin.loader,'css-loader', 'postcss-loader'
			]
		},
		{
			test: /\.(sass|scss)$/,
			use: [
				MiniCssExtractPlugin.loader,'css-loader', 'postcss-loader', 'sass-loader'
			]
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
			loader: 'babel-loader'
		},
		{
			test: /\.vue$/,
			loader: 'vue-loader'
		}]
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
		new VueLoaderPlugin(),
		new CleanWebpackPlugin(['dist'], {
			root: __dirname,
			verbose: true,
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
		/*
		new ExtractTextPlugin({
			//filename: "[name]_[contenthash:8].css",
			filename: "[name].css",
			disable: false,
			allChunks: true
		}),
		*/
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].css",
			chunkFilename: "[id].css"
		})

		//new BundleAnalyzerPlugin()
	],
	stats: {
		maxModules: Infinity,
		optimizationBailout: true
	}
	
}