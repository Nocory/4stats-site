import Vue from "vue/dist/vue.runtime.esm.js"
import Vuex from "vuex"
Vue.use(Vuex)

import config from "js/config"
import pino from "js/pino"
import axios from "axios"
import socket from "js/socket.js"

const adjustActivityIfFewPosts = data => {
  if (data.avgPostsPerDay < 1000) {
    data.relativeActivity -= 9999
  }
  if (data.avgPostsPerDay < 2500) {
    data.activityThisToD -= 9999
  }
  return data
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    enabledBoards: JSON.parse(localStorage.getItem("enabledBoards")) || config.allBoards,
    selectedBoard:
      window.innerWidth >= 768
        ? localStorage.getItem("selectedBoard") || config.safeInitialBoards[Math.floor(Math.random() * config.safeInitialBoards.length)]
        : "",
    boardData: config.allBoards.reduce((acc, key) => {
      acc[key] = {
        postsPerMinute: 0,
        threadsPerHour: 0,
        avgPostsPerDay: 0,
        topPPM: 0,
        imagesPerReply: 0,
        relativeActivity: 0
      }
      return acc
    }, {}),
    threadData: config.allBoards.reduce((acc, key) => {
      acc[key] = []
      return acc
    }, {}),
    userCount: 0
  },
  getters: {
    combinedBoardStats: state => {
      const combinedStats = {
        postsPerMinute: 0,
        threadsPerHour: 0,
        avgPostsPerDay: 0,
        topPPM: 0,
        imagesPerReply: 0,
        relativeActivity: 0
      }

      Object.values(state.boardData).reduce((acc, val) => {
        for (let key in val) acc[key] += val[key]
        return acc
      }, combinedStats)
      combinedStats.imagesPerReply /= config.allBoards.length
      combinedStats.relativeActivity /= config.allBoards.length
      return combinedStats
    }
  },
  mutations: {
    replaceThreadThumbnail(state, payload) {
      state.threadData[payload.selectedBoard][payload.index].image = require("../static/404-DanKim.jpg")
    },
    updateUserCount(state, payload) {
      state.userCount = payload
    },
    setEnabledBoards(state, payload) {
      state.enabledBoards = payload
      localStorage.setItem("enabledBoards", JSON.stringify(payload))
    },
    setInitialData(state, payload) {
      for (let key in payload) {
        adjustActivityIfFewPosts(payload[key])
        if (["s4s", "vip"].includes(key)) payload[key].hasSticky = false
      }
      Vue.set(state, "boardData", payload)
    },
    updateBoardData(state, payload) {
      adjustActivityIfFewPosts(payload.data)
      if (["s4s", "vip"].includes(payload.board)) payload.data.hasSticky = false

      Object.assign(state.boardData[payload.board], payload.data)
    },
    updateThreadData(state, payload) {
      for (let thread of payload.threads) {
        thread.com = thread.com.replace(/&gt;.*?($|<br>)/gim, "<span class='greentext'>$&</span>")
        //if (payload.board == "p") thread.com = thread.com.replace(/<span class="abbr">.+<\/table>/gms, "") //FIXME: gatherer doesn't deliver html tags for this
      }
      state.threadData[payload.board] = payload.threads
    },
    setSelectedBoard(state, payload) {
      state.selectedBoard = payload
      localStorage.setItem("selectedBoard", payload)
    },
    clearThreads(state) {
      for (let board in state.threadData) {
        if (state.threadData[board].length && board != state.selectedBoard) {
          state.threadData[board] = []
        }
      }
    }
  },
  actions: {
    getActiveThreads(context, board = context.state.selectedBoard) {
      if (!board) return
      pino.debug("Requesting /activeThreads /%s/ from API", board)
      axios
        .get(config.url + `/activeThreads/${board}`)
        .then(function(response) {
          context.commit("updateThreadData", {
            board,
            threads: response.data
          })
        })
        .catch(function(error) {
          pino.error(error)
        })
    },
    boardClicked(context, board = context.state.selectedBoard) {
      context.commit("setSelectedBoard", board)
      // dont request if threads are already current
      if (context.state.threadData[board].length == 0) {
        context.dispatch("getActiveThreads", board)
      }
    }
  }
})

socket.on("connect", () => {
  store.commit("clearThreads")
  store.dispatch("getActiveThreads")
})

socket.on("userCount", userCount => {
  store.commit("updateUserCount", userCount)
})

socket.on("allBoardStats", allBoardStats => {
  pino.debug("Received allBoardStats from API")
  store.commit("setInitialData", allBoardStats)
})

socket.on("boardUpdate", (board, data) => {
  store.commit("updateBoardData", {
    board,
    data
  })

  if (store.state.selectedBoard == board) {
    setTimeout(store.dispatch, Math.random() * 2000, "getActiveThreads", board) //stagger automatic thread requests coming from different clients
  } else if (store.state.threadData[board].length) {
    store.commit("updateThreadData", {
      board,
      threads: []
    })
  }
})

export default store
