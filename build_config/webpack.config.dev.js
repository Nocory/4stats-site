const path = require('path')

module.exports = {
	mode: "development",
	//devtool: "cheap-module-eval-source-map"
	devServer: {
		historyApiFallback: true,
		//contentBase: path.join("dist"),
		//publicPath: path.join("dist"),
		compress: true,
		host: "localhost",
		port: 3000,
		overlay: true
	},
}