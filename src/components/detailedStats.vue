<template>
  <div class="component-detail has-text-centered">
    <div class="about">
      A work-in-progress to visualize analysis of 4chan board snapshots from the last day. (<a href="https://boards.4chan.org/sci/thread/9837467">https://boards.4chan.org/sci/thread/9837467</a>)<br>
      Meta analysis results are averaged snapshots from the last day. Text analysis results are taken from currently visible posts.
    </div>
    <div class="data-wrapper columns is-marginless">

      <div class="chartOptions column is-narrow">

        <div class="sourceCategory">x-Axis</div>
        <div class="optionButtons buttons has-addons">
          <button :class="{'is-selected' : chartOptions.xLinLog == 'linear'}" class="button" @click="setChartOptions('xLinLog','linear')">Linear</button>
          <button :class="{'is-selected' : chartOptions.xLinLog == 'logarithmic'}" class="button" @click="setChartOptions('xLinLog','logarithmic')">Log</button>
        </div>

        <div class="sourceCategory">y-Axis</div>
        <div class="optionButtons buttons has-addons">
          <button :class="{'is-selected' : chartOptions.yLinLog == 'linear'}" class="button" @click="setChartOptions('yLinLog','linear')">Linear</button>
          <button :class="{'is-selected' : chartOptions.yLinLog == 'logarithmic'}" class="button" @click="setChartOptions('yLinLog','logarithmic')">Log</button>
        </div>

        <div class="sourceCategory">Display Dot</div>
        <div class="optionButtons buttons has-addons">
          <button :class="{'is-selected' : chartOptions.dot}" class="button" @click="setChartOptions('dot',true)">Yes</button>
          <button :class="{'is-selected' : !chartOptions.dot}" class="button" @click="setChartOptions('dot',false)">No</button>
        </div>

        <div class="sourceCategory">whitelist</div>
        <input v-model="boardWhitelist" placeholder="a,g,co,x,po . . .">
        <div class="sourceCategory">blacklist</div>
        <input v-model="boardBlacklist" placeholder="b,wg,cm,fit,trash . . .">
        <button class="button" @click="createChartData">Filter</button>

        <div class="sourceCategory">Analyze Text</div>
        <input v-model="analyzeWord" placeholder="3-20 characters">
        <button class="button" @click="requestTextAnalysis(analyzeWord)">Analyze</button>
        <p>{{ errorMessage }}</p>
      </div>

      <div class="sectionDataSources column is-narrow">
        <div class="sourceCategory">Meta Analysis:</div>
        <div class="sourceItems">
          <div v-for="(item,key) in metaAnalysisLastDay" :key="key+'meta'" class="sourceItem">
            <div :class="{'is-selected' : xData.name == key}" class="sourceButton" @click="xData={name: key,data: item};createChartData()">x</div>
            <div :class="{'is-selected' : yData.name == key}" class="sourceButton" @click="yData={name: key,data: item};createChartData()">y</div>
            <div class="sourceText">{{ key }}</div>
          </div>
        </div>
        <div class="sourceCategory">Text Analysis:</div>
        <div class="sourceItems">
          <div v-for="(item,key) in textAnalysisLastDay" :key="key+'text'" class="sourceItem">
            <div :class="{'is-selected' : xData.name == key}" class="sourceButton" @click="xData={name: key,data: item};createChartData()">x</div>
            <div :class="{'is-selected' : yData.name == key}" class="sourceButton" @click="yData={name: key,data: item};createChartData()">y</div>
            <div class="sourceText">{{ key }}</div>
          </div>
        </div>
      </div>

      <div class="chart-wrapper column is-narrow">
        <canvas id="detailChart"/>
      </div>

      <div class="sectionRanking column is-narrow columns is-hidden-touch is-hidden-desktop-only is-hidden-widescreen-only">
        <div class="rankingColumn column is-6">
          <div class="rankingTitle">x->{{ xData.name }}</div>
          <div class="rankEntries">
            <div v-for="(item,index) in xRankData" :key="item[0]" class="rankEntry">
              <div class="rankIndex">{{ String(index + 1).padStart(2,"0") }}</div>
              <div class="rankBoard">/{{ item[0] }}/</div>
              <div class="rankValue">{{ item[1] >= 1 ? item[1].toFixed(2) : item[1].toFixed(5) }}</div>
            </div>
          </div>
        </div>
        <div class="rankingColumn column is-6">
          <div class="rankingTitle">y->{{ yData.name }}</div>
          <div class="rankEntries">
            <div v-for="(item,index) in yRankData" :key="item[0]" class="rankEntry">
              <div class="rankIndex">{{ String(index + 1).padStart(2,"0") }}</div>
              <div class="rankBoard">/{{ item[0] }}/</div>
              <div class="rankValue">{{ item[1] >= 1 ? item[1].toFixed(2) : item[1].toFixed(5) }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
const axios = require("axios")
const config = require("js/config")
export default {
	data(){
		return{
			textAnalysisLastDay: {},
			metaAnalysisLastDay: {},
			xData: {name: "", data: {}},
			yData: {name: "", data: {}},
			chart: null,
			chartOptions: {
				xLinLog: "linear",
				yLinLog: "linear",
				dot: true,
			},
			boardWhitelist: "",
			boardBlacklist: "",
			analyzeWord: "",
			errorMessage: ""
		}
	},
	computed:{
		xRankData(){
			if(!this.xData) return
			return Object.entries(this.xData.data).sort((x,y) => y[1] - x[1])
		},
		yRankData(){
			if(!this.yData) return
			return Object.entries(this.yData.data).sort((x,y) => y[1] - x[1])
		},
	},
	methods: {
		setChartOptions(option,value){
			this.chartOptions[option] = value
			this.chart.options.scales.xAxes[0].type = this.chartOptions.xLinLog
			this.chart.options.scales.yAxes[0].type = this.chartOptions.yLinLog
			if(this.chartOptions.dot){
				this.chart.options.plugins.datalabels.align = "end"
				this.chart.options.elements.point.radius = 2.5
				this.chart.options.elements.point.borderWidth = 1
			}else{
				this.chart.options.plugins.datalabels.align = "center"
				this.chart.options.elements.point.radius = 0
				this.chart.options.elements.point.borderWidth = 0
			}
			this.chart.update()
		},
		createChartData(){
			console.log("create")
			if(!this.xData.name || !this.yData.name) return
			this.chart.options.scales.xAxes[0].scaleLabel.labelString = this.xData.name
			this.chart.options.scales.yAxes[0].scaleLabel.labelString = this.yData.name
			
			const currData = this.chart.data
			if(!currData.datasets.length) currData.datasets[0] = {}

			currData.labels = []
			currData.datasets[0].label = `${this.xData.name} : ${this.yData.name} (${(new Date).toLocaleString("en-GB", { timeZone: 'UTC' })}UTC)`
			currData.datasets[0].data = []
			
			let index = 0
			for(let board in this.xData.data){
				if(this.boardWhitelist && !this.boardWhitelist.split(",").includes(board)) continue
				if(this.boardBlacklist.split(",").includes(board)) continue
				currData.labels[index] = board
				currData.datasets[0].data[index] = {
					x: this.xData.data[board],
					y: this.yData.data[board],
					label: board
				}
				index++
			}
			this.chart.update()
		},
		requestTextAnalysis(word){
			this.errorMessage = "fetching..."
			axios.get(config.url + `/textAnalysisVisible/${word}`)
				.then(response => {
					this.errorMessage = "all good"
					let i = 0
					for(let board in response.data){
						i++

						let remoteKey,localKey
						remoteKey = "text_ratio"
						localKey = remoteKey + "_" + word
						if(!this.textAnalysisLastDay[localKey]) this.textAnalysisLastDay[localKey] = {}
						this.textAnalysisLastDay[localKey][board] = response.data[board][remoteKey]
					
						remoteKey = "posts_ratio"
						localKey = remoteKey + "_" + word
						if(!this.textAnalysisLastDay[localKey]) this.textAnalysisLastDay[localKey] = {}
						this.textAnalysisLastDay[localKey][board] = response.data[board][remoteKey]
					}
					console.log("text i",i)
					this.textAnalysisLastDay = Object.assign({}, this.textAnalysisLastDay)
				})
				.catch(err => {
					console.error(err.message)
					this.errorMessage = "Response: " + err.response.status
				})
		}
	},
	created(){
		/*
		axios.get(config.url + `/textAnalysis`)
			.then(response => {
				const newObj = {}
				let i = 0
				for(let board in response.data){
					for(let key in response.data[board]){
						if(key.includes("created")) continue
						//if(key.includes("text_ratio_")) continue
						if(typeof response.data[board][key] == "object"){
							for(let subkey in response.data[board][key]){
								//if(subkey.includes("nigger") || subkey.includes("jew")) continue

								let keyToUse = key
								if(keyToUse == "text_ratio_") keyToUse = "text ratio "
								if(keyToUse == "posts_ratio_"){
									keyToUse = "% posts mention "
									response.data[board][key][subkey] *= 100
								}

								if(!newObj[`${keyToUse}'${subkey}'`]) newObj[`${keyToUse}'${subkey}'`] = {}
								newObj[`${keyToUse}'${subkey}'`][board] = response.data[board][key][subkey]
								i++
							}
						}else{
							if(!newObj[key]) newObj[key] = {}
							newObj[key][board] = response.data[board][key]
						}
					}
				}
				console.log("i",i)
				this.textAnalysisLastDay = newObj
			})
			*/
		axios.get(config.url + `/allBoardStats`)
			.then(response => {
				//const newObj = {}
				let i = 0
				for(let board in response.data){
					for(let remoteKey of ["avgPostsPerDay","topPPM"]){
						let localKey = remoteKey
						if(localKey == "topPPM") localKey = "dailyPeakPostsPerMinute"
						if(localKey == "avgPostsPerDay") localKey = "postsPerDay"
						if(!this.metaAnalysisLastDay[localKey]) this.metaAnalysisLastDay[localKey] = {}
						this.metaAnalysisLastDay[localKey][board] = response.data[board][remoteKey]
						i++
					}
				}
				console.log("allBoardStats i",i)
				this.metaAnalysisLastDay = Object.assign({}, this.metaAnalysisLastDay)
			})

		axios.get(config.url + `/metaAnalysis`)
			.then(response => {
				//const newObj = {}
				let i = 0
				for(let board in response.data){
					for(let remoteKey in response.data[board]){
						let localKey = remoteKey
						if(remoteKey.includes("created")) continue
						if(remoteKey.includes("_standardDeviation")) continue
						if(remoteKey.includes("_coefficientOfVariation")) continue
						//if(localKey == "postersPerThread_mean") localKey = "IPsPerThread_mean"
						//if(localKey == "postsPerPoster_mean") localKey = "postsPerIP_mean"
						if(!this.metaAnalysisLastDay[localKey]) this.metaAnalysisLastDay[localKey] = {}
						if(typeof response.data[board][remoteKey] == "object") response.data[board][remoteKey] = 0
						this.metaAnalysisLastDay[localKey][board] = response.data[board][remoteKey]
						i++
					}
				}
				console.log("meta i",i)
				this.metaAnalysisLastDay = Object.assign({}, this.metaAnalysisLastDay)
			})
		//this.requestTextAnalysis("boomer")
	},
	mounted(){
		const Chart = require('chart.js')
		Chart.defaults.global.defaultFontFamily = 'monospace'
		//Chart.defaults.global.defaultFontSize = 16
		var ctx = document.getElementById("detailChart").getContext('2d')
		const dataLabels = require("chartjs-plugin-datalabels")

		this.chart = new Chart(ctx, {
			type: 'scatter',
			plugins: [dataLabels],
			data: {
				labels: [],
				datasets: []
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				elements: {
					point: {
						radius: 2.5,
						hoverRadius: 4,
						hitRadius: 32,
						//backgroundColor: "#bbbbbb"
						backgroundColor: "rgba(94,129,172,1)",
						borderColor: "rgba(0,0,0,0.25)"
					}
				},
				scales: {
					yAxes: [{
						scaleLabel:{
							display: true,
							fontSize: 16
						}
					}],
					xAxes: [{
						scaleLabel:{
							display: true,
							fontSize: 16
						}
					}]
				},
				hover:{
					animationDuration: 500,
					mode: "nearest",
					axis: "xy"
				},
				plugins: {
					datalabels: {
						align	: 'end',
						//anchor : 'end',
						font: {
							family: "monospace",
							weight: "bold",
							size: 12
						}
					}
				},
			}
		})	
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";
.is-selected{
	background: #444;
	color: #f1f1f1;
}

.component-detail{
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f1f1f1;
	padding: 2rem;
  //background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
	
}

.about{
	font-size: 12px;
	margin-bottom: 1rem;
}

.data-wrapper{
	@include float-shadow-box;
}

.chartOptions{
	flex-shrink: 1;
	padding: 1rem;
	display: flex;
	flex-direction: column;
}

.chart-wrapper{
  position: relative;
	width: 800px;
	height: 800px;
	padding: 1rem;
	user-select: none;
	>canvas{
		position: relative;
		z-index: 20;
		width: 100%;
		height: 100%;
	}
}

.sectionDataSources{
	padding: 1rem;
}

.sourceCategory{
	font-weight: bold;
	margin: 0.5rem;
}

.sourceItem{
	position: relative;
	border: 1px solid black;
	border-top: 0;
	display:flex;
	&:first-child{
		border-top: 1px solid black;
	}

	>.sourceText{
		font-size: 12px;
		line-height: 20px;
		padding: 0 0.5rem;
	}
	>.sourceButton{
		border-right: 1px solid black;
		//height: 100%;
		font-size: 12px;
		line-height: 20px;
		width: 24px;
		cursor: pointer;
	}
}

.options{
	display: flex;
}

.sectionRanking{
	position: relative;
	height: 100%;
}

.rankingTitle{
	font-weight: bold;
	margin: 0.5rem;
	text-align: left;
	font-size: 12px;
	letter-spacing: -1px;
	white-space: nowrap;
	overflow: hidden;
}

.rankEntries{
	width: 160px;
	min-height: 100%;
	border: 1px solid black;
}

.rankEntry{
	display: flex;
	font-size: 12px;
	line-height: 12px;
	background: white;
	&:nth-child(2n){
		background: #eee;
	}
	>.rankIndex{
		width: 24px;
		text-align: left;
		padding: 0.25rem;
	}
	>.rankBoard{
		width: 48px;
		text-align: left;
		padding: 0.25rem;
	}
	>.rankValue{
		flex: 1 1 0;
		text-align: right;
		padding: 0.25rem;
	}
}
</style>