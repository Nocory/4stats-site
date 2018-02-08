const socketIO = require('socket.io-client')
const config = require('./config')
const pino = require("./pino")

//pino.info("Initiating socket.io connection with hostURL: ", config.url)
let socket = socketIO(config.url,{
	transports: window.WebSocket ? ['websocket'] : ['polling', 'websocket'],
	reconnectionDelay: 4000
})

//window.soc = socket

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
	pino.debug("Socket re-connected")
})

socket.on("connect",() => {
	pino.debug("Socket connected")
})

let openTimerID = null
let closeTimerID = null
let isSocketOpen = true // maybe not needed, but lets be sure

const handleVisibilityChange = () => {
	if(document.hidden){
		clearTimeout(openTimerID)
		clearTimeout(closeTimerID)
		if(isSocketOpen){
			closeTimerID = setTimeout(() => {
				isSocketOpen = false
				socket.close()
			},30000)
		}
	}else{
		clearTimeout(openTimerID)
		clearTimeout(closeTimerID)
		if(!isSocketOpen){
			openTimerID = setTimeout(() => {
				isSocketOpen = true
				socket.open()
			},500)
		}
	}
}

if(document.hidden) handleVisibilityChange()

document.addEventListener("visibilitychange", handleVisibilityChange, false)

module.exports = socket