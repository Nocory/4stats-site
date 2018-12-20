<template>
  <div class="chart-component">
    <div class="component__header is-hidden-mobile">
      Board Timeline (all times are UTC)
    </div>
    <div class="has-text-centered main">

      <div class="has-text-left property-title">Charting {{ chartOptions.term === "day" ? "posts/day" : chartOptions.hourProperty === "postsPerMinute" ? "posts/minute" : "relative activity" }}</div>

      <div class="property-button-wrapper">
        <div class="property-button-group">
          <a :class="{ 'button-selected': chartOptions.term == 'day'}" @click="setChartOption('term','day')">Daily</a>
          <a :class="{ 'button-selected': chartOptions.term == 'hour' }" @click="setChartOption('term','hour')"> Hourly</a>
        </div>

        <template v-if="chartOptions.term == 'day'">
          <div class="property-button-group property-button-group-day">
            <a :class="{ 'button-selected': chartOptions.yearRangePreset == 20 }" @click="setTimelineRange(20)">All</a>
            <a :class="{ 'button-selected': chartOptions.yearRangePreset == 5 }" @click="setTimelineRange(5)">5y</a>
            <a :class="{ 'button-selected': chartOptions.yearRangePreset == 3 }" @click="setTimelineRange(3)">3y</a>
            <a :class="{ 'button-selected': chartOptions.yearRangePreset == 1 }" @click="setTimelineRange(1)">1y</a>
            <a :class="{ 'button-selected': chartOptions.yearRangePreset == 0.5 }" @click="setTimelineRange(0.5)">6m</a>
          </div>
					<input type="date" v-model=dateStartString @input="setTimelineRange()">
					<input type="date" v-model=dateEndString @input="setTimelineRange()">
        </template>

        <template v-if="chartOptions.term == 'hour'">
          <div class="property-button-group">
            <a :class="{ 'button-selected': chartOptions.dayRangePreset == 28 }" @click="setChartOption('dayRangePreset',28)">4w</a>
            <a :class="{ 'button-selected': chartOptions.dayRangePreset == 7 }" @click="setChartOption('dayRangePreset',7)">1w</a>
            <a :class="{ 'button-selected': chartOptions.dayRangePreset == 1 }" @click="setChartOption('dayRangePreset',1)">1d</a>
          </div>
          <div class="property-button-group">
            <a :class="{ 'button-selected': chartOptions.hourProperty == 'postsPerMinute' }" @click="setChartOption('hourProperty','postsPerMinute')">Posts/Minute</a>
            <a :class="{ 'button-selected': chartOptions.hourProperty == 'activity' }" @click="setChartOption('hourProperty','activity')">Activity</a>
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

      <div class="board-buttons" >
        <!--
      <div
        v-for="board in allBoards"
        :key="board"
        :class="{'button-selected': graphedBoards.includes(board)}"
        class="board-buttons__button"
        @click="toggleBoard(board)">
        /{{ board }}/
      </div>
			-->
        <div v-for="board in allBoards" :key="board" class="button-padder" @click="toggleBoard(board)">
          <div :class="{'button-selected': graphedBoards.includes(board)}" class="board-button">/{{ board }}/</div>
        </div>
      </div>
    <!--
      <a class="board-buttons" @click="toggleBoard('combined')">
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
		dateStartString: "",
		dateEndString: "",
		chartOptions : {
			term: "day",
			yearRangePreset: 3,
			dayRangePreset: 7,
			hourProperty: "postsPerMinute",
			smoothingLevel: 3,
			dateStart: new Date(),
			dateEnd: new Date()
		},
		history: {
			hour: {},
			day: {}
		},
		allBoards: config.allBoards,
		graphedBoards: []
	}),
	methods: {
		setTimelineRange(range){
			if(range){
				const now = new Date
				this.dateEndString = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2,'0')}-${now.getUTCDate().toString().padStart(2,'0')}`
				now.setUTCDate(now.getUTCDate() - (this.chartOptions.term == "day" ? 365 : 1) * range)
				this.dateStartString = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2,'0')}-${now.getUTCDate().toString().padStart(2,'0')}`
			}
			
			let splitStringDate = this.dateEndString.split("-")
			this.chartOptions.dateEnd.setUTCFullYear(splitStringDate[0],splitStringDate[1] - 1,splitStringDate[2],0,0)
			splitStringDate = this.dateStartString.split("-")
			this.chartOptions.dateStart.setUTCFullYear(splitStringDate[0],splitStringDate[1] - 1,splitStringDate[2],0,0)

			if(this.chartOptions.term == "day"){
				this.chartOptions.yearRangePreset = range
			}else{
				this.chartOptions.dayRangePreset = range
			}

			for(let board of this.graphedBoards){
				this.checkIfRequestOrAdd(board)
			}
		},
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
				if(this.graphedBoards.length >= 8) return
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
						//x: term == "hour" ? el.time : new Date(el.time).setHours(0,0,1,0),
						x: el.time,
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

		this.setTimelineRange(3)
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.chart-component{
	//background: #222;
	@include float-shadow-box;
}

