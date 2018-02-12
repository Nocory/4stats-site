<template>
  <div class="component">
    <h4 class="title is-size-4 headline">Board Timeline</h4>

    <div class="has-text-left property-title">Charting {{ chartOptions.term === "day" ? "posts/day" : chartOptions.hourProperty === "postsPerMinute" ? "posts/minute" : "relative activity" }}</div>

    <div class="property-button-wrapper">
      <div class="property-button-group">
        <a :class="{ 'button-selected': chartOptions.term == 'day'}" @click="setChartOption('term','day')">Daily</a>
        <a :class="{ 'button-selected': chartOptions.term == 'hour' }" @click="setChartOption('term','hour')"> Hourly</a>
      </div>

      <template v-if="chartOptions.term == 'day'">
        <div class="property-button-group">
          <a :class="{ 'button-selected': chartOptions.maxEntries.day == 9999 }" @click="setChartOption(['maxEntries','day'],9999)">All</a>
          <a :class="{ 'button-selected': chartOptions.maxEntries.day == 365 }" @click="setChartOption(['maxEntries','day'],365)">1 year</a>
          <a :class="{ 'button-selected': chartOptions.maxEntries.day == 183 }" @click="setChartOption(['maxEntries','day'],183)">6 months</a>
          <a :class="{ 'button-selected': chartOptions.maxEntries.day == 91 }" @click="setChartOption(['maxEntries','day'],91)">3 months</a>
        </div>
      </template>

      <template v-if="chartOptions.term == 'hour'">
        <div class="property-button-group">
          <a :class="{ 'button-selected': chartOptions.maxEntries.hour == 24 * 7 * 4 }" @click="setChartOption(['maxEntries','hour'],24 * 7 * 4)">4 weeks</a>
          <a :class="{ 'button-selected': chartOptions.maxEntries.hour == 24*7 }" @click="setChartOption(['maxEntries','hour'],24 * 7)">1 week</a>
          <a :class="{ 'button-selected': chartOptions.maxEntries.hour == 24 }" @click="setChartOption(['maxEntries','hour'],24)">1 day</a>
        </div>
        <div class="property-button-group">
          <a :class="{ 'button-selected': chartOptions.hourProperty == 'postsPerMinute' }" @click="setChartOption('hourProperty','postsPerMinute')">Posts/Minute</a>
          <abbr title="The boards posts-per-minute relative to its usual top ppm rate" :class="{ 'button-selected': chartOptions.hourProperty == 'activity' }" @click="setChartOption('hourProperty','activity')">Activity</abbr>
        </div>
        <div class="property-button-group">
          <a :class="{ 'button-selected': chartOptions.smoothingLevel == 0 }" @click="setChartOption('smoothingLevel',0)">Accurate</a>
          <a :class="{ 'button-selected': chartOptions.smoothingLevel == 3 }" @click="setChartOption('smoothingLevel',3)">Smooth</a>
          <a :class="{ 'button-selected': chartOptions.smoothingLevel == 6 }" @click="setChartOption('smoothingLevel',6)">Silky</a>
        </div>
      </template>
    </div>

    <div class="chart-wrapper">
      <canvas id="myChart"/>
    </div>

    <div class="board-button-group">
      <a class="board-button-wrapper" v-for="board in allBoards" :key="board" @click="toggleBoard(board)">
        <div class="board-button" :class="{'button-selected': graphedBoards.includes(board)}">/{{ board }}/</div>
      </a>
      <!--
      <a class="board-button-wrapper" @click="toggleBoard('combined')">
        <div class="board-button" :class="{'button-selected': graphedBoards.includes('combined')}">[ALL]</div>
      </a>
			-->
    </div>
  </div>
</template>

