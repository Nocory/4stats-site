<template>
  <div class="component-detail has-text-centered">
    <div class="data-wrapper">
      <div class="chartOptions">
        chart options go here
      </div>
      <div class="chart-wrapper">
        <canvas id="detailChart"/>
        <div class="options"/>
      </div>
      <div class="dataSources">
        <div class="sourceCategory">Meta Analysis:</div>
        <div class="sourceItems">
          <div v-for="(item,key) in metaAnalysisLastDay" :key="key+'meta'" class="sourceItem">
            <div class="sourceText">{{ key }}</div>
            <div :class="{'selected' : xData.name == key}" class="sourceButton" @click="xData={name: key,data: item};createChartData()"/>
            <div :class="{'selected' : yData.name == key}" class="sourceButton" @click="yData={name: key,data: item};createChartData()"/>
          </div>
        </div>
        <div class="sourceCategory">Text Analysis:</div>
        <div class="sourceItems">
          <div v-for="(item,key) in textAnalysisLastDay" :key="key+'text'" class="sourceItem">
            <div class="sourceText">{{ key }}</div>
            <div :class="{'selected' : xData.name == key}" class="sourceButton" @click="xData={name: key,data: item};createChartData()"/>
            <div :class="{'selected' : yData.name == key}" class="sourceButton" @click="yData={name: key,data: item};createChartData()"/>
          </div>
        </div>
      </div>
      <!--
      <div class="rankedData">
        <div>X: {{ xData.name }}</div>
        <div v-for="(value,index) in xRankData" :key="value[0]" class="dataEntry">{{ index+1 }} /{{ value[0] }}/ {{ value[1] }}</div>
      </div>
      <div class="rankedData">
        <div>Y: {{ yData.name }}</div>
        <div v-for="(value,index) in yRankData" :key="value[0]" class="dataEntry">{{ index+1 }} /{{ value[0] }}/ {{ value[1] }}</div>
      </div>
			-->
    </div>
    <!--
    <div class="options">
      <div class="xOptions">
        <div>X property:</div>
        <div>Text Analysis:</div>
        <div v-for="(item,key) in textAnalysisLastDay" :key="key+'text'" @click="xData={name: key,data: item};createChartData()">{{ key }}</div>
        <div>Meta Analysis:</div>
        <div v-for="(item,key) in metaAnalysisLastDay" :key="key+'meta'" @click="xData={name: key,data: item};createChartData()">{{ key }}</div>
      </div>
      <div class="yOptions">
        <div>Y property:</div>
        <div>Text Analysis:</div>
        <div v-for="(item,key) in textAnalysisLastDay" :key="key+'text'" @click="yData={name: key,data: item};createChartData()">{{ key }}</div>
        <div>Meta Analysis:</div>
        <div v-for="(item,key) in metaAnalysisLastDay" :key="key+'meta'" @click="yData={name: key,data: item};createChartData()">{{ key }}</div>
      </div>
    </div>
		-->
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
			chart: null
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
		createChartData(){
			if(!this.xData.name || !this.yData.name) return
			this.chart.options.scales.xAxes[0].scaleLabel.labelString = this.xData.name
			this.chart.options.scales.yAxes[0].scaleLabel.labelString = this.yData.name
			const newData = {
				labels: [],
				datasets: [{
					label: `${this.xData.name} : ${this.yData.name}`,
					data: []
				}]
			}
			for(let board in this.xData.data){
				newData.labels.push(board)
				newData.datasets[0].data.push({
					x: this.xData.data[board],
					y: this.yData.data[board],
					label: board
				})
			}
			this.chart.data =	newData
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
						radius: 2,
						hoverRadius: 4,
						hitRadius: 32,
						//backgroundColor: "#bbbbbb"
						backgroundColor: "rgba(0,0,0,0.25)",
						borderColor: "rgba(0,0,0,0.75)"
					}
				},
				scales: {
					yAxes: [{
						scaleLabel:{
							display: true,
							fontSize: 16
						},
						ticks: {
							//beginAtZero:true
						}
					}],
					xAxes: [{
						scaleLabel:{
							display: true,
							fontSize: 16
						},
						ticks: {
							//fontColor: "rgba(32,32,32,0.75)",
							//beginAtZero:true
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
							size: 14
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
	&:first-child{
		border-top: 1px solid black;
	}

	>.sourceText{
		/*
		position: absolute;
		top:0;
		left: 0;
		*/
		font-size: 12px;
		line-height: 20px;
	}
	>.sourceButton{
		z-index: 99;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 50%;
		cursor: pointer;
		&.selected{
			background: linear-gradient(to right, rgba(64,64,255,0.5), rgba(64,64,255,0) 25% )
		}
	}
	>.sourceButton+.sourceButton{
		left: 50%;
		&.selected{
			background: linear-gradient(to left, rgba(255,64,64,0.5), rgba(255,64,64,0) 25% )
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