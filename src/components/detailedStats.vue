<template>
  <div class="component-detail has-text-centered">
    <div class="about">
      A work-in-progress to visualize analysis of 4chan board snapshots.<br>
      Meta analysis results are averaged snapshots from the last day. Text analysis results are taken from currently visible content and posts during the last day.
    </div>
    <div class="data-wrapper">

      
      <div class="sectionInteractions">
        <div v-for="entry in [
          ['X','xLinLog','linear','logarithmic','Linear','Log'],
          ['Y','yLinLog','linear','logarithmic','Linear','Log'],
          ['Dot','dot',true,false,'Yes','No'],
        ]" :key="entry[0]" class="chart-options-wrapper">
          <div class="optionTitle">{{ entry[0] }}</div>
          <div class="optionButtons buttons has-addons">
            <button :class="{'is-selected' : chartOptions[entry[1]] == entry[2]}" class="button" @click="setChartOptions(entry[1],entry[2])">{{ entry[4] }}</button>
            <button :class="{'is-selected' : chartOptions[entry[1]] == entry[3]}" class="button" @click="setChartOptions(entry[1],entry[3])">{{ entry[5] }}</button>
          </div>
        </div>

        <hr>
				
        <div class="optionTitle">Whitelist</div>
        <input v-model="boardWhitelist" class="input" placeholder="a,g,co,x,po..." @input="createChartData">
        <div class="optionTitle">Blacklist</div>
        <input v-model="boardBlacklist" class="input" placeholder="b,wg,cm,fit,trash..." @input="createChartData">
        
        <hr>

        <div class="optionTitle">Analyze Text</div>
        <div class="searchWrapper">
          <input v-model="analyzeWord" type="text" class="input" placeholder="3-20 characters" @keyup.enter="requestTextAnalysis(analyzeWord)">
          <button class="searchButton button" @click="requestTextAnalysis(analyzeWord)">🔎</button>
        </div>
        <label class="radio">
          <input type="radio" name="answer">
          Yes
        </label>
        <label class="radio">
          <input type="radio" name="answer">
          No
        </label>
        <p v-html="textAnalysisStatus"/>
      </div>
			
      <div class="sectionDataSources">
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

      <div class="sectionChart">
        <canvas id="detailChart"/>
      </div>

      <div class="sectionRanking is-hidden-touch is-hidden-desktop-only is-hidden-widescreen-only">
        <div class="rankingColumn">
          <div class="rankingTitle">x: {{ xData.name }}</div>
          <div class="rankEntries">
            <div v-for="(item,index) in xRankData" :key="item[0]" class="rankEntry">
              <div class="rankIndex">{{ String(index + 1).padStart(2,"0") }}</div>
              <div class="rankBoard">/{{ item[0] }}/</div>
              <div class="rankValue">{{ item[1] >= 1 ? item[1].toFixed(2) : item[1].toFixed(5) }}</div>
            </div>
          </div>
        </div>
        <div class="rankingColumn">
          <div class="rankingTitle">y: {{ yData.name }}</div>
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
			textAnalysisStatus: "",
			analyzeExactOnly: "true"
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
		requestTextAnalysis(word = ""){
			word = word.trim()
			if(word.length < 3 || word.length > 20){
				this.textAnalysisStatus = "word too short/long"
				return
			}
			this.analyzeWord = ""
			word = word.toLowerCase()
			word = word.replace(/>+\//g,"/")
			document.querySelector(".searchButton").classList.add("is-loading")
			this.textAnalysisStatus = "fetching..."
			axios.get(config.url + `/textAnalysis?word=${word}`)
				.then(response => {
					this.textAnalysisStatus = `Analyzed:<br>${response.data.commentsAnalyzed} posts<br>${response.data.charactersAnalyzed} chars`

					const analysis = response.data.analysis
					for(let board in analysis){
						let remoteKey,localKey
					
						remoteKey = "commentsAnalyzed"
						localKey = "posts analyzed"
						if(!this.textAnalysisLastDay[localKey]) this.textAnalysisLastDay[localKey] = {}
						this.textAnalysisLastDay[localKey][board] = analysis[board][remoteKey]
					
						remoteKey = "charactersAnalyzed"
						localKey = "characters analyzed"
						if(!this.textAnalysisLastDay[localKey]) this.textAnalysisLastDay[localKey] = {}
						this.textAnalysisLastDay[localKey][board] = analysis[board][remoteKey]
					
						remoteKey = "posts_ratio"
						localKey = remoteKey + "_" + word
						if(!this.textAnalysisLastDay[localKey]) this.textAnalysisLastDay[localKey] = {}
						this.textAnalysisLastDay[localKey][board] = analysis[board][remoteKey]

						remoteKey = "text_ratio"
						localKey = "char_ratio" + "_" + word
						if(!this.textAnalysisLastDay[localKey]) this.textAnalysisLastDay[localKey] = {}
						this.textAnalysisLastDay[localKey][board] = analysis[board][remoteKey]
					}
					this.textAnalysisLastDay = Object.assign({}, this.textAnalysisLastDay)
				})
				.catch(err => {
					console.error(err.message)
					this.textAnalysisStatus = "Response: " + err.response.status
				})
				.finally(()=>{
					document.querySelector(".searchButton").classList.remove("is-loading")
				})
		}
	},
	created(){
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
				this.yData={name: "OPLength_mean",data: this.metaAnalysisLastDay["OPLength_mean"]}
				this.xData={name: "postLength_mean",data: this.metaAnalysisLastDay["postLength_mean"]}
				this.createChartData()
			})
		//this.requestTextAnalysis("boomer")
	},
	mounted(){
		const Chart = require('chart.js')
		Chart.defaults.global.defaultFontFamily = 'monospace'
		//Chart.defaults.global.defaultFontSize = 16
		var ctx = document.getElementById("detailChart").getContext('2d')
		//const dataLabels = 

		this.chart = new Chart(ctx, {
			type: 'scatter',
			plugins: [require("chartjs-plugin-datalabels")],
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
	display: flex;
	position: relative;
	width: 100%;
	max-width: 1600px;
}

.sectionInteractions{
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 1rem;
	flex: none;
	width: 200px;

	.optionTitle{
		text-align: left;
		font-weight: bold;
		width: 32px;
		margin-left: 0.5rem;
		white-space: nowrap;
	}

	>hr{
		position: relative;
		background: rgba(0,0,0,0.67);
		width: 80%;
		height: 0px;
		margin: 2rem 0;
	}

	>.chart-options-wrapper{
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin: 0.5rem 0;
		>.optionTitle{
			margin: 0;
		}
		>.optionButtons{
			position: relative;
			width: 128px;
			margin: 0;
			>.button{
				width: 64px;
				margin: 0;
				height: 100%;
			}
		}
	}

	>.searchWrapper{
		display: flex;
		width: 100%;
		>input{
			flex-grow: 1;
		}
		>button{
			flex: none;
			width: 40px
		}
	}
}

.sectionDataSources{
	padding: 1rem;
	flex-shrink: 1;
	>.sourceItems{
		>.sourceItem{
			display: flex;
			>.sourceButton{
				flex: none;
				width: 20px;
			}
			>.sourceText{

			}
		}
	}
}

.sectionChart{
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

.sectionRanking{
	position: relative;
	padding: 1rem;
	height: 100%;
	flex: auto;
	display: flex;
	>.rankingColumn{
		position: relative;
		flex: none;
		width: 50%;
		>.rankingTitle{
			font-weight: bold;
			margin: 0.5rem;
			text-align: left;
			font-size: 12px;
			letter-spacing: -1px;
			white-space: nowrap;
			overflow: hidden;
		}

		>.rankEntries{
			width: 100%;
			min-height: 0px;
			border-left: 1px solid black;
			>.rankEntry{
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
		}


	}
}

.sourceCategory{
	text-align: left;
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
</style>