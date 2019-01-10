//window.moment = require('moment/min/moment.min.js')
//window.moment.tz.setDefault("UTC");

// THE REQUIRED JS HAS BEEN MANUALLY CHANGED TO INSTEAD REQUIRE moment.min IN TURN !!!!!! 
//window.moment = require('./moment-timezone-with-data-custom.js')
import momenttz from './moment-timezone-with-data-custom.js'
window.moment = momenttz
//window.moment = require('./moment-timezone-with-data-custom.js')
//window.moment = require('moment-timezone/builds/moment-timezone-with-data-custom.js')
//window.moment = () => import('./moment-timezone-with-data-custom.js')
window.moment.tz.setDefault("UTC");

const Chart = require('chart.js/dist/Chart.js')
Chart.defaults.global.defaultFontFamily = 'monospace'
Chart.defaults.global.defaultFontSize = 14
const store = require("store/index").default

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
					borderCapStyle: "round",
					//tension: 0.5
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

let addBoard = (board, history, options, updateTime = 500) => {
	const timeRange = options.term == "day" ? {
		min: options.dateStart.getTime(),
		max: options.dateEnd.getTime()
	} : {
		min: Date.now() - 1000 * 60 * 60 * 24 * options.days,
		max: Date.now()
	}
	let chartThis = history.filter(el => el.x > timeRange.min && el.x < timeRange.max)

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
		//let topPPM = board == "combined" ? store.getters.combinedBoardStats.topPPM : store.state.boardData[board].topPPM
		//chartThis = chartThis.map(el => ({x: el.x, y: el.y * 100 / topPPM}))
		chartThis = chartThis.map(el => ({x: el.x, y: el.y ? el.y * 100 / store.state.boardData[board].topPPM : el.y}))
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

	let index = chart.data.datasets.findIndex(obj => obj.label == board)
	if(index != -1 && chart.data.datasets[index].data.length != chartThis.length){
		updateTime = 0
	}
	
	if (index != -1) {
		chart.data.datasets[index].data = chartThis
	} else {
		let color = availableColors.length ? availableColors.shift() : `hsla(${Math.ceil(Math.random() * 255)},50%,50%,1)`
		chart.data.datasets.push({
			label: board,
			data: chartThis,
			borderColor: color,
			backgroundColor: color
		})
	}
	chart.update(updateTime)
}

let removeBoard = board => {
	let index = chart.data.datasets.findIndex(obj => obj.label == board)
	if (index == -1) return
	let color = chart.data.datasets[index].borderColor
	if (color.startsWith("#")) {
		availableColors.unshift(color)
	}
	chart.data.datasets.splice(index, 1)
	chart.update(0)
}

export default {
	init,
	addBoard,
	removeBoard
}