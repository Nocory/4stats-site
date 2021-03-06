import pino from "./pino"

pino.info("NODE_ENV is:", process.env.NODE_ENV)

if (location.hostname === "dev.4stats.io") {
  ;(function() {
    var errorBoxElement = false
    var showError = function(error) {
      if (!errorBoxElement) {
        errorBoxElement = document.createElement("div")
        errorBoxElement.style.position = "absolute"
        errorBoxElement.style.top = "0"
        errorBoxElement.style.bottom = "0"
        errorBoxElement.style.left = "0"
        errorBoxElement.style.right = "0"
        errorBoxElement.style.background = "rgba(255, 0, 0, 0.7)"
        errorBoxElement.style.zIndex = 1000000
        errorBoxElement.style.color = "#fff"
        errorBoxElement.style.padding = "10px"
        document.body.appendChild(errorBoxElement)
      }
      var errorLine = document.createElement("div")
      errorLine.innerHTML = error
      errorBoxElement.appendChild(errorLine)
    }
    window.onerror = function(errorMsg, url, lineNumber) {
      showError("Error: " + errorMsg + " Script: " + url + " Line: " + lineNumber)
    }
  })()
}

import "material-colors/dist/colors.css"
import "css/main.scss"

import Vue from "vue/dist/vue.runtime.esm.js"
import VueRouter from "vue-router"
Vue.use(VueRouter)

import app from "./app.vue"
import store from "store/index.js"

import indexComponent from "../pages/index.vue"
//import flagAnalysisComponent from "../pages/snapperAnalysis.vue"
const flagAnalysisComponent = () => import("../pages/snapperAnalysis.vue")
import aboutComponent from "../pages/about.vue"
//import configComponent from "../pages/config.vue"
import feedbackComponent from "../pages/feedback.vue"

const routes = [
  { path: "/", component: indexComponent },
  { path: "/flagAnalysis", component: flagAnalysisComponent },
  { path: "/about", component: aboutComponent },
  //{ path: '/config', component: configComponent },
  { path: "/feedback", component: feedbackComponent },
  { path: "*", component: indexComponent }
]

const router = new VueRouter({
  routes,
  mode: "history",
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(app)
})
