const socketIO = require('socket.io-client')


const url = location.hostname == "localhost" ? `http://${location.hostname}:4001` : "https://chanstats.conroy.link"
//const url = "https://chanstats.conroy.link"
//const url = `http://${location.hostname}:4002`
//const url = "http://chanstats.conroy.link:4002"

console.log("Initiating socket.io connection with hostURL: ", url)
let socket = socketIO(url,{
	transports: ['websocket'],
	query: {
		ref: document.referrer
	}
})

let enforcedClientVersion = null
socket.on("enforcedClientVersion", data => {
	enforcedClientVersion = enforcedClientVersion || data
	console.log("server version", data)
	if (enforcedClientVersion != data) {
		console.log("reloading")
		window.location.reload(true)
	}
})

module.exports = socket