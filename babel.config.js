module.exports = function(api) {
  api.cache(true)

  const plugins = []
  const presets = [
    [
      "@babel/preset-env",
      {
        debug: true,
        modules: false,
        loose: true,
        useBuiltIns: "usage",
        corejs: 3
      }
    ]
  ]

  return {
    plugins,
    presets
  }
}
