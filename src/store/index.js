const pino = require("../js/pino")

import Vue from "vue/dist/vue.runtime.esm.js"
import Vuex from "vuex"
Vue.use(Vuex)

const axios = require("axios")
const socket = require("../js/socket.js")
const config = require("../js/config")

const adjustPostcountIfNoDubs = (board,data)=>{
	if(["v","vg","vr"].indexOf(board) != -1){
	//if(["v","vg","vr"].includes(board)){
		data.postsPerMinute *= 0.901
		data.avgPostsPerDay *= 0.901
		data.topPPM *= 0.901
	}
	return data
}

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	state: {
		showConfig: false,
		enabledBoards: JSON.parse(localStorage.getItem("enabledBoards")) || config.allBoards,
		selectedBoard: localStorage.getItem("selectedBoard") || config.safeInitialBoard[Math.floor(Math.random() * config.safeInitialBoard.length)],
		boardData: {} || config.allBoards.reduce((obj,key) => ({...obj, [key]: {
			postsPerMinute: 0,
			threadsPerHour: 0,
			avgPostsPerDay: 0,
			topPPM: 0,
			imagesPerReply: 0,
			relativeActivity: 0
		}}),{}), //technology
		threadData: config.allBoards.reduce((obj,key) => ({...obj, [key]: []}),{}), //technology
		sortThreadlistBy: localStorage.getItem("sortThreadlistBy") || "avgPostsPerDay",
		isThreadlistReversed: false,
	},
	getters: {
		getThreadList: (state, getters) => len => {
			if(typeof state.threadData[state.selectedBoard] == "object"){
				return state.threadData[state.selectedBoard].slice(0,len)
			}else{
				return state.threadData[state.selectedBoard]
			}
		},
		getTotalPPM : (state, getters) => {
			let totalPPM = 0
			for(let board in store.state.boardData){
				totalPPM += store.state.boardData[board].postsPerMinute
			}
			//console.log("4chan total - ppm:",totalPPM.toFixed(2), "pps:", (totalPPM / 60).toFixed(2))
			return totalPPM
		}
	},
	mutations: {
		toggleShowConfig(state){
			state.showConfig = !state.showConfig
		},
		setEnabledBoards(state, payload) {
			state.enabledBoards = payload
			localStorage.setItem("enabledBoards",JSON.stringify(payload))
		},
		setInitialData(state,payload){
			for(let key in payload){
				adjustPostcountIfNoDubs(key,payload[key])
			}
			Vue.set(state, 'boardData', payload)
			// enabledBoards is [] before this point. No boards should be enabled, since there is no data for them yet.
			//state.enabledBoards = JSON.parse(localStorage.getItem("enabledBoards")) || config.availableBoards.default.concat(config.availableBoards.imageGenerals).concat(config.availableBoards.misc)
		},
		updateBoardData(state,payload){
			payload.data = adjustPostcountIfNoDubs(payload.board,payload.data)
			
			if(store.state.boardData[payload.board]){
				for(let key in payload.data){
					state.boardData[payload.board][key] = payload.data[key]
				}
			}else{
				Vue.set(state.boardData, payload.board, payload.data)
				pino.warn(`${payload.board} missing from list. Adding it now. This shouldn't happen really.`)
			}
		},
		updateThreadData(state,payload){
			for(let thread of payload.threads){
				thread.com = thread.com.replace(
					/&gt;.*?($|<br>)/gim,
					"<span class='greentext'>$&</span>"
				)
			}
			state.threadData[payload.board] = payload.threads
		},
		boardClicked(state, payload) {
			state.selectedBoard = payload
			localStorage.setItem("selectedBoard",payload)
		},
		sortBoardList(state,payload){
			if(!Object.keys(state.boardData).length) return
			if(payload == state.sortThreadlistBy) return state.enabledBoards.reverse()

			if(payload){
				state.sortThreadlistBy = payload
				localStorage.setItem("sortThreadlistBy",payload)
			}
			if(state.sortThreadlistBy == "name"){
				state.enabledBoards.sort((a, b) => {
					if (a < b) return -1
					if (a > b) return 1
					return 0
				})
			}else{
				state.enabledBoards.sort((a, b) => {
					return state.boardData[b][state.sortThreadlistBy] - state.boardData[a][state.sortThreadlistBy] + (a>b?0.0001:-0.0001)
				})
			}
		}
	},
	actions: {
		getActiveThreads(context,board = context.state.selectedBoard){
			//console.log("requesting",payload)
			pino.debug("Requesting /activeThreads /%s/ from API",board)
			axios.get(config.url + `/activeThreads/${board}`)
				.then(function (response) {
					context.commit("updateThreadData",{
						board,
						threads: response.data
					})
				})
				.catch(function (error) {
					pino.error(error)
				})
		},
		boardClicked(context,board = context.state.selectedBoard) {
			context.commit("boardClicked",board)
			// dont request if threads are already current
			if(context.state.threadData[board].length == 0){
				context.dispatch("getActiveThreads",board)
			}
		}
	}
})

// Get all stats
// The API server automatically sends the latest stats object to every newly connected client
socket.on('disconnect', reason => {
	pino.error("Lost connection to API. %s",reason)
})

// Get active threads initially and on every reconnect
store.dispatch("getActiveThreads")
socket.on("reconnect",() => {
	pino.info("Reconnected to API. Requesting latest data.")
	store.dispatch("getActiveThreads")
})

socket.on("allBoardStats",allBoardStats => {
	pino.info("Received allBoardStats from API")
	store.commit("setInitialData",allBoardStats)
	store.commit("sortBoardList")
})

socket.on("boardUpdate",(board,data) => {
	store.commit("updateBoardData",{
		board,
		data
	})

	if(store.state.sortThreadlistBy != "name"){
		store.commit("sortBoardList")
	}

	if(store.state.selectedBoard == board){
		setTimeout(store.dispatch,Math.random() * 2000,"getActiveThreads",board) //stagger automatic thread requests coming from different clients
	}else{
		store.commit("updateThreadData",{
			board,
			threads: []
		})
	}
})

//socket.emit("initialDataRequest",store.state.selectedBoard)
//console.log("socket: sending 'initialDataRequest'")
//socket.emit("initialDataRequest")


export default store