import momenttz from './moment-timezone-with-data-custom.js'
window.moment = momenttz
window.moment.tz.setDefault("UTC")

const Chart = require('chart.js/dist/Chart.js')
//import Chart from 'chart.js/dist/Chart.js'
//import Chart from 'chart.js';
Chart.defaults.global.defaultFontFamily = 'monospace'
Chart.defaults.global.defaultFontSize = 14
import store from "../store/index"

let chart = null

let availableColors = [
	"#212529", // black
	"#5e81ac", // blue
	"#bf616a", //red
	"#2f9e44", //green
	"#f59f00", //yellow
	"#666", //gray
	"#5f3dc4",
	"#38d9a9",
]

let newDataSets = []

Chart.pluginService.register({
	beforeDraw: function (chart) {
		const backgroundColor = chart.config.options.chartArea.backgroundColor
		if (backgroundColor) {
			const ctx = chart.chart.ctx
			const chartArea = chart.chartArea
			ctx.fillStyle = backgroundColor
			ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top)
		}
	}
})

const init = id => {
	chart = new Chart(id, {
		type: 'line',
		data: {
			datasets: []
		},
		options: {
			responsive: true,
			chartArea: {
				backgroundColor: '#e9ecef'
			},
			maintainAspectRatio: false,
			hover:{
				animationDuration: 500,
				mode: "nearest",
				axis: "xy"
			},
			legend: {
				labels: {
					fontColor: '#f8f9fa'
				}
			},
			tooltips: {
				caretPadding: 8,
				callbacks: {
					label: function(tooltipItem, data) {
						return `/${data.datasets[tooltipItem.datasetIndex].label}/ ${tooltipItem.yLabel.toFixed(2)}`
					},
					labelColor: function(tooltipItem) {
						return {
							//borderColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor,
							borderColor: "#fafafa",
							backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor,
						}
					}
				}
			},
			elements: {
				line: {
					borderWidth: 1.25,
					fill: false,
					spanGaps: false,
					borderCapStyle: "round"
				},
				point: {
					radius: 0,
					hoverRadius: 4,
					hitRadius: 32
				}
			},
			scales: {
				xAxes: [{
					type: 'time',
					time: {
						stepSize: 1,
						tooltipFormat: 'MMM Do, h:mma',
						displayFormats: {
							hour: 'hA',
							day: 'MMMD',
							week: 'MMMD',
						},
						isoWeekday: true
					},
					ticks: {
						fontColor: "rgba(255,255,255,0.75)"
					},
					gridLines: {
						color: "rgba(0,0,0,0.15)"
					},
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
						fontColor: "rgba(255,255,255,0.75)"
					},
					gridLines: {
						color: "rgba(0,0,0,0.15)"
					},
				}]
			}
		}
	})
	return chart
}
// 87000, 219000, 8200
let updateChart = (options,updateTime = 0) => {
	if(options.yIsLimited){
		const sortedNewDataSets = newDataSets.reduce((acc,val) => [...acc,val.data.slice().sort((a,b) => a.y - b.y)],[])
		const maxY = sortedNewDataSets.reduce((acc,val) => Math.max(acc,val[val.length - 1].y),0)
		let maxToUse = 1
		console.log(sortedNewDataSets.length)
		for(let sortedValues of sortedNewDataSets){
			const newMax = Math.max(sortedValues[Math.floor(sortedValues.length * 0.5)].y * 2,sortedValues[Math.floor(sortedValues.length * 0.98)].y)
			maxToUse = Math.max(maxToUse,newMax)
			console.log(maxToUse,maxY)
		}
		if(maxToUse < maxY){
			chart.options.scales.yAxes[0].ticks.max = Math.round(maxToUse)
		}else{
			chart.options.scales.yAxes[0].ticks.max = undefined
		}
	}else{
		chart.options.scales.yAxes[0].ticks.max = undefined
	}
	
	chart.data.datasets = newDataSets
	
	chart.update(updateTime)
}

let addBoard = (board, history, options) => {
	const timeRange = options.term == "day" ? {
		min: options.dateStart.getTime(),
		max: options.dateEnd.getTime()
	} : {
		min: Date.now() - 1000 * 60 * 60 * 24 * options.days,
		max: Date.now()
	}
	let chartThis = history.filter(el => el.x > timeRange.min && el.x < timeRange.max)
	//let chartThis = history.slice(-100)
	//let chartThis = history

	chart.options.elements.line.stepped = options.term == "day"
	chart.options.elements.line.cubicInterpolationMode = options.term == "hour" ? "default" : "monotone"

	let timeUnit = "day"

	if(options.days >= 0) timeUnit = "hour"
	if(options.days >= 3) timeUnit = "day"
	if(options.days >= 28) timeUnit = "week"
	if(options.days >= 365) timeUnit = "month"
	if(options.days > 365 * 2) timeUnit = "year"

	chart.options.scales.xAxes[0].time.unit = timeUnit

	//chart.options.scales.xAxes[0].time.min = options.dateStart
	//chart.options.scales.xAxes[0].time.max = options.dateEnd

	if(options.property == "activity"){
		chartThis = board == "all" ? [] : chartThis.map(el => ({x: el.x, y: el.y ? el.y * 100 / store.state.boardData[board].topPPM : el.y}))
	}
	
	if(options.smoothingLevel){
		let maxVariance = chartThis.reduce((totalY, entry) => totalY + entry.y, 0) / chartThis.length
		maxVariance *= 0.01 + 0.01 / options.smoothingLevel //TODO: find best values
		for (let i = 0; i < options.smoothingLevel; i++) {
			let smoothedHistory = []
			for (let i = 0; i < chartThis.length; i++) {
				if (i == 0 || i == chartThis.length - 1 || !chartThis[i].y) {
					smoothedHistory.push({
						x: chartThis[i].x,
						y: chartThis[i].y
					})
				} else {
				//let maxVariance = Math.min(history[i - 1].y, history[i].y, history[i + 1].y) * ((0.04 / smoothingLevel) + 0.02)
					let oldY = chartThis[i].y
					//let newY = chartThis[i - 1].y * 0.25 + chartThis[i].y * 0.5 + chartThis[i + 1].y * 0.25
					let newY = (chartThis[i - 1].y || chartThis[i].y ) * 0.25 + chartThis[i].y * 0.5 + (chartThis[i + 1].y || chartThis[i].y ) * 0.25
					smoothedHistory.push({
						x: chartThis[i].x,
						y: Math.max(Math.min(oldY + maxVariance, newY), oldY - maxVariance)
					})
				}
			}
			chartThis = smoothedHistory
		}
	}
	
	let index = newDataSets.findIndex(obj => obj.label == board)
	
	if (index != -1) {
		newDataSets[index].data = chartThis
	} else {
		let color = availableColors.length ? availableColors.shift() : `hsla(${Math.ceil(Math.random() * 255)},50%,50%,1)`
		newDataSets.push({
			label: board,
			data: chartThis,
			borderColor: color,
			backgroundColor: color
		})
	}
}

let removeBoard = board => {
	let index = newDataSets.findIndex(obj => obj.label == board)
	if (index == -1) return
	let color = newDataSets[index].borderColor
	if (color.startsWith("#")) {
		availableColors.unshift(color)
	}
	newDataSets.splice(index, 1)
}

export default {
	init,
	addBoard,
	removeBoard,
	updateChart,
	generateImage: () => chart.toBase64Image()
}