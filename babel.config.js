module.exports = function (api) {
  api.cache(true)

  const plugins = [
		"@babel/plugin-syntax-dynamic-import",
		"@babel/plugin-proposal-object-rest-spread"
	]
  const presets = [
		[
			"@babel/preset-env",
			{
			"debug": true,
			"modules": false,
			"loose": true,
			"useBuiltIns": "usage"
			}
		]
	]

  return {
    plugins,
    presets  
  }
}