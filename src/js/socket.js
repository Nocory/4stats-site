const socketIO = require('socket.io-client')
const config = require('./config')
const pino = require("./pino")

//pino.info("Initiating socket.io connection with hostURL: ", config.url)
let socket = socketIO(config.url,{
	transports: window.WebSocket ? ['websocket'] : ['polling', 'websocket'],
	reconnectionDelay: 2500
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
	pino.warn("Socket disconnected. Reason: %s",reason)
})

socket.on("reconnect",() => {
	pino.info("Socket re-connected")
})

socket.on("connect",() => {
	pino.info("Socket connected")
})

let timerID = null

const handleVisibilityChange = () => {
	if(document.hidden){
		clearTimeout(timerID)
		timerID = setTimeout(() => {
			pino.info("Tab has been in background too long. Disconnecting socket.")
			socket.close()
		},1000)
	}else{
		clearTimeout(timerID)
		socket.open()
	}
}

if(document.hidden) handleVisibilityChange()

document.addEventListener("visibilitychange", handleVisibilityChange, false)

module.exports = socket