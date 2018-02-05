const socketIO = require('socket.io-client')
const config = require('./config')
const pino = require("./pino")

pino.info("Initiating socket.io connection with hostURL: ", config.url)
let socket = socketIO(config.url,{
	transports: window.WebSocket ? ['websocket'] : ['polling', 'websocket'],
	reconnectionDelay: 5000
})

let enforcedClientVersion = null
socket.on("enforcedClientVersion", data => {
	enforcedClientVersion = enforcedClientVersion || data
	//pino.info("Enforced client version is %d", data)
	if (enforcedClientVersion != data) {
		pino.info("reloading")
		window.location.reload(true)
	}
})

socket.on('disconnect', reason => {
	pino.warn("Disconnected from API. %s",reason)
})

socket.on("reconnect",() => {
	pino.info("Reconnected to API.")
})

const handleVisibilityChange = () => {
	if(document.hidden){
		socket.close()
	}else{
		socket.open()
	}
}

document.addEventListener("visibilitychange", handleVisibilityChange, false)

module.exports = socket