<script>
const axios = require("axios")
const pino = require("js/pino")
const config = require("js/config")
const chartFunctions = require("js/chartFunctions")
export default {
	data: () => ({
		chartOptions : {
			term: "day",
			hourProperty: "postsPerMinute",
			smoothingLevel: 3,
			maxEntries: {
				day: 9999,
				hour: 24*7
			}
		},
		history: {
			hour: {},
			day: {}
		},
		allBoards: config.allBoards,
		graphedBoards: []
	}),
	methods: {
		setChartOption(key,value){
			if(typeof key == "string"){
				this.chartOptions[key] = value
			}else{
				this.chartOptions[key[0]][key[1]] = value
			}
			for(let board of this.graphedBoards){
				this.checkIfRequestOrAdd(board)
				//chartFunctions.addBoard(board,this.history[this.chartOptions.term][board],this.chartOptions)
			}
		},
		toggleBoard(board) {
			let index = this.graphedBoards.indexOf(board)
			if(index >= 0){
				this.graphedBoards.splice(index,1)
				chartFunctions.removeBoard(board)
			}else{
				this.graphedBoards.push(board)
				this.checkIfRequestOrAdd(board)
			}
		},
		checkIfRequestOrAdd(board){
			let timelineData = this.history[this.chartOptions.term][board] || {}
			let validUntil = timelineData.validUntil || 0

			let validMinutesLeft = ((validUntil - Date.now()) / 60000).toFixed(2)
			pino.debug(`chart.vue toggleBoard: Data for /${board}/ valid for ${validMinutesLeft > 0 ? validMinutesLeft : 0} more minutes`)
			
			if (Date.now() > validUntil) {
				pino.debug(`chart.vue toggleBoard: Requesting timeline for /${board}/ ${this.chartOptions.term}`)
				this.requestTimeline(board, this.chartOptions.term)
			} else {
				chartFunctions.addBoard(board,timelineData.history,this.chartOptions)
			}
		},
		requestTimeline(board,term){
			//let url = board != 'combined' ? config.url + `/history/${term}/${board}` : config.url + `/combinedHistory/${term}`
			//axios.get(url)
			axios.get(config.url + `/history/${term}/${board}`)
				.then(response => {
					pino.debug("chart.vue requestTimeline %d",response.status, response.data)
					if(response.status == 200) this.processNewTimelineData(board,term,response.data)
				})
				.catch(error => {
					pino.error(error)
				})
		},
		processNewTimelineData(board, term, newData) {
			if(!newData || !newData.length) return pino.warn("chart.vue processNewTimelineData: history was empty")

			newData = newData.map(el => ({
				time: el[0],
				timeCovered: el[1],
				postCount: el[2],
				postsPerMinute: el[3]
			}))
			
			let historyData = {
				latestTime: newData[newData.length - 1].time,
				validUntil: Math.max(Date.now() + 1000*60*5,newData[newData.length - 1].time + (term == "hour" ? 1000*60*90 : 1000*60*60*48)) - 10000,
				history : newData.map(el => (
					{
						x: term == "hour" ? el.time : new Date(el.time).setHours(0,0,1,0),
						y: term == "hour" ? el.postsPerMinute : Math.round(el.postCount)
					}))
			}
			if(term == "day"){
				const lastEntry = historyData.history[historyData.history.length - 1]
				historyData.history.push({
					x: lastEntry.x + 1000 * 60 * 60 * 23.99,
					y: lastEntry.y
				})
			}
			this.history[term][board] = historyData
			
			chartFunctions.addBoard(board,historyData.history,this.chartOptions)
		}
	},
	mounted() {
		chartFunctions.init("myChart")

		this.$store.subscribe(mutation => {
			if(mutation.type == "updateBoardData"){
				if (this.graphedBoards.includes(mutation.payload.board)) {
					const timelineData = this.history[this.chartOptions.term][mutation.payload.board] || {}
					timelineData.lastUpdate = Date.now()
					if(Date.now() > timelineData.validUntil || 0){
						pino.debug(`chart.vue on boardUpdate: Automatically requesting timeline for /${mutation.payload.board}/ ${this.chartOptions.term}`)
						this.requestTimeline(mutation.payload.board, this.chartOptions.term)
					}
				}
			}
		})
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.headline{
	position: relative;
}

.headline:after{
	content: "since july 2017";
	font-size: 0.75rem;
	font-weight: normal;
	position: absolute;
	width: 100%;
	left: 0;
	top: calc(100% - 0.25rem);
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



.property-button-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #111;
}

.property-button-group{
	display: flex;
	border-right: 1px solid #333;
}

.property-button-group>*{
  width: 8em;
  padding: 0.5em 0em;
	position: relative;
  font-size: 0.75rem;
  color: $oc-gray-7;
	background-color: $oc-gray-0;
	overflow: hidden;
	z-index: 99;
}

.board-button-group {
	margin: 0 0;
	position: relative;
  display: flex;
	flex-wrap: wrap;
	justify-content: center;
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
  font-size: 0.75rem;
  color: $oc-gray-7;
	background-color: $oc-gray-0;
	overflow: hidden;
	z-index: 99;
	transition: color 0.25s ease-out;
	&.button-selected{
		color: $oc-gray-0;
	}
}

.property-button-group>*:after,
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