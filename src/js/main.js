const pino = require("./pino")

pino.info("NODE_ENV is:", process.env.NODE_ENV)

if(location.hostname === "dev.4stats.io"){
	(function() {
		var errorBoxElement = false
		var showError = function(error) {
			if (!errorBoxElement) {
				errorBoxElement = document.createElement('div')
				errorBoxElement.style.position = 'absolute'
				errorBoxElement.style.top = '0'
				errorBoxElement.style.bottom = '0'
				errorBoxElement.style.left = '0'
				errorBoxElement.style.right = '0'
				errorBoxElement.style.background = 'rgba(255, 0, 0, 0.7)'
				errorBoxElement.style.zIndex = 1000000
				errorBoxElement.style.color = '#fff'
				errorBoxElement.style.padding = '10px'
				document.body.appendChild(errorBoxElement)
			}
			var errorLine = document.createElement('div')
			errorLine.innerHTML = error
			errorBoxElement.appendChild(errorLine)
		}
		window.onerror = function(errorMsg, url, lineNumber) {
			showError('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber)
		}
	})()
}

import "css/main.scss"

import Vue from "vue/dist/vue.runtime.esm.js"
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import app from "components/app.vue"
import store from "store/index.js"

const detailedStats = () => import('../components/detailedStats.vue')

const routes = [
	{ path: '/', component: require("../components/index.vue").default },
	{ path: '/snapshotAnalysisWorkInProgress', component: detailedStats },
	{ path: '/config', component: require("../components/config.vue").default },
	{ path: '/feedback', component: require("../components/feedback.vue").default },
	{ path: '*', component: require("../components/index.vue").default }
]

const router = new VueRouter({
	routes,
	mode: 'history',
	scrollBehavior () {
		return { x: 0, y: 0 }
	}
})

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(app)
})