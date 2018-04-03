const path = require('path')

module.exports = {
	mode: "development",
	//devtool: "cheap-module-eval-source-map"
	devServer: {
		historyApiFallback: true,
		//contentBase: path.join("dist"),
		//publicPath: path.join("dist"),
		compress: true,
		host: "0.0.0.0",
		port: 3000,
		overlay: true
	},
}