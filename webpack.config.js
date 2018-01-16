const npmEvent = process.env.npm_lifecycle_event;

const merge = require('webpack-merge');

const path = require('path')

console.log("PATH1:", path.resolve(__dirname, 'app_client/build'))
console.log("PATH2:", path.join(__dirname, 'app_client/build/*.js'))
console.log("NODE_ENV:", process.env.NODE_ENV)
console.log("npmEvent:", npmEvent)

let baseConfig = require(`./webpack.config.base.js`);
let eventConfig = require(`./webpack.config.${npmEvent}.js`);

module.exports = merge(baseConfig, eventConfig)