<template>
  <div class="component">
    <div class="title chart-title is-size-4">Board Timeline</div>

    <div class="has-text-left property-title">{{ timeframe === "day" ? "Charting posts/day" : "Charting posts/minute" }}</div>
    <div class="property-button-group">
      <div>
        <a
          class="property-button"
          :class="{ 'button-selected': timeframe == 'day'}"
          @click="updateProperty({'timeframe':'day'})">
          Daily
        </a>
        <!--<a class="property-button" :class="{ 'button-selected': timeframe == 'daily' && maxEntries }" @click="updateProperty({'timeframe':'daily',maxEntries: 28})">Last Month</a>-->
        <a
          class="property-button"
          :class="{ 'button-selected': timeframe == 'hour' }"
          @click="updateProperty({'timeframe':'hour'})">
        Hourly</a>
      </div>
      <template v-if="timeframe == 'day'">
        <div>
          <a class="property-button" :class="{ 'button-selected': maxEntries == 9999 }" @click="updateProperty({maxEntries:9999})">All</a>
          <a class="property-button" :class="{ 'button-selected': maxEntries == 365 }" @click="updateProperty({maxEntries:365})">1 year</a>
          <a class="property-button" :class="{ 'button-selected': maxEntries == 183 }" @click="updateProperty({maxEntries:183})">6 months</a>
          <a class="property-button" :class="{ 'button-selected': maxEntries == 91 }" @click="updateProperty({maxEntries:91})">3 months</a>
        </div>
      </template>
      <template v-if="timeframe == 'hour'">
        <div>
          <a class="property-button" :class="{ 'button-selected': maxEntries == 24 * 7 * 4 }" @click="updateProperty({maxEntries:24 * 7 * 4})">4 weeks</a>
          <a class="property-button" :class="{ 'button-selected': maxEntries == 24*7 }" @click="updateProperty({maxEntries:24 * 7})">1 week</a>
          <a class="property-button" :class="{ 'button-selected': maxEntries == 24 }" @click="updateProperty({maxEntries:24})">1 day</a>
        </div>
        <div>
          <a class="property-button" :class="{ 'button-selected': weekProperty == 'postsPerMinute' }" @click="updateProperty({'weekProperty':'postsPerMinute'})">Posts/Minute</a>
          <abbr title="The boards posts-per-minute relative to its usual top ppm rate" class="property-button" :class="{ 'button-selected': weekProperty == 'activity' }" @click="updateProperty({'weekProperty':'activity'})">Activity</abbr>
        </div>
        <div>
          <a class="property-button" :class="{ 'button-selected': smoothingLevel == 0 }" @click="updateProperty({'smoothingLevel':0})">Accurate</a>
          <a class="property-button" :class="{ 'button-selected': smoothingLevel == 3 }" @click="updateProperty({'smoothingLevel':3})">Smooth</a>
          <a class="property-button" :class="{ 'button-selected': smoothingLevel == 6 }" @click="updateProperty({'smoothingLevel':6})">Silky</a>
        </div>
      </template>

    </div>

    <div class="chart-wrapper">
      <canvas id="myChart"/>
    </div>

    <div class="board-button-group"
         :style="{justifyContent : alphaSortedBoards.length < 99 ? 'center' : 'flex-start'}"
    >
      <a class="board-button-wrapper" v-for="board in alphaSortedBoards" :key="board" @click="toggleBoard(board)">
        <div class="board-button" :class="{'button-selected': graphedBoards.includes(board)}">/{{ board }}/</div>
      </a>
    </div>
  </div>
</template>

