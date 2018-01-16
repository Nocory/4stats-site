import axios from "axios"

import Vue from "vue/dist/vue.runtime.esm.js"
import Vuex from "vuex"
Vue.use(Vuex)

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
		enabledBoards: JSON.parse(localStorage.getItem("enabledBoards")) || [...config.availableBoards.default,...config.availableBoards.imageGenerals,...config.availableBoards.nsfw],
		selectedBoard: localStorage.getItem("selectedBoard") || "g",
		boardData: config.allBoards.reduce((obj,key) => ({...obj, [key]: {
			postsPerMinute: -1,
			threadsPerHour: -1,
			avgPostsPerDay: -1,
			topPPM: -1,
			relativeActivity: -1
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
		setStatusMessage(state,payload){
			state.statusMessage.connected = payload.connected
			state.statusMessage.message = payload.message
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
				console.log(`${payload.board} missing from list. Adding it now. This shouldn't happen really.`)
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
			if(payload){
				state.isThreadlistReversed = state.sortThreadlistBy == payload ? !state.isThreadlistReversed : false
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

			if(state.isThreadlistReversed){
				state.enabledBoards.reverse()
			}
		}
	},
	actions: {
		getActiveThreads(context,board = context.state.selectedBoard){
			//console.log("requesting",payload)
			const url = location.hostname == "localhost" ? `http://${location.hostname}:4001` : "https://chanstats.conroy.link"
			axios.get(url + "/activeThreads",{
				params: {
					board
				}
			})
				.then(function (response) {
					context.commit("updateThreadData",{
						board,
						threads: response.data
					})
				})
				.catch(function (error) {
					console.error(error)
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

// THREADS
store.dispatch('boardClicked')

// BOARD STATS
const url = location.hostname == "localhost" ? `http://${location.hostname}:4001` : "https://chanstats.conroy.link"

axios.get(url + "/allBoardStats")
	.then(function (response) {
		store.commit("setInitialData",response.data)
		store.commit("sortBoardList")
	})
	.catch(function (error) {
		console.log(error)
	})
	

socket.on("boardUpdate",(board,data) => {
	//tempRemoveThis_itsJustForTesting(board,data)
	//console.log("boardUpdate",board,data)
	//if(!store.state.boardData[board]) return console.warn("Received stats for board that is not in the list:",board)
	store.commit("updateBoardData",{
		board,
		data
	})

	if(store.state.sortThreadlistBy != "name"){
		store.commit("sortBoardList")
	}

	if(store.state.selectedBoard == board){
		setTimeout(store.dispatch,Math.random() * 500,"getActiveThreads",board) //stagger thread requests coming from different clients
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