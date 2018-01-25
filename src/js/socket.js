const socketIO = require('socket.io-client')
const config = require('./config')
const pino = require("./pino")

pino.info("Initiating socket.io connection with hostURL: ", config.url)
let socket = socketIO(config.url,{
	//transports: ['websocket']
})

let enforcedClientVersion = null
socket.on("enforcedClientVersion", data => {
	enforcedClientVersion = enforcedClientVersion || data
	pino.info("Enforced client version is %d", data)
	if (enforcedClientVersion != data) {
		pino.info("reloading")
		window.location.reload(true)
	}
})

module.exports = socket