<script>
const axios = require("axios")
const socket = require("../js/socket")
const chartFunctions = require("../js/chartFunctions")
export default {
	data: () => ({
		weekProperty: "postsPerMinute",
		timeframe: "day",
		smoothingLevel: 3,
		maxEntries: 24*7,
		history: {
			hour: {},
			day: {}
		},
		graphedBoards: []
	}),
	computed: {
		alphaSortedBoards () {
			return this.$store.state.enabledBoards.slice().sort()
		}
	},
	methods: {
		handleTimelineData(board, timeframe, history) {
			//console.log("received history",board,timeframe,JSON.stringify(history).length)
			if(!history && this.history[timeframe][board]){
				chartFunctions.addBoard(
					board,
					this.timeframe,
					this.history,
					this.maxEntries,
					this.weekProperty,
					this.smoothingLevel,
				)
				return console.log("reusing existing data")
			}
			if(!history.length) return console.log("history was empty")

			history = history.map(el => ({
				time: el[0],
				timeCovered: el[1],
				postCount: el[2],
				postsPerMinute: el[3]
			}))

			//let noDubsBoardModifier = ["v","vg","vr"].indexOf(board) != -1 ? 0.901 : 1 //anon uses an old non ES6 browser
			let noDubsBoardModifier = ["v","vg","vr"].includes(board) ? 0.901 : 1
			
			let historyData = {
				latestTime: history[history.length - 1].time,
				validUntil: Math.max(Date.now() + 1000*60*5,history[history.length - 1].time + (timeframe == "hour" ? 1000*60*90 : 1000*60*60*48)) - 10000,
				history : history.map(el => (
					{
						x: timeframe == "hour" ? el.time : new Date(el.time).setHours(0,0,1,0),
						y: timeframe == "hour" ? el.postsPerMinute * noDubsBoardModifier : Math.round(el.postCount * noDubsBoardModifier)
					}))
			}
			if(timeframe == "day"){
				const lastEntry = historyData.history[historyData.history.length - 1]
				//console.log(historyData.history[historyData.history.length - 1])
				historyData.history.push({
					x: lastEntry.x + 1000 * 60 * 60 * 23.99,
					y: lastEntry.y
				})
			}
			this.history[timeframe][board] = historyData
			/*
			let activityHistory = []
			for (let entry of history) {
				activityHistory.push({
					x: entry.x,
					y: entry.y ? entry.y / topPPM * 100 : entry.y
				})
			}
			*/

			//console.log(board, prevTimeStep.x)
			//console.log(board, "chart - stringified length:", JSON.stringify(history).length)
			chartFunctions.addBoard(
				board,
				this.timeframe,
				this.history,
				this.maxEntries,
				this.weekProperty,
				this.smoothingLevel,
			)
		},
		requestTimeline(board,term){
			const url = location.hostname == "localhost" ? `http://${location.hostname}:4001` : "https://chanstats.conroy.link"
			axios.get(url + "/history",{
				params: {
					board,
					term
				},
				headers:{
					Accept :'application/octet-stream'
				}
			})
				.then(response => {
					console.log(response.data)
					this.handleTimelineData(board,term,response.data)
				})
				.catch(error => {
					console.error(error)
				})
		},
		addBoardToTimeline(board){
			let timelineData = this.history[this.timeframe][board] || {}
			let validUntil = timelineData.validUntil || 0
			let validMinutesLeft = ((validUntil - Date.now()) / 60000).toFixed(2)
			console.log(`Timeline data for /${board}/ valid for ${validMinutesLeft > 0 ? validMinutesLeft : 0} more minutes`)
			if (Date.now() > validUntil) {
				console.log(`Requesting timeline for /${board}/ ${this.timeframe}`)
				//socket.emit("historyRequest", board, this.timeframe)
				this.requestTimeline(board, this.timeframe)
			} else {
				chartFunctions.addBoard(
					board,
					this.timeframe,
					this.history,
					this.maxEntries,
					this.weekProperty,
					this.smoothingLevel,
				)
			}
		},
		updateProperty(updates){
			//console.log("update",updates.timeframe)
			for(let key in updates){
				this[key] = updates[key]
			}
			for (let board of this.graphedBoards) {
				this.addBoardToTimeline(board)
			}
		},
		toggleBoard(board) {
			let index = this.graphedBoards.indexOf(board)
			if(index >= 0){
				this.graphedBoards.splice(index,1)
				chartFunctions.removeBoard(board)
			}else{
				this.graphedBoards.push(board)
				this.addBoardToTimeline(board)
			}
		}
	},
	created(){
		this.$store.subscribe(mutation => {
			if(mutation.type == "setEnabledBoards"){
				this.graphedBoards.forEach(board => {
					chartFunctions.removeBoard(board)
				})
				this.graphedBoards = []
			}
		})
		
		socket.on("boardUpdate",board => {
			if (this.graphedBoards.includes(board)) {
				const timelineData = this.history[this.timeframe][board] || {}
				timelineData.lastUpdate = Date.now()
				if(Date.now() > timelineData.validUntil || 0){
					console.log(`Automatically requesting timeline for /${board}/ ${this.timeframe}`)
					//socket.emit("historyRequest", board, this.timeframe)
					this.requestTimeline(board, this.timeframe)
				}
			}
		})
	},
	mounted() {
		chartFunctions.init("myChart")
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.component-chart {
  font-family: monospace;
  background: transparent;
  margin: 0;
  padding: 0;
  position: relative;
  z-index: 9;
}

.chart-title{
	color: $--colorTitle;
	margin: 0;
}

abbr {
  cursor: pointer;
}

.chart-wrapper {
  position: relative;
  min-height: 400px;
  background: $oc-gray-0;
  //box-shadow: 0px 8px 24px -4px rgba(0, 0, 0, 0.75);
}

.property-button-group {
  display: flex;
  flex-wrap: wrap;
  //justify-content: flex-start;
	justify-content: space-between;
  align-items: center;
  margin: 0;
  border-bottom: 1px solid #111;
}

.property-button-group>div{
	//margin-right: 2em;
	display: flex;
}

.board-button,
.property-button {
	position: relative;
  font-size: 0.75rem;
  color: $oc-gray-7;
	background-color: $oc-gray-0; //border-radius: 1px;
	overflow: hidden;
	z-index: 99;
}

.property-button {
  width: 8em;
  padding: 0.5em 0em;
}

.board-button-group {
	margin: 0 0;
	position: relative;
  display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
}

.board-button-wrapper {
	position: relative;
  padding: 0.625rem 0.3125rem 0;
}

.board-button {
	position: relative;
  padding: 0.5em 0.25em;
  flex: 1;
  width: 4rem;
  //box-shadow: 0px 8px 24px -4px rgba(0, 0, 0, 0.75);
}

.property-button:after,
.board-button:after {
  content: "";
	position: absolute;
	z-index: -5;
  bottom: 0px;
  left: 0px;
  min-height: 3px;
  width: 100%;
  background: $--colorHighlight;
  transform: translateY(3px);
  transition: transform 0.25s ease-out;
}

.board-button:after{
  min-height: 100%;
	transform: translateY(100%);
	background: $--colorSelected;
}



.button-selected{
	font-weight: bolder;
	color: $oc-gray-9;
}

.button-selected:after {
  content: "";
  transform: translateY(0px) !important;
}

.property-title{
	color: $oc-gray-0;
	padding: 0 0.25rem;
}
</style>