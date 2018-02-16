import Vue from "vue/dist/vue.runtime.esm.js"
import Vuex from "vuex"
Vue.use(Vuex)

const config = require("js/config")
const pino = require("js/pino")
const axios = require("axios")
const socket = require("js/socket.js")

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
		threadData: config.allBoards.reduce((obj,key) => ({...obj, [key]: []}),{}),
		lightMode: JSON.parse(localStorage.getItem("lightMode")) || false
	},
	getters: {
		combinedBoardStats : state => {
			let combinedStats = {
				postsPerMinute: 0,
				threadsPerHour: 0,
				avgPostsPerDay: 0,
				topPPM: 0,
				imagesPerReply: 0,
				relativeActivity: 0
			}
			for(let board in state.boardData){
				combinedStats.postsPerMinute += state.boardData[board].postsPerMinute
				combinedStats.threadsPerHour += state.boardData[board].threadsPerHour
				combinedStats.avgPostsPerDay += state.boardData[board].avgPostsPerDay
				combinedStats.topPPM += state.boardData[board].topPPM
				combinedStats.imagesPerReply += state.boardData[board].imagesPerReply
				combinedStats.relativeActivity += state.boardData[board].relativeActivity
			}
			combinedStats.imagesPerReply /= config.allBoards.length
			combinedStats.relativeActivity /= config.allBoards.length
			return combinedStats
		},
		getTotalPPM : state => {
			let totalPPM = 0
			for(let board in state.boardData){
				totalPPM += state.boardData[board].postsPerMinute
			}
			return totalPPM
		},
		//sortedBoardlist: 
	},
	mutations: {
		toggleLightMode(state) {
			state.lightMode = !state.lightMode
			localStorage.setItem("lightMode",JSON.stringify(state.lightMode))
		},
		setEnabledBoards(state, payload) {
			state.enabledBoards = payload
			localStorage.setItem("enabledBoards",JSON.stringify(payload))
		},
		setInitialData(state,payload){
			for(let key in payload){
				adjustActivityIfFewPosts(payload[key])
			}
			Vue.set(state, 'boardData', payload)
		},
		updateBoardData(state,payload){
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
		},
		clearThreads(state){
			for(let board in state.threadData){
				if(state.threadData[board].length){
					state.threadData[board] = []
				}
			}
		}
	},
	actions: {
		getActiveThreads(context,board = context.state.selectedBoard){
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

socket.on("connect",() => {
	store.commit("clearThreads")
	store.dispatch("getActiveThreads")
})

socket.on("allBoardStats",allBoardStats => {
	pino.debug("Received allBoardStats from API")
	store.commit("setInitialData",allBoardStats)
})

socket.on("boardUpdate",(board,data) => {
	store.commit("updateBoardData",{
		board,
		data
	})

	if(store.state.selectedBoard == board){
		setTimeout(store.dispatch,Math.random() * 2000,"getActiveThreads",board) //stagger automatic thread requests coming from different clients
	}else if(store.state.threadData[board].length){
		store.commit("updateThreadData",{
			board,
			threads: []
		})
	}
})

export default store