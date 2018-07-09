<template>
  <div class="component-detail has-text-centered">
    <div class="data-wrapper">
      <div class="chartOptions">
        <div class="axisTitle">X</div>
        <div class="optionButtons">
          <button :class="{'selected' : chartOptions.xLinLog == 'linear'}" class="button" @click="setChartOptions('xLinLog','linear')">Linear</button>
          <button :class="{'selected' : chartOptions.xLinLog == 'logarithmic'}" class="button" @click="setChartOptions('xLinLog','logarithmic')">Log</button>
        </div>
        <div class="axisTitle">Y</div>
        <div class="optionButtons">
          <button :class="{'selected' : chartOptions.yLinLog == 'linear'}" class="button" @click="setChartOptions('yLinLog','linear')">Linear</button>
          <button :class="{'selected' : chartOptions.yLinLog == 'logarithmic'}" class="button" @click="setChartOptions('yLinLog','logarithmic')">Log</button>
        </div>
        <div class="axisTitle">Dot</div>
        <div class="optionButtons">
          <button :class="{'selected' : chartOptions.dot}" class="button" @click="setChartOptions('dot',true)">Yes</button>
          <button :class="{'selected' : !chartOptions.dot}" class="button" @click="setChartOptions('dot',false)">No</button>
        </div>
      </div>
      <div class="chart-wrapper">
        <canvas id="detailChart"/>
      </div>
      <div class="dataSources">
        <div class="sourceCategory">Meta Analysis:</div>
        <div class="sourceItems">
          <div v-for="(item,key) in metaAnalysisLastDay" :key="key+'meta'" class="sourceItem">
            <div :class="{'selected' : xData.name == key}" class="sourceButton" @click="xData={name: key,data: item};createChartData()">x</div>
            <div :class="{'selected' : yData.name == key}" class="sourceButton" @click="yData={name: key,data: item};createChartData()">y</div>
            <div class="sourceText">{{ key }}</div>
          </div>
        </div>
        <div class="sourceCategory">Text Analysis (placeholder words):</div>
        <div class="sourceItems">
          <div v-for="(item,key) in textAnalysisLastDay" :key="key+'text'" class="sourceItem">
            <div :class="{'selected' : xData.name == key}" class="sourceButton" @click="xData={name: key,data: item};createChartData()">x</div>
            <div :class="{'selected' : yData.name == key}" class="sourceButton" @click="yData={name: key,data: item};createChartData()">y</div>
            <div class="sourceText">{{ key }}</div>
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
				dot: true
			}
		}
	},
	computed:{
		xRankData(){
			if(!this.xData) return
			return Object.entries(this.xData.data).sort((x,y) => y[1] - x[1]).slice(0,20)
		},
		yRankData(){
			if(!this.yData) return
			return Object.entries(this.yData.data).sort((x,y) => y[1] - x[1]).slice(0,20)
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
			if(!this.xData.name || !this.yData.name) return
			this.chart.options.scales.xAxes[0].scaleLabel.labelString = this.xData.name
			this.chart.options.scales.yAxes[0].scaleLabel.labelString = this.yData.name
			
			const currDatasets = this.chart.data.datasets
			if(!currDatasets.length){
				currDatasets[0] = {
					label: "`${this.xData.name} : ${this.yData.name}`",
					data: []
				}
				this.chart.data.datasets = currDatasets
			}
			
			currDatasets[0].label = `${this.xData.name} : ${this.yData.name}`
			let index = 0
			for(let board in this.xData.data){
				currDatasets[0].data[index] = {
					x: this.xData.data[board],
					y: this.yData.data[board],
					label: board
				}
				index++
			}
			this.chart.update()
		}
	},
	created(){
		axios.get(config.url + `/textAnalysisLastDay`)
			.then(response => {
				const newObj = {}
				let i = 0
				for(let board in response.data){
					for(let key in response.data[board]){
						if(key.includes("created")) continue
						if(key.includes("nigger")) continue
						if(key.includes("_coefficientOfVariation")) continue
						if(typeof response.data[board][key] == "object"){
							for(let subkey in response.data[board][key]){
								if(!newObj[key+subkey]) newObj[key+subkey] = {}
								newObj[key+subkey][board] = response.data[board][key][subkey]
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
		axios.get(config.url + `/metaAnalysisLastDay`)
			.then(response => {
				const newObj = {}
				let i = 0
				for(let board in response.data){
					for(let key in response.data[board]){
						if(key.includes("created")) continue
						if(key.includes("_standardDeviation")) continue
						if(key.includes("_coefficientOfVariation")) continue
						if(!newObj[key]) newObj[key] = {}
						i++
						newObj[key][board] = response.data[board][key]
					}
				}
				console.log("i",i)
				this.metaAnalysisLastDay = newObj
			})
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
.component-detail{
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f1f1f1;
  //background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
	
}

.data-wrapper{
	display: flex;
	@include float-shadow-box;
	margin: 1rem;
}

.optionButtons{
	>button{
		&.selected{
			background: #333;
			color: white;	
		}
	}
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

.dataSources{
	padding: 0 1rem;
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
		
		&.selected{
			background: #333;
			color: white;
		}
	}
}

.rankedData{
	>div{
		font-size: 12px;
		text-align: left;
	}
}

.options{
	display: flex;
}
</style>