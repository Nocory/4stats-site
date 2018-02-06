import Vue from "vue/dist/vue.runtime.esm.js"
import Vuex from "vuex"
Vue.use(Vuex)

const config = require("js/config")
const pino = require("js/pino")
const axios = require("axios")
const socket = require("js/socket.js")

const adjustPostcountIfNoDubs = (board,data)=>{
	if(["v","vg","vr"].indexOf(board) != -1){
	//if(["v","vg","vr"].includes(board)){
		data.postsPerMinute *= 0.901
		data.avgPostsPerDay *= 0.901
		data.topPPM *= 0.901
	}
	return data
}

const adjustActivityIfFewPosts = data =>{
	if(data.avgPostsPerDay < 1000) data.relativeActivity -= 9999
	return data
}

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	state: {
		enabledBoards: JSON.parse(localStorage.getItem("enabledBoards")) || config.allBoards,
		selectedBoard: localStorage.getItem("selectedBoard") || config.safeInitialBoard[Math.floor(Math.random() * config.safeInitialBoard.length)],
		boardData: config.allBoards.reduce((obj,key) => ({...obj, [key]: {
			postsPerMinute: 0,
			threadsPerHour: 0,
			avgPostsPerDay: 0,
			topPPM: 0,
			imagesPerReply: 0,
			relativeActivity: 0
		}}),{}), //technology
		threadData: config.allBoards.reduce((obj,key) => ({...obj, [key]: []}),{})
	},
	getters: {
		getTotalPPM : state => {
			let totalPPM = 0
			for(let board in state.boardData){
				totalPPM += state.boardData[board].postsPerMinute
			}
			return totalPPM
		}
	},
	mutations: {
		setEnabledBoards(state, payload) {
			state.enabledBoards = payload
			localStorage.setItem("enabledBoards",JSON.stringify(payload))
		},
		setInitialData(state,payload){
			for(let key in payload){
				adjustPostcountIfNoDubs(key,payload[key])
				adjustActivityIfFewPosts(payload[key])
			}
			Vue.set(state, 'boardData', payload)
			// enabledBoards is [] before this point. No boards should be enabled, since there is no data for them yet.
			//state.enabledBoards = JSON.parse(localStorage.getItem("enabledBoards")) || config.availableBoards.default.concat(config.availableBoards.imageGenerals).concat(config.availableBoards.misc)
		},
		updateBoardData(state,payload){
			adjustPostcountIfNoDubs(payload.board,payload.data)
			adjustActivityIfFewPosts(payload.data)
			
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
		setSelectedBoard(state, payload) {
			state.selectedBoard = payload
			localStorage.setItem("selectedBoard",payload)
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
			context.commit("setSelectedBoard",board)
			// dont request if threads are already current
			if(context.state.threadData[board].length == 0){
				context.dispatch("getActiveThreads",board)
			}
		}
	}
})

// setting up handling of server communication

store.dispatch("getActiveThreads")

socket.on("reconnect",() => {
	store.dispatch("getActiveThreads")
})

socket.on("allBoardStats",allBoardStats => {
	pino.info("Received allBoardStats from API")
	
	// allBoardStats is received automatically after a socket connection has been established
	// if the data for the selected board is different, it means that new threaddata should also be requested
	// imagesPerReply property is used here to check integrity
	const boardData = store.state.boardData[store.state.selectedBoard]
	if(boardData.imagesPerReply && boardData.imagesPerReply != allBoardStats[store.state.selectedBoard].imagesPerReply){
		pino.info("fetching threads after socket connection")
		store.dispatch("getActiveThreads")
	}
	
	store.commit("setInitialData",allBoardStats)
})

socket.on("boardUpdate",(board,data) => {
	store.commit("updateBoardData",{
		board,
		data
	})

	if(store.state.selectedBoard == board){
		setTimeout(store.dispatch,Math.random() * 2000,"getActiveThreads",board) //stagger automatic thread requests coming from different clients
	}else{
		store.commit("updateThreadData",{
			board,
			threads: []
		})
	}
})

export default store