.component__header{
  background: rgba(0,0,0,0.8);
  color: $oc-gray-4;
  padding: 0rem 0.5rem;
  line-height: 2.25rem;
  text-align: left;
  font-weight: bold;
}

.main{
  background: $--color-highlight-2;
  //background: rgba(0,0,0,0.3);
}

abbr {
  cursor: pointer;
}

.property-button-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
	align-items: center;
	padding-left: 3rem;
	//margin-bottom: -1rem;
	>.property-button-group{
		display: flex;
		//background-color: $--color-highlight-2;
		//background-color: transparent;
		//background-color: rgba(255,255,255,0.05);
		//background-color: rgba(0,0,0,0.2);
		background-color: $--color-highlight-1;
		border: 1px solid $oc-gray-7;
		//@include float-shadow-box;
		//box-shadow: 0px 0px 8px rgba(255,255,255,0.1);

		
		//background-color: $oc-gray-6;
		//border-right: 2px solid $oc-gray-6;
		margin-right: 1rem;
		//border-right: 8px solid rgba(200,200,255,0.25);
		user-select: none;
		+.property-button-group-day>a{
			width: 4em !important;
		}
		>a{
			width: 8em;
			padding: 0.5em 0em;
			position: relative;
			font-size: 0.75rem;
			color: $--color-text;
			overflow: hidden;
			z-index: 99;
		}
	}
	>input{
		margin-right: 1rem;
		background-color: $--color-highlight-1;
		border: 1px solid $oc-gray-7;
		width: 10em;
		padding: 0.5em 0em;
		position: relative;
		font-size: 0.75rem;
		color: $--color-text;
		overflow: hidden;
		z-index: 99;
	}
}

.chart-wrapper {
  position: relative;
  min-height: 400px;
	//background: linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%);
	//background: linear-gradient(to top, #c4c5c7 0%, #dcdddf 52%, #ebebeb 100%);
	//background: #e9ecef;
	//background: $--color-highlight-1;
	user-select: none;
	padding: 0.5rem 0 0.5rem;
	&:after{
		z-index: -10;
		position: absolute;
		top: -40%;
		left: -50%;
		width: 200%;
		height: 170%;
		//background: radial-gradient(closest-side, rgba(255, 255, 255, 0.05) 50%, rgba(255,255,255,0) 75%);
		content: "";
	}
	>canvas{
		position: relative;
		z-index: 20;
	}
}

.board-buttons {
	position: relative;
  display: flex;
	flex-wrap: wrap;
	justify-content: center;
	user-select: none;
	padding: 0 0 0.5rem;
	>.button-padder{
		padding: 0.3125rem 0.3125rem;
		cursor: pointer;
		>.board-button {
			position: relative;
			padding: 0.5em 0.25em;
			width: 4rem;
			font-size: 0.75rem;
			color: $--color-text;
			background-color: $--color-highlight-1;
			overflow: hidden;
			z-index: 99;
			transition: color 0.25s ease-out;
			border: 1px solid $oc-gray-7;
			//@include float-shadow-box;
			&.button-selected{
				font-weight: bolder;
				color: $oc-gray-7;
			}
		}
	}
}

.property-button-group>a:after,
.board-button:after {
  content: "";
	position: absolute;
	z-index: -5;
  bottom: 0px;
  left: 0px;
  min-height: 3px;
  width: 100%;
  background: $--color-background-selected;
  transform: translateY(3px);
  transition: transform 0.25s ease-out;
}

.board-button:after{
  min-height: 100%;
	transform: translateY(100%);
}

.button-selected:after {
  content: "";
  transform: translateY(0px) !important;
}

.property-title{
	color: $oc-gray-0;
	padding: 0.5rem;
	
	padding-left: 3rem;
}
</style>