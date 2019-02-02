<template>
  <div class="chart-component">
    <div class="component-title is-hidden-mobile">
      Board Timeline (all times are UTC)
    </div>
    <div class="component-content">

      <div class="property-title">Charting {{ activeOptions.term === "day" ? "posts/day" : activeOptions.property === "postsPerMinute" ? "posts/minute" : "relative activity" }}</div>

      <div class="property-button-wrapper">
        <div class="property-button-group">
          <a :class="{ 'button-selected': activeOptions.term == 'day'}" @click="setActiveTerm('dayOptions')">Daily</a>
          <a :class="{ 'button-selected': activeOptions.term == 'hour' }" @click="setActiveTerm('hourOptions')"> Hourly</a>
          <a :class="{ 'button-selected': activeOptions.term == 'cycle' }" @click="setActiveTerm('cycleOptions')"> Cycle</a>
        </div>

        <template v-if="activeOptions.term == 'day'">
          <div class="property-button-group property-button-group-day">
            <a :class="{ 'button-selected': activeOptions.days == 365*20 }" @click="setChartOption('days',365*20)">All</a>
            <a :class="{ 'button-selected': activeOptions.days == 365*5 }" @click="setChartOption('days',365*5)">5y</a>
            <a :class="{ 'button-selected': activeOptions.days == 365*3 }" @click="setChartOption('days',365*3)">3y</a>
            <a :class="{ 'button-selected': activeOptions.days == 365*1 }" @click="setChartOption('days',365*1)">1y</a>
            <a :class="{ 'button-selected': activeOptions.days == 365*0.5 }" @click="setChartOption('days',365*0.5)">6m</a>
          </div>
					<input type="date" v-model=activeOptions.dateStartString @input="setTimelineRange()">
					<input type="date" v-model=activeOptions.dateEndString @input="setTimelineRange()">
        </template>

        <template v-if="activeOptions.term == 'hour'">
          <div class="property-button-group property-button-group-day">
            <a :class="{ 'button-selected': activeOptions.days == 28 }" @click="setChartOption('days',28)">4w</a>
            <a :class="{ 'button-selected': activeOptions.days == 7 }" @click="setChartOption('days',7)">1w</a>
            <a :class="{ 'button-selected': activeOptions.days == 3 }" @click="setChartOption('days',3)">3d</a>
          </div>
          <div class="property-button-group">
            <a :class="{ 'button-selected': activeOptions.property == 'postsPerMinute' }" @click="setChartOption('property','postsPerMinute')">Posts/Minute</a>
            <a :class="{ 'button-selected': activeOptions.property == 'activity' }" @click="setChartOption('property','activity')">Activity</a>
          </div>
          <div class="property-button-group">
            <a :class="{ 'button-selected': activeOptions.smoothingLevel == 0 }" @click="setChartOption('smoothingLevel',0)">Accurate</a>
            <a :class="{ 'button-selected': activeOptions.smoothingLevel == 3 }" @click="setChartOption('smoothingLevel',3)">Smooth</a>
            <a :class="{ 'button-selected': activeOptions.smoothingLevel == 6 }" @click="setChartOption('smoothingLevel',6)">Silky</a>
          </div>
        </template>

        <template v-if="activeOptions.term == 'cycle'">
          <div class="property-button-group property-button-group-day">
            <a :class="{ 'button-selected': activeOptions.days == 3 }" @click="setChartOption('days',3)">3d</a>
            <a :class="{ 'button-selected': activeOptions.days == 1 }" @click="setChartOption('days',1)">1d</a>
          </div>
          <div class="property-button-group">
            <a :class="{ 'button-selected': activeOptions.property == 'postsPerMinute' }" @click="setChartOption('property','postsPerMinute')">Posts/Minute</a>
            <a :class="{ 'button-selected': activeOptions.property == 'activity' }" @click="setChartOption('property','activity')">Activity</a>
          </div>
          <div class="property-button-group">
            <a :class="{ 'button-selected': activeOptions.smoothingLevel == 0 }" @click="setChartOption('smoothingLevel',0)">Accurate</a>
            <a :class="{ 'button-selected': activeOptions.smoothingLevel == 3 }" @click="setChartOption('smoothingLevel',3)">Smooth</a>
            <a :class="{ 'button-selected': activeOptions.smoothingLevel == 6 }" @click="setChartOption('smoothingLevel',6)">Silky</a>
          </div>
        </template>

        <div class="property-button-group">
          <a :class="{ 'button-selected': activeOptions.yIsLimited}" @click="toggleYLimit">Limit y-axis</a>
        </div>
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
          <!--<div :class="{'button-selected': graphedBoards.includes(board)}" class="board-button">/{{ board }}/</div>-->
					<div :class="{'button-selected': graphedBoards.includes(board)}" class="board-button">{{ board == "s4s" ? "[s4s]" : "/"+board+"/" }}</div>
        </div>
        <div class="button-padder" @click="toggleBoard('all')">
          <!--<div :class="{'button-selected': graphedBoards.includes(board)}" class="board-button">/{{ board }}/</div>-->
					<div :class="{'button-selected': graphedBoards.includes('all')}" class="board-button">/all/</div>
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
import axios from "axios"
import pino from "js/pino"
import config from "js/config"
import chartFunctions from "js/chartFunctions"
export default {
	data: () => ({
		activeOptions: {},
		dayOptions: {
			term: "day",
			days: 365,
			dateStartString: "",
			dateEndString: "",
			dateStart: new Date(),
			dateEnd: new Date(),
			yIsLimited: false
		},
		hourOptions: {
			term: "hour",
			days: 7,
			smoothingLevel: 3,
			property: "postsPerMinute"
		},
		cycleOptions: {
			term: "cycle",
			days: 3,
			smoothingLevel: 0,
			property: "postsPerMinute"
		},
		history: {
			cycle: {},
			hour: {},
			day: {}
		},
		allBoards: config.allBoards,
		graphedBoards: []
	}),
	methods: {
		setTimelineRange(days){
			if(days){
				const now = new Date
				this.activeOptions.dateEndString = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2,'0')}-${now.getUTCDate().toString().padStart(2,'0')}`
				now.setUTCDate(now.getUTCDate() - days)
				this.activeOptions.dateStartString = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2,'0')}-${now.getUTCDate().toString().padStart(2,'0')}`
			}
			
			let splitStringDate = this.activeOptions.dateEndString.split("-")
			this.activeOptions.dateEnd.setUTCFullYear(splitStringDate[0],splitStringDate[1] - 1,splitStringDate[2],0,0)
			splitStringDate = this.activeOptions.dateStartString.split("-")
			this.activeOptions.dateStart.setUTCFullYear(splitStringDate[0],splitStringDate[1] - 1,splitStringDate[2],0,0)

			if(days){
				this.activeOptions.days = days
			}else{
				this.activeOptions.days = (this.activeOptions.dateEnd.getTime() - this.activeOptions.dateStart.getTime()) / (1000 * 60 * 60 * 24)
			}

			for(let board of this.graphedBoards) this.checkIfRequestOrAdd(board)
		},
		setActiveTerm(termOptions){
			this.activeOptions = this[termOptions]
			for(let board of this.graphedBoards) this.checkIfRequestOrAdd(board)
		},
		setChartOption(key,value){
			this.activeOptions[key] = value
			if(this.activeOptions.term == "day" && key == "days"){
				this.setTimelineRange(value)
			}else{
				for(let board of this.graphedBoards) this.checkIfRequestOrAdd(board)
			}
		},
		toggleBoard(board) {
			let index = this.graphedBoards.indexOf(board)
			if(index >= 0){
				this.graphedBoards.splice(index,1)
				chartFunctions.removeBoard(board)
				chartFunctions.updateChart(this.activeOptions)
			}else{
				if(this.graphedBoards.length >= 8) return
				this.graphedBoards.push(board)
				this.checkIfRequestOrAdd(board)
			}
		},
		checkIfRequestOrAdd(board){
			let timelineData = this.history[this.activeOptions.term][board] || {}
			let validUntil = timelineData.validUntil || 0

			let validMinutesLeft = ((validUntil - Date.now()) / 60000).toFixed(2)
			pino.debug(`chart.vue toggleBoard: Data for /${board}/ valid for ${validMinutesLeft > 0 ? validMinutesLeft : 0} more minutes`)
			
			if (Date.now() > validUntil) {
				pino.debug(`chart.vue toggleBoard: Requesting timeline for /${board}/ ${this.activeOptions.term}`)
				this.requestTimeline(board, this.activeOptions.term)
			} else {
				chartFunctions.addBoard(board,timelineData.history,this.activeOptions)
				chartFunctions.updateChart(this.activeOptions)
			}
		},
		requestTimeline(board,term){
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
			if(!newData || !newData.length){
				chartFunctions.removeBoard(board)
				pino.warn("chart.vue processNewTimelineData: history was empty")
				return
			}

			newData = newData.map(el => ({
				time: el[0],
				timeCovered: el[1],
				postCount: el[2],
				postsPerMinute: term == "cycle" ? el[2]/(el[1] / 60000) : el[3]
			}))
			
			let historyData = {
				latestTime: newData[newData.length - 1].time,
				validUntil: Math.max(Date.now() + 1000*60*1,newData[newData.length - 1].time + (term == "cycle" ? 1000*60*5 : term == "hour" ? 1000*60*90 : 1000*60*60*48)) - 10000,
				history : newData.map(el => (
					{
						//x: term == "hour" ? el.time : new Date(el.time).setHours(0,0,1,0),
						x: el.time,
						y: term == "day" && el.postCount ? Math.round(el.postCount) : el.postsPerMinute
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
			
			chartFunctions.addBoard(board,historyData.history,this.activeOptions)
			chartFunctions.updateChart(this.activeOptions)
		},
		toggleYLimit(){
			this.activeOptions.yIsLimited = !this.activeOptions.yIsLimited
			chartFunctions.updateChart(this.activeOptions)
		}
	},
	created(){
		this.activeOptions = this.dayOptions
		this.setTimelineRange(this.activeOptions.days)
	},
	mounted() {
		chartFunctions.init("myChart")

		this.$store.subscribe(mutation => {
			if(mutation.type == "updateBoardData"){
				if (this.graphedBoards.includes(mutation.payload.board)) {
					const timelineData = this.history[this.activeOptions.term][mutation.payload.board] || {}
					timelineData.lastUpdate = Date.now()
					if(Date.now() > timelineData.validUntil || 0){
						pino.debug(`chart.vue on boardUpdate: Automatically requesting timeline for /${mutation.payload.board}/ ${this.activeOptions.term}`)
						this.requestTimeline(mutation.payload.board, this.activeOptions.term)
					}
				}
			}
		})
	}
}
</script>

<style scoped lang="scss">

.chart-component{
	//background: #222;
	@include float-shadow-box;
}

.component-content{
	text-align: center;
}

.property-button-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
	align-items: center;
	padding-left: 3rem;
	>.property-button-group{
		cursor: pointer;
		display: flex;
		background-color: $--background-content-2n;
		border: 1px solid $oc-gray-6;
		margin-right: 1rem;
		+.property-button-group-day>a{
			width: 4em !important;
		}
		>a{
			width: 8em;
			padding: 0.5em 0em;
			position: relative;
			font-size: 0.75rem;
			overflow: hidden;
			z-index: 99;
		}
	}
	>input{
		margin-right: 1rem;
		background-color: $--background-content-2n;
		border: 1px solid $oc-gray-6;
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
	padding: 0.5rem 0 0.5rem;
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
			background-color: $--background-content-2n;
			overflow: hidden;
			z-index: 99;
			transition: color 0.25s ease-out;
			border: 1px solid $oc-gray-6;
			&.button-selected{
				font-weight: bolder;
				color: $--background-content-2n;
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
  background: $--color-selected-background;
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
	text-align: left;
	color: $--color-text;
	padding: 0.5rem;
	
	padding-left: 3rem;
}
</style>