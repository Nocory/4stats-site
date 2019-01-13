const PurifyCSSPlugin = require('purifycss-webpack')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const Visualizer = require('webpack-visualizer-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path')
const glob = require('glob')

module.exports = {
	mode: "production",
	optimization: {
		namedModules: false,
		namedChunks: false,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 2,
      maxAsyncRequests: 10,
      maxInitialRequests: 10,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: false
				}
      }
    }
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
		//new Visualizer(),
		//new BundleAnalyzerPlugin()
	]
}